import { ledetekster, timeout } from '@navikt/digisyfo-npm';
import { reducer as formReducer } from 'redux-form';
import arbeidsgiverperiodeberegning from '../sykepengesoknad-gammel-plattform/data/arbeidsgiverperiodeberegning/arbeidsgiverperiodeberegning';
import brukerinfo from './brukerinfo';
import dineSykmeldinger from '../sykmeldinger/data/dine-sykmeldinger/dineSykmeldinger';
import sykepengesoknader from '../sykepengesoknad-gammel-plattform/data/sykepengesoknader/sykepengesoknader';
import reduxFormMeta from './reduxFormMeta';
import soknader from '../sykepengesoknad/data/soknader/soknader';
import unleashToggles from './unleashToggles';
import metrikker from './metrikker';
import history from '../history';
import soknadMeta from '../sykepengesoknad/data/soknadMeta/soknadMeta';
import ettersendingNav from '../sykepengesoknad/data/ettersending/ettersendingNav';
import ettersendingArbeidsgiver from '../sykepengesoknad/data/ettersending/ettersendingArbeidsgiver';
import vedlikehold from './vedlikehold';
import ledere from '../landingsside/data/ledere/ledere';

const reducers = {
    arbeidsgiverperiodeberegning,
    brukerinfo,
    dineSykmeldinger,
    history,
    ledetekster,
    sykepengesoknader,
    timeout,
    form: formReducer,
    formMeta: reduxFormMeta,
    soknader,
    unleashToggles,
    metrikker,
    soknadMeta,
    ettersendingNav,
    ettersendingArbeidsgiver,
    vedlikehold,
    ledere,
};

export default reducers;
