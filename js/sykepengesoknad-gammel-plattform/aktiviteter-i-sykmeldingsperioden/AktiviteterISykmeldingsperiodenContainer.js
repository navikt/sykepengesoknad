import React from 'react';
import PropTypes from 'prop-types';
import { sykepengesoknadstatuser } from '@navikt/digisyfo-npm';
import AktiviteterISykmeldingsperioden from './AktiviteterISykmeldingsperioden';
import GenerellSoknadContainer from '../soknad/GenerellArbeidstakersoknadContainer';
import StartIgjen from '../../components/soknad-felles/StartIgjen';
import Kvittering from '../kvittering/Kvittering';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';

const { SENDT, TIL_SENDING } = sykepengesoknadstatuser;

export const Controller = (props) => {
    if (props.sykepengesoknad.status === SENDT || props.sykepengesoknad.status === TIL_SENDING) {
        return <Kvittering sykepengesoknad={props.sykepengesoknad} />;
    }
    if (props.skjemasoknad) {
        return <AktiviteterISykmeldingsperioden {...props} />;
    }
    return <StartIgjen soknad={props.sykepengesoknad} />;
};

Controller.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
    skjemasoknad: PropTypes.shape(),
};

const AktiviteterISykmeldingsperiodenContainer = ({ params }) => {
    return <GenerellSoknadContainer Component={Controller} params={params} />;
};

AktiviteterISykmeldingsperiodenContainer.propTypes = {
    params: PropTypes.shape({
        sykepengesoknadId: PropTypes.string,
    }),
};

export default AktiviteterISykmeldingsperiodenContainer;
