import React from 'react';
import PropTypes from 'prop-types';
import Alertstripe from 'nav-frontend-alertstriper';

const Feilstripe = ({ vis, className }) => {
    const tekst = window.location.href.indexOf('heroku') === -1
        ? 'Beklager, det oppstod en feil! Vennligst prøv igjen senere.'
        : 'Denne funksjonen virker ikke på testsiden';
    return (<div aria-live="polite" role="alert">
        {
            vis
                ? (<Alertstripe type="feil" className={className}>
                    <p className="sist">{tekst}</p>
                </Alertstripe>)
                : null
        }
    </div>);
};

Feilstripe.propTypes = {
    vis: PropTypes.bool,
    className: PropTypes.string,
};

export default Feilstripe;
