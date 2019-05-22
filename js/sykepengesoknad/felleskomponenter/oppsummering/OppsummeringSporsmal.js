import React from 'react';
import PropTypes from 'prop-types';
import {
    CHECKBOX,
    CHECKBOX_GRUPPE, CHECKBOX_PANEL,
    DATO,
    FRITEKST,
    IKKE_RELEVANT,
    JA_NEI,
    PERIODER,
    PROSENT, RADIO_GRUPPE, RADIO_GRUPPE_TIMER_PROSENT, TALL,
    TIMER,
} from '../../enums/svartyper';
import OppsummeringPerioder from './OppsummeringPerioder';
import OppsummeringDato from './OppsummeringDato';
import OppsummeringCheckboxgruppe from './OppsummeringCheckboxgruppe';
import OppsummeringTall from './OppsummeringTall';
import OppsummeringCheckbox from './OppsummeringCheckbox';
import OppsummeringJaEllerNei from './OppsummeringJaEllerNei';
import { svartypePt } from '../../../propTypes/index';
import OppsummeringFritekst from './OppsummeringFritekst';
import OppsummeringUndertekst from './OppsummeringUndertekst';
import OppsummeringRadioGruppe from './OppsummeringRadioGruppe';
import { LAND } from '../../enums/tagtyper';
import OppsummeringLand from './OppsummeringLand';

const OppsummeringSporsmal = (props) => {
    switch (props.svartype) {
        case CHECKBOX_PANEL:
        case CHECKBOX: {
            return <OppsummeringCheckbox {...props} />;
        }
        case JA_NEI: {
            return <OppsummeringJaEllerNei {...props} />;
        }
        case DATO: {
            return <OppsummeringDato {...props} />;
        }
        case PERIODER: {
            return <OppsummeringPerioder {...props} />;
        }
        case FRITEKST: {
            return <OppsummeringFritekst {...props} />;
        }
        case LAND: {
            return <OppsummeringLand {...props} />;
        }
        case IKKE_RELEVANT: {
            return <OppsummeringUndertekst {...props} />;
        }
        case CHECKBOX_GRUPPE: {
            return (<OppsummeringCheckboxgruppe {...props} />);
        }
        case TALL:
        case PROSENT:
        case TIMER: {
            return <OppsummeringTall {...props} />;
        }
        case RADIO_GRUPPE_TIMER_PROSENT:
        case RADIO_GRUPPE: {
            return <OppsummeringRadioGruppe {...props} />;
        }
        default: {
            return null;
        }
    }
};

OppsummeringSporsmal.propTypes = {
    svartype: svartypePt,
    overskriftsnivaa: PropTypes.number,
};

export default OppsummeringSporsmal;
