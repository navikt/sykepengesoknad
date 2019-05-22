import React from 'react';
import { getLedetekst } from '@navikt/digisyfo-npm';
import PropTypes from 'prop-types';

const Knapperad = ({ children, variant }) => {
    return (<div className={`knapperad ${variant}`}>
        {
            children.filter
                ? children
                    .filter((child) => {
                        return child;
                    })
                    .map((child, index) => {
                        return <div key={index} className="knapperad__element">{child}</div>;
                    })
                : children
        }
    </div>);
};

Knapperad.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.string,
};

export const KnapperadSoknad = () => {
    return (<Knapperad variant="knapperad--medAvbryt">
        <button type="submit" className="knapp knapp--hoved js-ga-videre">{getLedetekst('sykepengesoknad.ga-videre')}</button>
    </Knapperad>);
};

export default Knapperad;
