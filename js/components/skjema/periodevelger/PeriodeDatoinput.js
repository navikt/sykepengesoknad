import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import MaskedInput from 'react-maskedinput';
import { fieldPropTypes } from '../../../propTypes';

const PeriodeDatoinput = ({ meta, input, id, onDoubleClick, onKeyUp, withRef }) => {
    const classNames = cn('skjemaelement__input datovelger__input', {
        'datovelger__input--fom': input.name.indexOf('fom') > -1,
        'datovelger__input--tom': input.name.indexOf('tom') > -1,
        'skjemaelement__input--harFeil': meta.touched && meta.error,
    });

    return (<MaskedInput
        ref={withRef}
        type="tel"
        mask="11.11.1111"
        autoComplete="off"
        placeholder="dd.mm.åååå"
        id={id}
        className={classNames}
        onKeyUp={onKeyUp}
        onDoubleClick={onDoubleClick}
        {...input} />);
};

PeriodeDatoinput.propTypes = {
    meta: fieldPropTypes.meta,
    input: fieldPropTypes.input,
    id: PropTypes.string,
    withRef: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onKeyUp: PropTypes.func,
};

export default PeriodeDatoinput;
