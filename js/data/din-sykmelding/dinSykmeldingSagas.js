import { call, put, fork, takeEvery, all } from 'redux-saga/effects';
import { post, log } from '@navikt/digisyfo-npm';
import * as actions from './dinSykmeldingActions';
import * as actiontyper from '../actiontyper';
import { getUrlTilSykmelding } from '../../utils/urlUtils';

const gaTilSykmelding = (sykmeldingId) => {
    window.location.href = getUrlTilSykmelding(sykmeldingId);
};

export function* angreBekreftSykmelding(action) {
    yield put(actions.angrerBekreftSykmelding());
    try {
        yield call(post, `${process.env.REACT_APP_SYFOREST_ROOT}/sykmeldinger/${action.sykmeldingId}/actions/gjenaapne`);
        yield put(actions.bekreftSykmeldingAngret(action.sykmeldingId));
        gaTilSykmelding(action.sykmeldingId);
    } catch (e) {
        log(e);
        yield put(actions.angreBekreftSykmeldingFeilet());
    }
}

function* watchAngreBekreftSykmelding() {
    yield takeEvery(actiontyper.ANGRE_BEKREFT_SYKMELDING_FORESPURT, angreBekreftSykmelding);
}

export default function* dinSykmeldingSagas() {
    yield all([
        fork(watchAngreBekreftSykmelding),
    ]);
}
