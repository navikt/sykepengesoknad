import React from 'react';
import PropTypes from 'prop-types';
import { soknadPt, sporsmal as sporsmalPt } from '../../../propTypes/index';
import {
    CHECKBOX,
    DATO,
    PROSENT,
    TIMER,
    PERIODER,
    JA_NEI,
    CHECKBOX_GRUPPE,
    FRITEKST,
    CHECKBOX_PANEL,
    IKKE_RELEVANT,
    TALL,
    RADIO_GRUPPE, RADIO_GRUPPE_TIMER_PROSENT,
} from '../../enums/svartyper';
import Sporsmal from './Sporsmal';
import UkjentSporsmal from './UkjentSporsmal';

const SoknadUndersporsmal = ({ children }) => {
    return <div className="soknad__undersporsmal">{children}</div>;
};

SoknadUndersporsmal.propTypes = {
    children: PropTypes.element,
};

const Undersporsmal = ({ sporsmal, soknad }) => {
    switch (sporsmal.svartype) {
        case CHECKBOX:
        case CHECKBOX_PANEL: {
            return <Sporsmal sporsmal={sporsmal} name={sporsmal.tag} soknad={soknad} />;
        }
        case DATO:
        case TIMER:
        case PROSENT:
        case PERIODER:
        case JA_NEI:
        case CHECKBOX_GRUPPE:
        case TALL:
        case RADIO_GRUPPE:
        case RADIO_GRUPPE_TIMER_PROSENT:
        case FRITEKST: {
            return (<SoknadUndersporsmal>
                <Sporsmal sporsmal={sporsmal} name={sporsmal.tag} soknad={soknad} />
            </SoknadUndersporsmal>);
        }
        case IKKE_RELEVANT: {
            return (<div className="ekstrasporsmal">
                <Sporsmal sporsmal={sporsmal} name={sporsmal.tag} soknad={soknad} />
            </div>);
        }
        default: {
            return <UkjentSporsmal sporsmal={sporsmal} />;
        }
    }
};

Undersporsmal.propTypes = {
    sporsmal: sporsmalPt.isRequired,
    soknad: soknadPt.isRequired,
};

export default Undersporsmal;
