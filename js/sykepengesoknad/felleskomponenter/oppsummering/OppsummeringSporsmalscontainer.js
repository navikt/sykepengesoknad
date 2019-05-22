import React from 'react';
import PropTypes from 'prop-types';

const OppsummeringSporsmalscontainer = ({ tag, children }) => {
    return (<div className="oppsummering__sporsmalscontainer" id={`js-${tag.toLowerCase()}`}>
        {children}
    </div>);
};

OppsummeringSporsmalscontainer.propTypes = {
    tag: PropTypes.string,
    children: PropTypes.node,
};

export default OppsummeringSporsmalscontainer;
