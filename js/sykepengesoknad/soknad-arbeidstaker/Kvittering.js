import React from 'react';
import { soknadPt } from '../../propTypes';
import KvitteringArbeidstakersoknad from '../../sykepengesoknad-gammel-plattform/kvittering/Kvittering';
import ArbeidsledigKvittering from '../soknad-arbeidsledig/ArbeidsledigKvittering';
import { ARBEIDSLEDIG, BEHANDLINGSDAGER, SELVSTENDIGE_OG_FRILANSERE } from '../enums/soknadtyper';
import BehandlingsdagerKvittering from '../soknad-behandlingsdager/BehandlingsdagerKvittering';
import KvitteringSelvstendige from '../soknad-selvstendig-frilanser/kvittering/Kvittering';

const selvstendigOgFrilanser = (soknad) => {
    return (soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE) ||
        (soknad.soknadstype === BEHANDLINGSDAGER && soknad.arbeidssituasjon === SELVSTENDIGE_OG_FRILANSERE);
};

const arbeidsledig = (soknad) => {
    return (soknad.soknadstype === ARBEIDSLEDIG) ||
        (soknad.soknadstype === BEHANDLINGSDAGER && soknad.arbeidssituasjon === ARBEIDSLEDIG);
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
    if (behandlingsdager(soknad)) {
        return (<BehandlingsdagerKvittering soknad={soknad} />);
    }

    return (<KvitteringArbeidstakersoknad sykepengesoknad={soknad} />);
};

Kvittering.propTypes = {
    soknad: soknadPt,
};

export default Kvittering;
