import React from 'react';
import PropTypes from 'prop-types';
import { SENDT } from '../enums/soknadstatuser';
import { ARBEIDSTAKERE, SELVSTENDIGE_OG_FRILANSERE } from '../enums/soknadtyper';
import KvitteringSelvstendig from '../soknad-selvstendig-frilanser/kvittering/Kvittering';
import KvitteringArbeidstaker from '../soknad-arbeidstaker/Kvittering';
import StartIgjen from '../../components/soknad-felles/StartIgjen';
import { skjemasvar as skjemasvarPt, soknadPt } from '../../propTypes/index';
import { getSoknadSkjemanavn } from '../../enums/skjemanavn';

const soknadErSendt = (soknad) => {
    return [SENDT].indexOf(soknad.status) > -1;
};

const Soknadstatussjekker = (props) => {
    const { soknad, skjemasvar, valider, Component, sidenummer } = props;
    const feilmeldinger = valider ? valider(skjemasvar, { soknad, sidenummer }) : {};

    if (soknadErSendt(soknad)
        && (soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE || soknad.soknadstype === ARBEIDSTAKERE)) {
        return soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE
            ? <KvitteringSelvstendig />
            : <KvitteringArbeidstaker />;
    }
    if (Object.keys(feilmeldinger).length > 0) {
        return <StartIgjen soknad={soknad} />;
    }
    return <Component {...props} form={getSoknadSkjemanavn(soknad.id)} />;
};

Soknadstatussjekker.propTypes = {
    soknad: soknadPt,
    skjemasvar: skjemasvarPt,
    valider: PropTypes.func,
    Component: PropTypes.func,
    sidenummer: PropTypes.number,
};

export default Soknadstatussjekker;
