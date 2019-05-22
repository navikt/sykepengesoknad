import { call, put, fork, takeEvery } from 'redux-saga/effects';
import { post, log } from '@navikt/digisyfo-npm';
import * as actions from './arbeidsgiverperiodeberegning_actions';
import { HENT_ARBEIDSGIVERPERIODEBEREGNING_FORESPURT } from '../../../actions/actiontyper';

export function* hentArbeidsgiverperiodeberegning(action) {
    yield put(actions.henterArbeidsgiverperiodeberegning());
    try {
        const arbeidsgiverperiodeberegning = yield call(post,
            `${process.env.REACT_APP_SYFOREST_ROOT}/soknader/${action.sykepengesoknad.id}/actions/beregn-arbeidsgiverperiode`,
            action.sykepengesoknad);
        const a = actions.arbeidsgiverperiodeberegningHentet(arbeidsgiverperiodeberegning);
        yield put(a);
    } catch (e) {
        log(e);
        yield put(actions.arbeidsgiverperiodeberegningFeilet());
    }
}

function* watchArbeidsgiverperiodeberegning() {
    yield takeEvery(HENT_ARBEIDSGIVERPERIODEBEREGNING_FORESPURT, hentArbeidsgiverperiodeberegning);
}

export default function* beregnArbeidsgiverperiodeSagas() {
    yield fork(watchArbeidsgiverperiodeberegning);
}
