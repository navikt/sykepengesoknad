import React from 'react';
import { soknadPt } from '../../propTypes';
import KvitteringArbeidstakersoknad from '../../sykepengesoknad-gammel-plattform/kvittering/Kvittering';
import ArbeidsledigKvittering from '../soknad-arbeidsledig/ArbeidsledigKvittering';
import { ANNET_ARBEIDSFORHOLD, ARBEIDSLEDIG, BEHANDLINGSDAGER, SELVSTENDIGE_OG_FRILANSERE } from '../enums/soknadtyper';
import BehandlingsdagerKvittering from '../soknad-behandlingsdager/BehandlingsdagerKvittering';
import KvitteringSelvstendige from '../soknad-selvstendig-frilanser/kvittering/Kvittering';
import { ARBEIDSSITUASJON_ARBEIDSLEDIG, ARBEIDSSITUASJON_FRILANSER, ARBEIDSSITUASJON_SELVSTENDIG, ARBEIDSSITUASJON_ANNET } from '../enums/arbeidssituasjon';
import AnnetArbeidsforholdKvittering from '../soknad-annet-arbeidsforhold/AnnetArbeidsforholdKvittering';

const selvstendigOgFrilanser = (soknad) => {
    return (soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE) ||
        (soknad.soknadstype === BEHANDLINGSDAGER && soknad.arbeidssituasjon === ARBEIDSSITUASJON_FRILANSER) ||
        (soknad.soknadstype === BEHANDLINGSDAGER && soknad.arbeidssituasjon === ARBEIDSSITUASJON_SELVSTENDIG);
};

const arbeidsledig = (soknad) => {
    return (soknad.soknadstype === ARBEIDSLEDIG) ||
        (soknad.soknadstype === BEHANDLINGSDAGER && soknad.arbeidssituasjon === ARBEIDSSITUASJON_ARBEIDSLEDIG);
};

const annetArbeidsforhold = (soknad) => {
    return (soknad.soknadstype === ANNET_ARBEIDSFORHOLD) ||
        (soknad.soknadstype === BEHANDLINGSDAGER && soknad.arbeidssituasjon === ARBEIDSSITUASJON_ANNET);
};

const behandlingsdager = (soknad) => {
    return soknad.soknadstype === BEHANDLINGSDAGER;
};

const Kvittering = ({ soknad }) => {
    if (selvstendigOgFrilanser(soknad)) {
        return (<KvitteringSelvstendige />);
    }
    if (arbeidsledig(soknad)) {
        return (<ArbeidsledigKvittering soknad={soknad} />);
    }
    if (annetArbeidsforhold(soknad)) {
        return (<AnnetArbeidsforholdKvittering soknad={soknad} />);
    }
    if (behandlingsdager(soknad)) {
        return (<BehandlingsdagerKvittering soknad={soknad} />);
    }

    return (<KvitteringArbeidstakersoknad sykepengesoknad={soknad} />);
};

Kvittering.propTypes = {
    soknad: soknadPt,
};

export default Kvittering;
