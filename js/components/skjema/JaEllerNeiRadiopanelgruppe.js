import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { change as changeAction } from 'redux-form';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { jaEllerNeiAlternativer } from './JaEllerNei';
import { fieldPropTypes } from '../../propTypes';

const RadioPanelGruppeComponent = (props) => {
    const feil = props.meta.touched && props.meta.error
        ? { feilmelding: props.meta.error }
        : undefined;

    const legend = props.hjelpetekst
        ? (<div className="medHjelpetekst">
            <h3>{props.spoersmal}</h3>
            {props.hjelpetekst}
        </div>)
        : <h3>{props.spoersmal}</h3>;

    return (<RadioPanelGruppe
        className="inputPanelGruppe--horisontal"
        name={props.input.name}
        legend={legend}
        radios={jaEllerNeiAlternativer.map((alternativ) => {
            return {
                ...alternativ,
                id: `${props.input.name}-${alternativ.value}`,
            };
        })}
        checked={props.input.value}
        onChange={(event, value) => {
            props.doChange(props.meta.form, props.input.name, value);
        }}
        feil={feil}
    />);
};

RadioPanelGruppeComponent.propTypes = {
    doChange: PropTypes.func,
    meta: fieldPropTypes.meta,
    input: fieldPropTypes.input,
    spoersmal: PropTypes.string,
    hjelpetekst: PropTypes.node,
};

const JaEllerNeiRadiopanelgruppe = connect(null, { doChange: changeAction })(RadioPanelGruppeComponent);

export default JaEllerNeiRadiopanelgruppe;
