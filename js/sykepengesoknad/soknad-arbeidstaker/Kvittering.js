import React from 'react';
import { soknadPt } from '../../propTypes';
import KvitteringArbeidstakersoknad from '../../sykepengesoknad-gammel-plattform/kvittering/Kvittering';
import ArbeidsledigKvittering from '../soknad-arbeidsledig/ArbeidsledigKvittering';
import { ARBEIDSLEDIG, BEHANDLINGSDAGER } from '../enums/soknadtyper';
import BehandlingsdagerKvittering from '../soknad-behandlingsdager/BehandlingsdagerKvittering';

const Kvittering = ({ soknad }) => {
    if (soknad.soknadstype === ARBEIDSLEDIG) {
        return (<ArbeidsledigKvittering soknad={soknad} />);
    }
    if (soknad.soknadstype === BEHANDLINGSDAGER) {
        return (<BehandlingsdagerKvittering soknad={soknad} />);
    }

    return (<KvitteringArbeidstakersoknad sykepengesoknad={soknad} />);
};

Kvittering.propTypes = {
    soknad: soknadPt,
};

export default Kvittering;
