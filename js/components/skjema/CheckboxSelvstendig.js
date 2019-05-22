import React from 'react';
import PropTypes from 'prop-types';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { fieldPropTypes } from '../../propTypes';
import Feilmelding from './Feilmelding';

const CheckboxSelvstendig = ({ input, meta, label, id, disabled }) => {
    return (<div>
        <BekreftCheckboksPanel {...input} inputProps={{ id, disabled }} label={label} checked={input.value === true} />
        <Feilmelding {...meta} />
    </div>);
};

CheckboxSelvstendig.propTypes = {
    input: fieldPropTypes.input,
    meta: fieldPropTypes.meta,
    label: PropTypes.string,
    id: PropTypes.string,
    disabled: PropTypes.bool,
};

export default CheckboxSelvstendig;
