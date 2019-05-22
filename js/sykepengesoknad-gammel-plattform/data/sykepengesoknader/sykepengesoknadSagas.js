import { call, fork, put, select, takeEvery, all } from 'redux-saga/effects';
import { get, log, post } from '@navikt/digisyfo-npm';
import { browserHistory } from 'react-router';
import * as actions from './sykepengesoknader_actions';
import * as actiontyper from '../../../actions/actiontyper';
import history from '../../../history';
import { finnSoknad } from './sykepengesoknader';
import logger from '../../../logging';
import { skalHenteSykepengesoknader } from '../../../selectors/sykepengesoknaderSelectors';

const gaTilKvittering = (sykepengesoknadsId) => {
    browserHistory.push(`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${sykepengesoknadsId}/kvittering`);
};

export function* oppdaterSykepengesoknader() {
    yield put(actions.henterSykepengesoknader());
    try {
        const data = yield call(get, `${process.env.REACT_APP_SYFOREST_ROOT}/soknader`);
        yield put(actions.sykepengesoknaderHentet(data));
    } catch (e) {
        log(e);
        logger.error(`Kunne ikke hente sykepengesoknader. URL: ${window.location.href} - ${e.message}`);
        yield put(actions.hentSykepengesoknaderFeilet());
    }
}

export function* hentSykepengesoknaderHvisIkkeHentet() {
    const skalHente = yield select(skalHenteSykepengesoknader);
    if (skalHente) {
        yield oppdaterSykepengesoknader();
    }
}

export function* sendSykepengesoknad(action) {
    yield put(actions.senderSykepengesoknad());
    try {
        const sykepengesoknad = yield call(post, `${process.env.REACT_APP_SYFOREST_ROOT}/soknader/${action.sykepengesoknad.id}/actions/send`, action.sykepengesoknad);
        yield put(actions.sykepengesoknadSendt(action.sykepengesoknad.id, sykepengesoknad));
    } catch (e) {
        log(e);
        logger.error(`Kunne ikke sende sykepengesøknad. URL: ${window.location.href} - ${e.message}`);
        yield put(actions.sendSykepengesoknadFeilet());
    }
}

export function* sendSykepengesoknadTilArbeidsgiver(action) {
    yield put(actions.senderSykepengesoknad());
    try {
        const sykepengesoknad = yield call(post, `${process.env.REACT_APP_SYFOREST_ROOT}/soknader/${action.sykepengesoknadsId}/actions/send-til-arbeidsgiver`);
        yield put(actions.sykepengesoknadSendtTilArbeidsgiver(action.sykepengesoknadsId, sykepengesoknad));
    } catch (e) {
        log(e);
        logger.error(`Kunne ikke sende sykepengesøknad til arbeidsgiver. URL: ${window.location.href} - ${e.message}`);
        yield put(actions.sendSykepengesoknadFeilet());
    }
}

export function* sendSykepengesoknadTilNAV(action) {
    yield put(actions.senderSykepengesoknad());
    try {
        const sykepengesoknad = yield call(post, `${process.env.REACT_APP_SYFOREST_ROOT}/soknader/${action.sykepengesoknadsId}/actions/send-til-nav`);
        yield put(actions.sykepengesoknadSendtTilNAV(action.sykepengesoknadsId, sykepengesoknad));
    } catch (e) {
        log(e);
        logger.error(`Kunne ikke sende sykepengesøknad til NAV. URL: ${window.location.href} - ${e.message}`);
        yield put(actions.sendSykepengesoknadFeilet());
    }
}

export function* startEndring(action) {
    try {
        const sykepengesoknad = yield call(post, `${process.env.REACT_APP_SYFOREST_ROOT}/soknader/${action.sykepengesoknadsId}/actions/korriger`);
        yield put(actions.endringStartet(sykepengesoknad));
        yield history.push(`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${sykepengesoknad.id}`);
    } catch (e) {
        log(e);
        yield put(actions.startEndringFeilet());
    }
}

export function* hentBerikelse(action) {
    const soknad = yield select(finnSoknad, action.sykepengesoknadsId);
    if (!soknad.id) {
        yield call(oppdaterSykepengesoknader);
    }

    yield put(actions.henterBerikelse());
    try {
        const data = yield call(get, `${process.env.REACT_APP_SYFOREST_ROOT}/soknader/${action.sykepengesoknadsId}/berik`);
        yield put(actions.berikelseHentet(data, action.sykepengesoknadsId));
    } catch (e) {
        log(e);
        logger.error(`Kunne ikke hente berikelse av søknaden. URL: ${window.location.href} - ${e.message}`);
        yield put(actions.hentBerikelseFeilet());
    }
}

export function* avbrytSoknad(action) {
    yield put(actions.avbryterSoknad());
    try {
        yield call(post, `${process.env.REACT_APP_SYFOREST_ROOT}/soknader/${action.sykepengesoknad.id}/actions/avbryt`);
        yield put(actions.soknadAvbrutt(action.sykepengesoknad.id));
        gaTilKvittering(action.sykepengesoknad.id);
    } catch (e) {
        log(e);
        logger.error(`Kunne ikke avbryte søknad. URL: ${window.location.href} - ${e.message}`);
        yield put(actions.avbrytSoknadFeilet());
    }
}

export function* gjenapneSoknad(action) {
    yield put(actions.gjenapnerSoknad());
    try {
        yield call(post, `${process.env.REACT_APP_SYFOREST_ROOT}/soknader/${action.sykepengesoknad.id}/actions/gjenapne`);
        yield put(actions.soknadGjenapnet(action.sykepengesoknad.id));
    } catch (e) {
        log(e);
        logger.error(`Kunne ikke gjenåpne søknad. URL: ${window.location.href} - ${e.message}`);
        yield put(actions.gjenapneSoknadFeilet());
    }
}

function* watchHentBerikelse() {
    yield takeEvery(actiontyper.SYKEPENGESOKNAD_BERIKELSE_FORESPURT, hentBerikelse);
}

function* watchHentSykepengesoknader() {
    yield takeEvery(actiontyper.HENT_SYKEPENGESOKNADER_FORESPURT, hentSykepengesoknaderHvisIkkeHentet);
}

function* watchSendSykepengesoknad() {
    yield takeEvery(actiontyper.SEND_SYKEPENGESOKNAD_FORESPURT, sendSykepengesoknad);
}

function* watchSendSykepengesoknadTilNAV() {
    yield takeEvery(actiontyper.SEND_SYKEPENGESOKNAD_TIL_NAV_FORESPURT, sendSykepengesoknadTilNAV);
}

function* watchSendSykepengesoknadTilArbeidsgiver() {
    yield takeEvery(actiontyper.SEND_SYKEPENGESOKNAD_TIL_ARBEIDSGIVER_FORESPURT, sendSykepengesoknadTilArbeidsgiver);
}

function* watchSykmeldingSendt() {
    yield takeEvery(actiontyper.SYKMELDING_SENDT, oppdaterSykepengesoknader);
}

function* watchEndreSykepengesoknad() {
    yield takeEvery(actiontyper.START_ENDRING_SYKEPENGESOKNAD_FORESPURT, startEndring);
}

function* watchAvbrytSoknad() {
    yield takeEvery(actiontyper.AVBRYT_SYKEPENGESOKNAD_FORESPURT, avbrytSoknad);
}

function* watchGjenapneSoknad() {
    yield takeEvery(actiontyper.GJENAPNE_SYKEPENGESOKNAD_FORESPURT, gjenapneSoknad);
}

export default function* sykepengesoknadSagas() {
    yield all([
        fork(watchHentSykepengesoknader),
        fork(watchSendSykepengesoknad),
        fork(watchSykmeldingSendt),
        fork(watchSendSykepengesoknadTilNAV),
        fork(watchSendSykepengesoknadTilArbeidsgiver),
        fork(watchEndreSykepengesoknad),
        fork(watchHentBerikelse),
        fork(watchAvbrytSoknad),
        fork(watchGjenapneSoknad),
    ]);
}
