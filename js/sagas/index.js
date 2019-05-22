import { all } from 'redux-saga/effects';
import {
    ledeteksterSagas,
    tidslinjerSagas,
    togglesSagas,
    sykeforlopsPerioderSagas,
} from '@navikt/digisyfo-npm';
import brukerinfoSagas from './brukerinfoSagas';
import dineSykmeldingerSagas from '../sykmeldinger/data/dine-sykmeldinger/dineSykmeldingerSagas';
import sykepengesoknadSagas from '../sykepengesoknad-gammel-plattform/data/sykepengesoknader/sykepengesoknadSagas';
import vedlikeholdSagas from './vedlikeholdSagas';
import beregnArbeidsgiverperiodeSagas from '../sykepengesoknad-gammel-plattform/data/arbeidsgiverperiodeberegning/beregnArbeidsgiverperiodeSagas';
import soknaderSagas from '../sykepengesoknad/data/soknader/soknaderSagas';
import unleashTogglesSagas from './unleashTogglesSagas';
import metrikkerSagas from './metrikkerSagas';
import soknadMetaSagas from '../sykepengesoknad/data/soknadMeta/soknadMetaSagas';
import ettersendingSagas from '../sykepengesoknad/data/ettersending/ettersendingSagas';
import dinSykmeldingSagas from '../sykmeldinger/data/din-sykmelding/dinSykmeldingSagas';
import ledereSagas from '../landingsside/data/ledere/ledereSagas';

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
