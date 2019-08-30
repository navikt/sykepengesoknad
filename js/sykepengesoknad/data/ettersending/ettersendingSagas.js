/* eslint arrow-body-style: ["error", "as-needed"] */
import { call, fork, put, takeEvery, all } from 'redux-saga/effects';
import { log } from '@navikt/digisyfo-npm';
import { hentApiUrl, post } from '../../../gateway-api';

import {
    ETTERSEND_SOKNAD_ARBG_FORESPURT,
    ettersenderSoknadTilArbeidsgiver, ettersendSoknadTilArbeidsgiverFeilet, soknadEttersendtTilArbeidsgiver,
    soknadAlleredeEttersendtTilArbeidsgiver,
} from './ettersendingArbeidsgiver';
import {
    ETTERSEND_SOKNAD_NAV_FORESPURT,
    ettersenderSoknadTilNav, ettersendSoknadTilNavFeilet, soknadEttersendtTilNav, soknadAlleredeEttersendtTilNav,
} from './ettersendingNav';


export function* ettersendSoknadNav(action) {
    try {
        yield put(ettersenderSoknadTilNav(action.soknadId));
        yield call(post, `${hentApiUrl()}/soknader/${action.soknadId}/ettersendTilNav`);
        yield put(soknadEttersendtTilNav());
    } catch (e) {
        log(e);
        if (e.toString().endsWith('409')) {
            yield put(soknadAlleredeEttersendtTilNav());
            return;
        }
        yield put(ettersendSoknadTilNavFeilet());
    }
}

export function* ettersendSoknadArbeidsgiver(action) {
    try {
        yield put(ettersenderSoknadTilArbeidsgiver(action.soknadId));
        yield call(post, `${hentApiUrl()}/soknader/${action.soknadId}/ettersendTilArbeidsgiver`);
        yield put(soknadEttersendtTilArbeidsgiver());
    } catch (e) {
        log(e);
        if (e.toString().endsWith('409')) {
            yield put(soknadAlleredeEttersendtTilArbeidsgiver());
            return;
        }
        yield put(ettersendSoknadTilArbeidsgiverFeilet());
    }
}

function* watchEttersendSoknadNav() {
    yield takeEvery(ETTERSEND_SOKNAD_NAV_FORESPURT, ettersendSoknadNav);
}

function* watchEttersendSoknadArbeidsgiver() {
    yield takeEvery(ETTERSEND_SOKNAD_ARBG_FORESPURT, ettersendSoknadArbeidsgiver);
}

export default function* ettersendingSagas() {
    yield all([
        fork(watchEttersendSoknadNav),
        fork(watchEttersendSoknadArbeidsgiver),
    ]);
}
