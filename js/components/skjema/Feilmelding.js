import React from 'react';
import PropTypes from 'prop-types';

const Feilmelding = ({ touched, error }) => {
    return (<p className="skjemaelement__feilmelding" aria-live="polite">
        { touched && error }
    </p>);
};

Feilmelding.propTypes = {
    touched: PropTypes.bool,
    error: PropTypes.string,
};

export default Feilmelding;
