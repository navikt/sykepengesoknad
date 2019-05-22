import React from 'react';
import PropTypes from 'prop-types';
import beregnSteg, {
    KVITTERING,
} from '../utils/beregnSteg';
import { soknadPt } from '../../propTypes';
import SoknadKvitteringSjekker from '../felleskomponenter/SoknadKvitteringSjekker';
import EttSporsmalPerSideContainer from '../felleskomponenter/ett-sporsmal-per-side/EttSporsmalPerSideContainer';
import { AVBRUTT, KORRIGERT, NY, SENDT, UTKAST_TIL_KORRIGERING } from '../enums/soknadstatuser';
import Feilmelding from '../../components/Feilmelding';
import SendtSoknadSelvstendig from './SendtSoknadSelvstendig';
import AvbruttSoknadSelvstendig from './AvbruttSoknadSelvstendig';

const SoknadSelvstendigNaeringsdrivendeSkjema = (props) => {
    const { sti } = props;
    const steg = beregnSteg(sti);
    switch (steg) {
        case KVITTERING: {
            return <SoknadKvitteringSjekker {...props} />;
        }
        default: {
            return <EttSporsmalPerSideContainer {...props} />;
        }
    }
};

SoknadSelvstendigNaeringsdrivendeSkjema.propTypes = {
    sti: PropTypes.string,
    soknad: soknadPt,
};

const SoknadSelvstendigNaeringsdrivende = (props) => {
    const { soknad, sti } = props;
    switch (soknad.status) {
        case NY:
        case UTKAST_TIL_KORRIGERING: {
            return <SoknadSelvstendigNaeringsdrivendeSkjema {...props} />;
        }
        case SENDT:
        case KORRIGERT: {
            if (beregnSteg(sti) === KVITTERING) {
                return <SoknadKvitteringSjekker {...props} />;
            }
            return <SendtSoknadSelvstendig {...props} />;
        }
        case AVBRUTT: {
            return <AvbruttSoknadSelvstendig {...props} />;
        }
        default: {
            return <Feilmelding melding="Søknaden har ukjent status" />;
        }
    }
};

SoknadSelvstendigNaeringsdrivende.propTypes = {
    sti: PropTypes.string,
    soknad: soknadPt,
};

export default SoknadSelvstendigNaeringsdrivende;
