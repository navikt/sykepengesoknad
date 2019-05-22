import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { change as changeAction } from 'redux-form';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { getLedetekst } from '@navikt/digisyfo-npm';
import { jaEllerNeiAlternativer } from './JaEllerNei';
import { genererParseForEnkeltverdi } from './fieldUtils';
import { fieldPropTypes } from '../../../propTypes';
import JaEllerNeiPresisering from './JaEllerNeiPresisering';

const RadioPanelGruppeComponent = (props) => {
    const feil = props.meta.touched && props.meta.error
        ? { feilmelding: props.meta.error }
        : undefined;

    const legend = props.hjelpetekst
        ? (<div className="medHjelpetekst">
            <h3>{props.sporsmalstekst}</h3>
            {props.hjelpetekst}
        </div>)
        : <h3>{props.sporsmalstekst}</h3>;

    return (<React.Fragment>
        <RadioPanelGruppe
            className="inputPanelGruppe--horisontal"
            name={props.input.name}
            legend={legend}
            radios={jaEllerNeiAlternativer.map((alternativ) => {
                return {
                    label: getLedetekst(`soknad.${alternativ.toLowerCase()}`),
                    value: alternativ,
                    id: `${props.input.name}-${getLedetekst(`soknad.${alternativ.toLowerCase()}`)}`,
                };
            })}
            checked={props.input.value}
            onChange={(event, value) => {
                const parsedValue = genererParseForEnkeltverdi(props.id)(value);
                props.doChange(props.meta.form, props.input.name, parsedValue);
                props.input.onChange(event, value);
            }}
            feil={feil}
        />
        <JaEllerNeiPresisering soknad={props.soknad} tag={props.tag} value={props.input.value} />
    </React.Fragment>);
};

RadioPanelGruppeComponent.propTypes = {
    doChange: PropTypes.func,
    meta: fieldPropTypes.meta,
    input: fieldPropTypes.input,
    id: PropTypes.string,
    sporsmalstekst: PropTypes.string,
    hjelpetekst: PropTypes.node,
    soknad: PropTypes.soknad,
    tag: PropTypes.string,
    value: PropTypes.string,
};

const JaEllerNeiRadiopanelgruppe = connect(null, { doChange: changeAction })(RadioPanelGruppeComponent);

export default JaEllerNeiRadiopanelgruppe;
