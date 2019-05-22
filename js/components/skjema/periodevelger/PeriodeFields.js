import React from 'react';
import PropTypes from 'prop-types';
import { Fields } from 'redux-form';
import FomTomVelger from './PeriodevelgerInput';

const PeriodeFields = (props) => {
    const { name, index, onRemoveHandler, skjemanavn } = props;
    const fomName = `${name}.fom`;
    const tomName = `${name}.tom`;
    return (<Fields
        names={[fomName, tomName]}
        skjemanavn={skjemanavn}
        component={FomTomVelger}
        onRemoveHandler={onRemoveHandler}
        periodeIndex={index} />);
};

PeriodeFields.propTypes = {
    index: PropTypes.number,
    onRemoveHandler: PropTypes.func,
    name: PropTypes.string.isRequired,
    skjemanavn: PropTypes.string,
};

export default PeriodeFields;
