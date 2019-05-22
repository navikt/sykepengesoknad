import React from 'react';
import PropTypes from 'prop-types';
import { MONTHS } from './daypickerLocale';

const Caption = ({ date }) => {
    return (<div className="DayPicker-Caption" role="heading" aria-live="assertive" aria-atomic="true">
        {`${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
    </div>);
};

Caption.propTypes = {
    date: PropTypes.instanceOf(Date),
};

export default Caption;
