import React from 'react';
import PropTypes from 'prop-types';
import beregnSteg, { KVITTERING } from '../utils/beregnSteg';
import SoknadKvitteringSjekker from '../felleskomponenter/SoknadKvitteringSjekker';
import UtgaattSoknad from '../felleskomponenter/utgaatt-soknad/UtgaattSoknad';
import { soknadPt } from '../../propTypes';
import { AVBRUTT, KORRIGERT, NY, SENDT, UTKAST_TIL_KORRIGERING, UTGAATT } from '../enums/soknadstatuser';
import Feilmelding from '../../components/Feilmelding';
import EttSporsmalPerSideContainer from '../felleskomponenter/ett-sporsmal-per-side/EttSporsmalPerSideContainer';
import SendtSoknadAnnetArbeidsforhold from '../soknad-arbeidsledig/SendtSoknadArbeidsledig';
import AvbruttSoknadAnnetArbeidsforhold from '../soknad-arbeidsledig/AvbruttSoknadArbeidsledig';

const SoknadAnnetArbeidsforholdSkjema = (props) => {
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

SoknadAnnetArbeidsforholdSkjema.propTypes = {
    sti: PropTypes.string,
    soknad: soknadPt,
};

const SoknadAnnetArbeidsforhold = (props) => {
    const { soknad, sti } = props;
    switch (soknad.status) {
        case NY:
        case UTKAST_TIL_KORRIGERING: {
            return <SoknadAnnetArbeidsforholdSkjema {...props} />;
        }
        case SENDT:
        case KORRIGERT: {
            if (beregnSteg(sti) === KVITTERING) {
                return <SoknadKvitteringSjekker {...props} />;
            }
            return <SendtSoknadAnnetArbeidsforhold {...props} />;
        }
        case AVBRUTT: {
            return <AvbruttSoknadAnnetArbeidsforhold {...props} />;
        }
        case UTGAATT: {
            return <UtgaattSoknad />;
        }
        default: {
            return <Feilmelding melding="Søknaden har ukjent status" />;
        }
    }
};

SoknadAnnetArbeidsforhold.propTypes = {
    sti: PropTypes.string,
    soknad: soknadPt,
};

export default SoknadAnnetArbeidsforhold;
