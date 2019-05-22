import { call, fork, put, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/unleashToggles_actions';
import * as actiontyper from '../actions/actiontyper';
import { post } from '../gateway-api';
import * as toggles from '../enums/unleashToggles';

export function* hentUnleashToggles() {
    yield put(actions.henterUnleashToggles());
    try {
        const data = yield call(post, '/syfounleash/', Object.values(toggles));
        yield put(actions.unleashTogglesHentet(data));
    } catch (e) {
        yield put(actions.hentUnleashTogglesFeilet());
    }
}

function* watchHentUnleashToggles() {
    yield takeEvery(actiontyper.HENT_UNLEASH_TOGGLES_FORESPURT, hentUnleashToggles);
}

export default function* unleashTogglesSagas() {
    yield fork(watchHentUnleashToggles);
}
