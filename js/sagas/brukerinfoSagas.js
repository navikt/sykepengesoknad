import { call, put, fork, takeEvery, all, select } from 'redux-saga/effects';
import { get, getAjax, log } from '@navikt/digisyfo-npm';
import * as actions from '../actions/brukerinfo_actions';
import * as actiontyper from '../actions/actiontyper';
import logger from '../logging';
import {
    skalHenteBrukerinfoSelector,
} from '../selectors/brukerinfoSelectors';

export function* hentBrukerinfo() {
    const skalHente = yield select(skalHenteBrukerinfoSelector);
    if (skalHente) {
        yield put(actions.henterBrukerinfo());
        try {
            const data = yield call(get, `${process.env.REACT_APP_SYFOREST_ROOT}/informasjon/bruker`);
            yield put(actions.brukerinfoHentet(data));
        } catch (e) {
            log(e);
            logger.error(`Kunne ikke hente brukerinfo. URL: ${window.location.href} - ${e.message}`);
            yield put(actions.hentBrukerinfoFeilet());
        }
    }
}

export function* sjekkInnlogging() {
    yield put(actions.sjekkerInnlogging());
    try {
        yield call(getAjax, `${process.env.REACT_APP_CONTEXT_ROOT}/`);
        yield put(actions.setErInnlogget());
    } catch (e) {
        log(e);
        yield put(actions.setErUtlogget());
    }
}

function* watchHentBrukerinfo() {
    yield takeEvery(actiontyper.HENT_BRUKERINFO_FORESPURT, hentBrukerinfo);
}

function* watchSjekkInnlogging() {
    yield takeEvery(actiontyper.SJEKK_INNLOGGING_FORESPURT, sjekkInnlogging);
}

export default function* brukerinfoSagas() {
    yield all([
        fork(watchHentBrukerinfo),
        fork(watchSjekkInnlogging),
    ]);
}
