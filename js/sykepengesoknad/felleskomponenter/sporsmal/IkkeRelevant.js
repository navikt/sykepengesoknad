import React from 'react';
import PropTypes from 'prop-types';

const IkkeRelevant = ({ sporsmalstekst, undertekst, children }) => {
    return (<div>
        { sporsmalstekst && <h3 className="skjema__sporsmal">{sporsmalstekst}</h3> }
        <div className="redaksjonelt-innhold" dangerouslySetInnerHTML={{ __html: undertekst }} />
        { children }
    </div>);
};

IkkeRelevant.propTypes = {
    sporsmalstekst: PropTypes.string,
    undertekst: PropTypes.string,
    children: PropTypes.node,
};

export default IkkeRelevant;
