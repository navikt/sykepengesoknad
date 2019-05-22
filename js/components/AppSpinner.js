import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

const AppSpinner = ({ className = 'app-spinner--side blokk--xl' }) => {
    const classNames = cn('app-spinner', className);
    return <div className={classNames} aria-label="Vent litt mens siden laster" />;
};

AppSpinner.propTypes = {
    className: PropTypes.string,
};

export default AppSpinner;
