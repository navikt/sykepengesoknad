import { fork, select, takeEvery } from 'redux-saga/effects';
import { log } from '@navikt/digisyfo-npm';
import { SYKEPENGESOKNAD_SENDT } from '../actiontyper';
import { hentMetrikk } from './metrikkerSelectors';
import { SOKNAD_SENDT } from '../../sykepengesoknad/data/soknader/soknaderActiontyper';

const pushToDataLayer = (metrikk) => {
    /* eslint-disable */
    window.dataLayer.push({
        'event': metrikk.type,
        'value': metrikk.data.tid,
        'data': JSON.stringify(metrikk.data),
    });
    /* eslint-enable */
};

export function* lagreMetrikk(action) {
    try {
        const metrikk = yield select(hentMetrikk, action);
        log(metrikk);
        pushToDataLayer(metrikk);
    } catch (e) {
        log(e);
    }
}

function* watch() {
    yield takeEvery([
        SYKEPENGESOKNAD_SENDT,
        SOKNAD_SENDT,
    ], lagreMetrikk);
}

export default function* metrikkerSagas() {
    yield fork(watch);
}
