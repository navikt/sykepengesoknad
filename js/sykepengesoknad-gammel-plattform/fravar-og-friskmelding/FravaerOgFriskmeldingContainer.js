import React from 'react';
import PropTypes from 'prop-types';
import { sykepengesoknadstatuser } from '@navikt/digisyfo-npm';
import FravaerOgFriskmelding from './FravaerOgFriskmelding';
import GenerellSoknadContainer from '../soknad/GenerellArbeidstakersoknadContainer';
import StartIgjen from '../../components/soknad-felles/StartIgjen';
import Kvittering from '../kvittering/Kvittering';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';

export const Controller = (props) => {
    if (props.sykepengesoknad.status === sykepengesoknadstatuser.SENDT || props.sykepengesoknad.status === sykepengesoknadstatuser.TIL_SENDING) {
        return <Kvittering sykepengesoknad={props.sykepengesoknad} />;
    }
    if (props.skjemasoknad) {
        return <FravaerOgFriskmelding {...props} />;
    }
    return <StartIgjen soknad={props.sykepengesoknad} />;
};

Controller.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
    skjemasoknad: PropTypes.shape(),
};

const FravaerOgFriskmeldingContainer = ({ params }) => {
    return <GenerellSoknadContainer Component={Controller} params={params} />;
};

FravaerOgFriskmeldingContainer.propTypes = {
    params: PropTypes.shape({
        sykepengesoknadId: PropTypes.string,
    }),
};

export default FravaerOgFriskmeldingContainer;
