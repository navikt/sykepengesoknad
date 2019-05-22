import React from 'react';
import PropTypes from 'prop-types';

const OppsummeringSporsmalstekst = ({ overskriftsnivaa = 3, children }) => {
    const Overskriftstag = `h${overskriftsnivaa}`;
    return <Overskriftstag className="oppsummering__sporsmal">{children}</Overskriftstag>;
};

OppsummeringSporsmalstekst.propTypes = {
    overskriftsnivaa: PropTypes.number,
    children: PropTypes.string,
};

export default OppsummeringSporsmalstekst;
