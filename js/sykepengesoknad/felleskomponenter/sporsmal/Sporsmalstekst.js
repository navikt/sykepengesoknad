import React from 'react';
import PropTypes from 'prop-types';

const Sporsmalstekst = ({ Tag = 'h3', tekst, ...rest }) => {
    return tekst !== null
        ? <Tag className="skjema__sporsmal" {...rest}>{tekst}</Tag>
        : null;
};

Sporsmalstekst.propTypes = {
    Tag: PropTypes.string,
    tekst: PropTypes.string,
};

export default Sporsmalstekst;
