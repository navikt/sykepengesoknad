import React from 'react';
import { soknadPt } from '../../propTypes';
import KvitteringArbeidstakersoknad from '../../sykepengesoknad-gammel-plattform/kvittering/Kvittering';
import ArbeidsledigKvittering from '../soknad-arbeidsledig/ArbeidsledigKvittering';
import { ARBEIDSLEDIG } from '../enums/soknadtyper';

const Kvittering = ({ soknad }) => {
    return (
        soknad.soknadstype === ARBEIDSLEDIG
            ? <ArbeidsledigKvittering soknad={soknad} />
            : <KvitteringArbeidstakersoknad sykepengesoknad={soknad} />
    );
};

Kvittering.propTypes = {
    soknad: soknadPt,
};

export default Kvittering;
