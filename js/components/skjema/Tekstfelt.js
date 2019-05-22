import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'nav-frontend-skjema';
import { fieldPropTypes } from '../../propTypes';

export const getFeilFraMeta = (meta) => {
    return meta.touched && meta.error
        ? {
            feilmelding: meta.error,
        }
        : null;
};

const Tekstfelt = (props) => {
    const { meta, input, id, label } = props;
    const feil = getFeilFraMeta(meta);
    return (<Input
        bredde="L"
        feil={feil}
        label={label}
        autoComplete="off"
        placeholder={props.placeholder}
        type={props.type || 'text'}
        id={id}
        {...input}
        value={input.value} />);
};

Tekstfelt.propTypes = {
    meta: fieldPropTypes.meta,
    id: PropTypes.string,
    input: fieldPropTypes.input,
    label: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    onKeyUp: PropTypes.func,
    placeholder: PropTypes.string,
};

export default Tekstfelt;
