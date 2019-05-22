import React from 'react';
import { getLedetekst } from '@navikt/digisyfo-npm';
import { Link } from 'react-router';
import setup from '../../utils/soknadSetup';
import Kvittering from './Kvittering';
import { KORRIGERT, NY, SENDT, TIL_SENDING, UTKAST_TIL_KORRIGERING } from '../../enums/soknadstatuser';
import Feilmelding from '../../../components/Feilmelding';
import { soknadPt } from '../../../propTypes/index';
import Sidetopp from '../../../components/Sidetopp';

const validate = () => {
    return {};
};

const SykepengesoknadSelvstendigKvitteringContainer = ({ soknad }) => {
    switch (soknad.status) {
        case NY:
        case UTKAST_TIL_KORRIGERING: {
            return (<div>
                <Sidetopp tittel={getLedetekst('sykepengesoknad.sidetittel')} />
                <Feilmelding tittel={getLedetekst('soknad.kvittering.ugyldig.ny.tittel')}>
                    <span>
                        {getLedetekst('soknad.kvittering.ugyldig.ny.melding')} <Link
                            className="lenke"
                            to={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${soknad.id}`}>{getLedetekst('soknad.kvittering.ugyldig.ny.lenke')}</Link>
                    </span>
                </Feilmelding>
            </div>);
        }
        case KORRIGERT:
        case SENDT:
        case TIL_SENDING: {
            return <Kvittering />;
        }
        default: {
            return <Feilmelding melding="feil status" />;
        }
    }
};

SykepengesoknadSelvstendigKvitteringContainer.propTypes = {
    soknad: soknadPt,
};

export default setup(validate, SykepengesoknadSelvstendigKvitteringContainer, false);
