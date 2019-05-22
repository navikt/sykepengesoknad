import { call, fork, put, select, takeEvery, all } from 'redux-saga/effects';
import { log } from '@navikt/digisyfo-npm';
import { browserHistory } from 'react-router';
import { initialize } from 'redux-form';
import { get, hentApiUrl, post } from '../../../gateway-api';
import * as actions from './soknaderActions';
import {
    SYKMELDING_BEKREFTET,
    SYKMELDING_SENDT,
} from '../../../actions/actiontyper';
import { soknadrespons } from '../../../../test/mock/mockSoknadSelvstendig';
import { toggleBrukMockDataSelvstendigSoknad, toggleBrukMockdataUtland } from '../../../toggles';
import logger from '../../../logging';
import { ARBEIDSTAKERE, OPPHOLD_UTLAND, SELVSTENDIGE_OG_FRILANSERE } from '../../enums/soknadtyper';
import { hentSoknad, skalHenteSoknader, skalHenteSoknaderHvisIkkeHenter } from './soknaderSelectors';
import { populerSoknadMedSvarUtenKonvertertePerioder } from '../../utils/populerSoknadMedSvar';
import fraBackendsoknadTilInitiellSoknad from '../../utils/fraBackendsoknadTilInitiellSoknad';
import { hentSkjemaVerdier } from '../../../selectors/reduxFormSelectors';
import { getSkjemanavnFraSoknad } from '../../utils/getSkjemanavnFraSoknad';
import getContextRoot from '../../../utils/getContextRoot';
import { soknadUtland1 } from '../../../../test/mock/mockSoknadUtland';
import { UTKAST_TIL_KORRIGERING } from '../../enums/soknadstatuser';
import { toggleNyArbeidstakerSoknad } from '../../../selectors/unleashTogglesSelectors';
import { MANGLER_OIDC_TOKEN } from '../../../enums/exceptionMessages';
import {
    AVBRYT_SOKNAD_FORESPURT,
    GJENAPNE_SOKNAD_FORESPURT,
    HENT_SOKNADER_FORESPURT,
    LAGRE_SOKNAD_FORESPURT,
    OPPDATER_SOKNAD_FEILET,
    OPPDATER_SOKNADER_FORESPURT,
    OPPRETT_SYKEPENGESOKNADUTLAND_FORESPURT,
    OPPRETT_UTKAST_TIL_KORRIGERING_FORESPURT,
    SEND_SOKNAD_FORESPURT,
    SOKNAD_AVBRUTT, SOKNAD_ENDRET,
    SOKNAD_SENDT,
} from './soknaderActiontyper';
import {
    SOKNAD_ETTERSENDT_NAV,
} from '../ettersending/ettersendingNav';
import {
    SOKNAD_ETTERSENDT_ARBG,
} from '../ettersending/ettersendingArbeidsgiver';
import history from '../../../history';

const gaTilKvittering = (soknadId) => {
    browserHistory.push(`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${soknadId}/kvittering`);
};

export function* oppdaterSoknader() {
    yield put(actions.henterSoknader());
    try {
        const data = yield call(get, `${hentApiUrl()}/soknader`);
        yield put(actions.soknaderHentet(data));
    } catch (e) {
        log(e);
        if (e.message === MANGLER_OIDC_TOKEN) {
            yield put(actions.henterSoknader());
        } else if (toggleBrukMockDataSelvstendigSoknad()) {
            yield put(actions.soknaderHentet(soknadrespons));
        } else {
            logger.error(`Kunne ikke hente soknader fra syfosoknad. URL: ${window.location.href} - ${e.message}`);
            yield put(actions.hentSoknaderFeilet());
        }
    }
}

export function* oppdaterSoknaderVedLagringFeilet(action) {
    logger.error(`Lagring av av søknad feilet for søknad med ID ${action.soknad.id} og status ${action.soknad.status} ... Henter søknader på nytt.`);
    yield put(actions.henterSoknader());
    try {
        const data = yield call(get, `${hentApiUrl()}/soknader`);
        yield put(actions.soknaderHentet(data));
        const soknad = yield select(hentSoknad, action.soknad);
        logger.info(`Søknader oppdatert etter at lagring feilet. Status for søknad med ID ${soknad.id} var ${action.soknad.status}, og er nå ${soknad.status}`);
    } catch (e) {
        log(e);
        if (e.message === MANGLER_OIDC_TOKEN) {
            yield put(actions.henterSoknader());
        } else {
            logger.error(`Kunne ikke oppdatere soknader fra syfosoknad. URL: ${window.location.href} - ${e.message}`);
            yield put(actions.hentSoknaderFeilet());
        }
    }
}

export function* hentSoknaderHvisIkkeHentet() {
    const skalHente = yield select(skalHenteSoknader);
    if (skalHente) {
        yield oppdaterSoknader();
    }
}

export function* oppdaterSoknaderHvisIkkeHenter() {
    const skalHente = yield select(skalHenteSoknaderHvisIkkeHenter);
    if (skalHente) {
        yield oppdaterSoknader();
    }
}

export function* sendSoknad(action) {
    try {
        const toggle = yield select(toggleNyArbeidstakerSoknad);
        if (action.soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE
            || action.soknad.soknadstype === OPPHOLD_UTLAND
            || (action.soknad.soknadstype === ARBEIDSTAKERE && toggle)) {
            yield put(actions.senderSoknad(action.soknadId));
            yield call(post, `${hentApiUrl()}/sendSoknad`, action.soknad);
            yield put(actions.soknadSendt(action.soknad));
            gaTilKvittering(action.soknad.id);
        } else {
            log('Ukjent søknadstype - kan ikke sende.');
        }
    } catch (e) {
        log(e);
        yield put(actions.sendSoknadFeilet());
    }
}

export function* avbrytSoknad(action) {
    if (action.soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE
        || action.soknad.soknadstype === OPPHOLD_UTLAND
        || action.soknad.soknadstype === ARBEIDSTAKERE) {
        try {
            yield put(actions.avbryterSoknad());
            yield call(post, `${hentApiUrl()}/soknader/${action.soknad.id}/avbryt`);
            yield put(actions.soknadAvbrutt(action.soknad));
            if (action.soknad.soknadstype === OPPHOLD_UTLAND ||
                action.soknad.status === UTKAST_TIL_KORRIGERING) {
                browserHistory.push(`${getContextRoot()}/soknader`);
            } else if (action.soknad.soknadstype === ARBEIDSTAKERE
                || action.soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE) {
                browserHistory.push(`${getContextRoot()}/soknader/${action.soknad.id}`);
            }
        } catch (e) {
            log(e);
            yield put(actions.avbrytSoknadFeilet());
        }
    }
}

export function* gjenapneSoknad(action) {
    if (action.soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE
    || action.soknad.soknadstype === ARBEIDSTAKERE) {
        try {
            yield put(actions.gjenapnerSoknad(action.soknad));
            yield call(post, `${hentApiUrl()}/soknader/${action.soknad.id}/gjenapne`);
            yield put(actions.soknadGjenapnet(action.soknad));
        } catch (e) {
            log(e);
            yield put(actions.gjenapneSoknadFeilet());
        }
    }
}

export function* lagreSoknad(action) {
    const soknad = yield select(hentSoknad, action.soknad);
    const skjemanavn = getSkjemanavnFraSoknad(action.soknad);
    const verdier = yield select(hentSkjemaVerdier, skjemanavn);
    const populertSoknad = populerSoknadMedSvarUtenKonvertertePerioder(soknad, verdier);
    try {
        yield put(actions.oppdatererSoknad(action.soknad));
        const oppdatertSoknad = yield call(post, `${hentApiUrl()}/oppdaterSporsmal`, populertSoknad);
        yield put(actions.soknadOppdatert(oppdatertSoknad));
        yield put(initialize(skjemanavn, fraBackendsoknadTilInitiellSoknad(oppdatertSoknad)));
        history.push(`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${soknad.id}/${action.sidenummer + 1}`);
    } catch (e) {
        log(e);
        yield put(actions.oppdaterSoknadFeilet(action.soknad));
    }
}

export function* oppdaterSporsmalForUtlandssoknad(action) {
    const soknad = yield select(hentSoknad, action.soknad);
    if (soknad.soknadstype === OPPHOLD_UTLAND) {
        const skjemanavn = getSkjemanavnFraSoknad(action.soknad);
        const gamleVerdierISkjema = yield select(hentSkjemaVerdier, skjemanavn);
        const populertSoknad = populerSoknadMedSvarUtenKonvertertePerioder(soknad, gamleVerdierISkjema);
        try {
            const oppdatertSoknad = yield call(post, `${hentApiUrl()}/oppdaterSporsmal`, populertSoknad);
            yield put(actions.soknadOppdatert(oppdatertSoknad));
            yield put(initialize(skjemanavn, fraBackendsoknadTilInitiellSoknad(oppdatertSoknad)));
        } catch (e) {
            log(e);
            yield put(actions.oppdaterSoknadFeilet());
        }
    }
}

const gaTilSkjemaUtland = (soknadUtlandId) => {
    browserHistory.push(`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${soknadUtlandId}`);
};

export function* opprettSoknadUtland() {
    yield put(actions.oppretterSoknadUtland());
    try {
        const data = yield call(post, `${hentApiUrl()}/opprettSoknadUtland`);
        yield put(actions.soknadUtlandOpprettet(data));
        gaTilSkjemaUtland(data.id);
    } catch (e) {
        log(e);
        if (toggleBrukMockdataUtland()) {
            yield put(actions.soknadUtlandOpprettet(soknadUtland1));
            gaTilSkjemaUtland(soknadUtland1.id);
        } else {
            logger.error(`Kunne ikke opprette søknad utland. URL: ${window.location.href} - ${e.message}`);
            yield put(actions.opprettSoknadUtlandFeilet());
        }
    }
}

export function* opprettUtkastTilKorrigering(action) {
    yield put(actions.oppretterKorrigering());
    try {
        const data = yield call(post, `${hentApiUrl()}/soknader/${action.sykepengesoknadsId}/korriger`);
        yield put(actions.korrigeringOpprettet(data));
        browserHistory.push(`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${data.id}`);
    } catch (e) {
        log(e);
        logger.error(`Kunne ikke opprette utkast til korrigering. URL: ${window.location.href} - ${e.message}`);
        yield put(actions.opprettUtkastTilKorrigeringFeilet());
    }
}

function* watchHentSoknader() {
    yield takeEvery(HENT_SOKNADER_FORESPURT, hentSoknaderHvisIkkeHentet);
}

function* watchOppdaterSoknader() {
    yield takeEvery([
        SYKMELDING_BEKREFTET,
        SYKMELDING_SENDT,
        SOKNAD_SENDT,
        SOKNAD_ETTERSENDT_NAV,
        SOKNAD_ETTERSENDT_ARBG,
        SOKNAD_AVBRUTT,
    ], oppdaterSoknader);
}

function* watchOppdaterSoknaderVedOppdaterFeilet() {
    yield takeEvery([
        OPPDATER_SOKNAD_FEILET,
    ], oppdaterSoknaderVedLagringFeilet);
}

function* watchOppdaterSoknaderHvisIkkehenter() {
    yield takeEvery([OPPDATER_SOKNADER_FORESPURT], oppdaterSoknaderHvisIkkeHenter);
}

function* watchSendSoknad() {
    yield takeEvery(SEND_SOKNAD_FORESPURT, sendSoknad);
}

function* watchAvbrytSoknad() {
    yield takeEvery(AVBRYT_SOKNAD_FORESPURT, avbrytSoknad);
}

function* watchGjenapneSoknad() {
    yield takeEvery(GJENAPNE_SOKNAD_FORESPURT, gjenapneSoknad);
}

function* watchOpprettSoknadUtland() {
    yield takeEvery(OPPRETT_SYKEPENGESOKNADUTLAND_FORESPURT, opprettSoknadUtland);
}

function* watchLagreSoknad() {
    yield takeEvery(LAGRE_SOKNAD_FORESPURT, lagreSoknad);
}

function* watchOppdaterUtlandssoknad() {
    yield takeEvery(SOKNAD_ENDRET, oppdaterSporsmalForUtlandssoknad);
}

function* watchOpprettUtkastTilKorrigering() {
    yield takeEvery(OPPRETT_UTKAST_TIL_KORRIGERING_FORESPURT, opprettUtkastTilKorrigering);
}

export default function* soknaderSagas() {
    yield all([
        fork(watchHentSoknader),
        fork(watchSendSoknad),
        fork(watchOppdaterSoknader),
        fork(watchAvbrytSoknad),
        fork(watchOpprettSoknadUtland),
        fork(watchGjenapneSoknad),
        fork(watchOpprettUtkastTilKorrigering),
        fork(watchLagreSoknad),
        fork(watchOppdaterSoknaderHvisIkkehenter),
        fork(watchOppdaterSoknaderVedOppdaterFeilet),
        fork(watchOppdaterUtlandssoknad),
    ]);
}
