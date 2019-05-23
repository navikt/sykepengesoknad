import { all } from 'redux-saga/effects';
import {
    ledeteksterSagas,
    tidslinjerSagas,
    togglesSagas,
    sykeforlopsPerioderSagas,
} from '@navikt/digisyfo-npm';
import brukerinfoSagas from './brukerinfo/brukerinfoSagas';
import dineSykmeldingerSagas from './dine-sykmeldinger/dineSykmeldingerSagas';
import sykepengesoknadSagas from '../sykepengesoknad-gammel-plattform/data/sykepengesoknader/sykepengesoknadSagas';
import vedlikeholdSagas from './vedlikehold/vedlikeholdSagas';
import beregnArbeidsgiverperiodeSagas from '../sykepengesoknad-gammel-plattform/data/arbeidsgiverperiodeberegning/beregnArbeidsgiverperiodeSagas';
import soknaderSagas from '../sykepengesoknad/data/soknader/soknaderSagas';
import unleashTogglesSagas from './unleashToggles/unleashTogglesSagas';
import metrikkerSagas from './metrikker/metrikkerSagas';
import soknadMetaSagas from '../sykepengesoknad/data/soknadMeta/soknadMetaSagas';
import ettersendingSagas from '../sykepengesoknad/data/ettersending/ettersendingSagas';
import dinSykmeldingSagas from './din-sykmelding/dinSykmeldingSagas';
import ledereSagas from './ledere/ledereSagas';

export default function* rootSaga() {
    yield all([
        brukerinfoSagas(),
        beregnArbeidsgiverperiodeSagas(),
        dineSykmeldingerSagas(),
        sykepengesoknadSagas(),
        ledeteksterSagas(),
        tidslinjerSagas(),
        vedlikeholdSagas(),
        togglesSagas(),
        sykeforlopsPerioderSagas(),
        soknaderSagas(),
        unleashTogglesSagas(),
        metrikkerSagas(),
        soknadMetaSagas(),
        ettersendingSagas(),
        dinSykmeldingSagas(),
        ledereSagas(),
    ]);
}
