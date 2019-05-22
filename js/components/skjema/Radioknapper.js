import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'nav-frontend-skjema';
import { fieldPropTypes } from '../../propTypes';
import Feilomrade from './Feilomrade';

export const getId = (id) => {
    return id
        .split('.')
        .join('-')
        .split('[')
        .join('-')
        .split(']')
        .join('-')
        .split('--')
        .join('-');
};

export const Radioknapp = ({ input, value, children, id, label, checked, labelSekundaer = null, disabled, visUndertekst }) => {
    const labelMedSekundaerlabel = labelSekundaer
        ? (<div>
            {label}
            <span className="sekundaerLabel">{labelSekundaer}</span>
        </div>) : label;
    return (<div>
        <Radio
            id={getId(id)}
            type="radio"
            {...input}
            disabled={disabled}
            checked={checked || input.value.toString() === value.toString()}
            value={value}
            label={labelMedSekundaerlabel}
            onBlur={() => {
                input.onBlur();
            }} />
        { (input.value === value || disabled || visUndertekst) && children }
    </div>);
};

Radioknapp.propTypes = {
    input: fieldPropTypes.input,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    children: PropTypes.element,
    id: PropTypes.string,
    label: PropTypes.string,
    checked: PropTypes.bool,
    labelSekundaer: PropTypes.string,
    disabled: PropTypes.bool,
    visUndertekst: PropTypes.bool,
};

const Radioknapper = ({ input, meta, spoersmal, Overskrift = 'h3', children = [], horisontal = false, hjelpetekst, hjelpelinje, visUndertekst }) => {
    return (<Feilomrade {...meta} id={input.name}>
        <div className={`${hjelpetekst ? 'medHjelpetekst' : ''}`}>
            <Overskrift className="skjema__sporsmal">{spoersmal}</Overskrift>
            { hjelpetekst }
        </div>
        { hjelpelinje }
        <div className={horisontal ? 'inputgruppe inputgruppe--horisontal' : 'inputgruppe'}>
            {
                children.map((radioknapp, index) => {
                    return <Radioknapp key={index} input={input} id={`${input.name}-${index}`} visUndertekst={visUndertekst} {...radioknapp.props} />;
                })
            }
        </div>
    </Feilomrade>);
};

Radioknapper.propTypes = {
    input: fieldPropTypes.input,
    meta: fieldPropTypes.meta,
    spoersmal: PropTypes.string,
    Overskrift: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element),
    horisontal: PropTypes.bool,
    hjelpetekst: PropTypes.element,
    hjelpelinje: PropTypes.element,
    visUndertekst: PropTypes.bool,
};

export default Radioknapper;
