import React from 'react';
import { SykmeldingNokkelOpplysning } from '@navikt/digisyfo-npm';
import PropTypes from 'prop-types';
import cn from 'classnames';

export const StatusNokkelopplysning = ({ children, Overskrift = 'h2', tittel }) => {
    return (<SykmeldingNokkelOpplysning className="nokkelopplysning--statusopplysning" Overskrift={Overskrift} tittel={tittel}>
        {children}
    </SykmeldingNokkelOpplysning>);
};

StatusNokkelopplysning.propTypes = {
    children: PropTypes.node,
    Overskrift: PropTypes.string,
    tittel: PropTypes.string,
};

export const Statusopplysninger = ({ children }) => {
    return (<div className="statusopplysninger">
        {children}
    </div>);
};

Statusopplysninger.propTypes = {
    children: PropTypes.node,
};

const Statuspanel = ({ children, enKolonne = false, className = 'blokk' }) => {
    const classNames = cn('panel panel--komprimert statuspanel', className, {
        'statuspanel--toKol': !enKolonne,
        'statuspanel--enKol': enKolonne,
    });
    return (<div className={classNames}>
        {children}
    </div>);
};

Statuspanel.propTypes = {
    children: PropTypes.node,
    enKolonne: PropTypes.bool,
    className: PropTypes.string,
};

export default Statuspanel;

