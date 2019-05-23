import { call, put, fork, takeEvery } from 'redux-saga/effects';
import { get, log } from '@navikt/digisyfo-npm';
import * as actions from './vedlikehold_actions';
import * as actiontyper from '../actiontyper';

export function* hentVedlikehold() {
    yield put(actions.henterVedlikehold());
    try {
        const vedlikehold = yield call(get, `${process.env.REACT_APP_SYFOREST_ROOT}/informasjon/vedlikehold`);
        yield put(actions.vedlikeholdHentet(vedlikehold));
    } catch (e) {
        log(e);
        yield put(actions.hentVedlikeholdFeilet());
    }
}

function* watchHentVedlikehold() {
    yield takeEvery(actiontyper.HENT_VEDLIKEHOLD_FORESPURT, hentVedlikehold);
}

export default function* vedlikeholdSagas() {
    yield fork(watchHentVedlikehold);
}
