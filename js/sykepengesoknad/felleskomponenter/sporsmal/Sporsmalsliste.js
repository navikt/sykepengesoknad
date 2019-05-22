import React from 'react';
import PropTypes from 'prop-types';
import { sporsmal as sporsmalPt, soknadPt } from '../../../propTypes/index';
import Sporsmal from './Sporsmal';

const Sporsmalsliste = ({ sporsmalsliste, soknad }) => {
    return sporsmalsliste.map((sporsmal) => {
        return (<Sporsmal
            soknad={soknad}
            hovedsporsmal
            sporsmal={sporsmal}
            key={sporsmal.tag}
            name={sporsmal.tag} />);
    });
};

Sporsmalsliste.propTypes = {
    sporsmalsliste: PropTypes.arrayOf(sporsmalPt).isRequired,
    soknad: soknadPt.isRequired,
};

export default Sporsmalsliste;
