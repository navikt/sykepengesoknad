import React from 'react';
import { soknadPt } from '../../propTypes';
import KvitteringArbeidstakersoknad from '../../sykepengesoknad-gammel-plattform/kvittering/Kvittering';

const Kvittering = ({ soknad }) => {
    return (<KvitteringArbeidstakersoknad sykepengesoknad={soknad} />);
};

Kvittering.propTypes = {
    soknad: soknadPt,
};

export default Kvittering;
