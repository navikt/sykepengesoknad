import React from 'react';
import PropTypes from 'prop-types';
import Feilmelding from './Feilmelding';

const Feilomrade = ({ touched, error, children, id }) => {
    return (<div tabIndex="-1" id={id} className={touched && error ? 'skjema__feilomrade skjema__feilomrade--harFeil' : 'skjema__feilomrade'}>
        {children}
        <Feilmelding touched={touched} error={error} />
    </div>);
};

Feilomrade.propTypes = {
    touched: PropTypes.bool,
    error: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    id: PropTypes.string,
};

export default Feilomrade;
