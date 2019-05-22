import React from 'react';
import Checkbox from './Checkbox';
import CheckboxSelvstendig from '../../../components/skjema/CheckboxSelvstendig';

export default (props) => {
    return <Checkbox {...props} renderComponent={CheckboxSelvstendig} />;
};
