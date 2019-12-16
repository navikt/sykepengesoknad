import React from 'react';
import PropTypes from 'prop-types';
import beregnSteg, { KVITTERING } from '../utils/beregnSteg';
import SoknadKvitteringSjekker from '../felleskomponenter/SoknadKvitteringSjekker';
import { soknadPt } from '../../propTypes';
import { AVBRUTT, KORRIGERT, NY, SENDT, UTKAST_TIL_KORRIGERING } from '../enums/soknadstatuser';
import Feilmelding from '../../components/Feilmelding';
import EttSporsmalPerSideContainer from '../felleskomponenter/ett-sporsmal-per-side/EttSporsmalPerSideContainer';
import SendtSoknadBehandlingsdager from './SendtSoknadBehandlingsdager';
import AvbruttSoknadBehandlingsdager from './AvbruttSoknadBehandlingsdager';

const SoknadBehandlingsdagerSkjema = (props) => {
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

SoknadBehandlingsdagerSkjema.propTypes = {
    sti: PropTypes.string,
    soknad: soknadPt,
};

const SoknadBehandlingsdager = (props) => {
    const { soknad, sti } = props;
    switch (soknad.status) {
        case NY:
        case UTKAST_TIL_KORRIGERING: {
            return <SoknadBehandlingsdagerSkjema {...props} />;
        }
        case SENDT:
        case KORRIGERT: {
            if (beregnSteg(sti) === KVITTERING) {
                return <SoknadKvitteringSjekker {...props} />;
            }
            return <SendtSoknadBehandlingsdager {...props} />;
        }
        case AVBRUTT: {
            return <AvbruttSoknadBehandlingsdager {...props} />;
        }
        default: {
            return <Feilmelding melding="Søknaden har ukjent status" />;
        }
    }
};

SoknadBehandlingsdager.propTypes = {
    sti: PropTypes.string,
    soknad: soknadPt,
};

export default SoknadBehandlingsdager;
