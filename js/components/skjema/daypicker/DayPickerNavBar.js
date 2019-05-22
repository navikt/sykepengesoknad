import React from 'react';
import PropTypes from 'prop-types';

const onKeyDown = (e) => {
    const OPP = 40;
    const NED = 38;
    if ([OPP, NED].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
};

const NavBar = ({ onNextClick, onPreviousClick, showPreviousButton, showNextButton }) => {
    const className = 'DayPicker-NavButton';
    return (<div role="toolbar">
        <button
            tabIndex="0"
            className={`${className} DayPicker-NavButton--prev`}
            disabled={!showPreviousButton}
            type="button"
            onKeyDown={onKeyDown}
            onClick={(e) => {
                e.preventDefault();
                onPreviousClick();
            }}>Forrige måned</button>
        <button
            tabIndex="0"
            className={`${className} DayPicker-NavButton--next`}
            disabled={!showNextButton}
            type="button"
            onKeyDown={onKeyDown}
            onClick={(e) => {
                e.preventDefault();
                onNextClick();
            }}>Neste måned</button>
    </div>);
};

NavBar.propTypes = {
    onNextClick: PropTypes.func,
    onPreviousClick: PropTypes.func,
    showPreviousButton: PropTypes.bool,
    showNextButton: PropTypes.bool,
};

export default NavBar;

