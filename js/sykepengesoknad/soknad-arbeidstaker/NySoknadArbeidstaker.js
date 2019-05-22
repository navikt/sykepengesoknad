import React from 'react';
import PropTypes from 'prop-types';
import beregnSteg, { KVITTERING } from '../utils/beregnSteg';
import SoknadKvitteringSjekker from '../felleskomponenter/SoknadKvitteringSjekker';
import { soknadPt } from '../../propTypes';
import { AVBRUTT, KORRIGERT, NY, SENDT, UTKAST_TIL_KORRIGERING } from '../enums/soknadstatuser';
import NySendtSoknadArbeidstaker from './NySendtSoknadArbeidstaker';
import Feilmelding from '../../components/Feilmelding';
import AvbruttSoknadArbeidstaker from './AvbruttSoknadArbeidstaker';
import EttSporsmalPerSideContainer from '../felleskomponenter/ett-sporsmal-per-side/EttSporsmalPerSideContainer';

const NySoknadArbeidstakerSkjema = (props) => {
    const { sti } = props;
    const steg = beregnSteg(sti);
    switch (steg) {
        case KVITTERING: {
            return <SoknadKvitteringSjekker soknad={props.soknad} />;
        }
        default: {
            return <EttSporsmalPerSideContainer {...props} />;
        }
    }
};

NySoknadArbeidstakerSkjema.propTypes = {
    sti: PropTypes.string,
    soknad: soknadPt,
};

const NySoknadArbeidstaker = (props) => {
    const { soknad, sti } = props;
    switch (soknad.status) {
        case NY:
        case UTKAST_TIL_KORRIGERING: {
            return <NySoknadArbeidstakerSkjema {...props} />;
        }
        case SENDT:
        case KORRIGERT: {
            if (beregnSteg(sti) === KVITTERING) {
                return <SoknadKvitteringSjekker {...props} />;
            }
            return <NySendtSoknadArbeidstaker {...props} />;
        }
        case AVBRUTT: {
            return <AvbruttSoknadArbeidstaker {...props} />;
        }
        default: {
            return <Feilmelding melding="Søknaden har ukjent status" />;
        }
    }
};

NySoknadArbeidstaker.propTypes = {
    sti: PropTypes.string,
    soknad: soknadPt,
};

export default NySoknadArbeidstaker;
