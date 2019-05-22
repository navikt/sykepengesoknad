import { call, put, fork, takeEvery, all } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { post, log } from '@navikt/digisyfo-npm';
import * as actions from './dinSykmeldingActions';
import * as actiontyper from '../../../actions/actiontyper';

const gaTilSykmelding = (sykmeldingId) => {
    browserHistory.push(`${process.env.REACT_APP_SYKEFRAVAER_CONTEXT_ROOT}/sykmeldinger/${sykmeldingId}/`);
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
