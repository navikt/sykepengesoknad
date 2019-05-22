import { call, put, fork, takeEvery, all, select } from 'redux-saga/effects';
import { get, log } from '@navikt/digisyfo-npm';
import * as actions from './dineSykmeldingerActions';
import * as actiontyper from '../../../actions/actiontyper';
import { selectSkalHenteDineSykmeldinger } from './dineSykmeldingerSelectors';

export function* oppdaterDineSykmeldinger() {
    yield put(actions.henterDineSykmeldinger());
    try {
        const data = yield call(get, `${process.env.REACT_APP_SYFOREST_ROOT}/sykmeldinger`);
        yield put(actions.setDineSykmeldinger(data));
    } catch (e) {
        log(e);
        yield put(actions.hentDineSykmeldingerFeilet());
    }
}

export function* hentDineSykmeldingerHvisIkkeHentet() {
    const skalHente = yield select(selectSkalHenteDineSykmeldinger);
    if (skalHente) {
        yield oppdaterDineSykmeldinger();
    }
}

function* watchOppdaterDineSykmeldinger() {
    yield takeEvery([
        actiontyper.SYKMELDING_BEKREFTET,
        actiontyper.SYKMELDING_SENDT,
        actiontyper.SYKMELDING_AVBRUTT,
        actiontyper.SYKMELDING_GJENAAPNET,
        actiontyper.BEKREFT_SYKMELDING_ANGRET,
    ], oppdaterDineSykmeldinger);
}

function* watchHentDineSykmeldinger() {
    yield takeEvery(actiontyper.HENT_DINE_SYKMELDINGER_FORESPURT, hentDineSykmeldingerHvisIkkeHentet);
}

export default function* dineSykmeldingerSagas() {
    yield all([
        fork(watchOppdaterDineSykmeldinger),
        fork(watchHentDineSykmeldinger),
    ]);
}
