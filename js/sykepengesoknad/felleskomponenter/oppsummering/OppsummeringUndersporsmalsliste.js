import React from 'react';
import PropTypes from 'prop-types';
import OppsummeringSporsmal from './OppsummeringSporsmal';
import { getKey } from './Oppsummeringsvisning';
import { sporsmal as sporsmalPt } from '../../../propTypes/index';

const OppsummeringUndersporsmalsliste = ({ sporsmalsliste = [], overskriftsnivaa = 4 }) => {
    return sporsmalsliste.length > 0 ? (<div className="oppsummering__undersporsmalsliste">
        {
            sporsmalsliste.map((sporsmal) => {
                return <OppsummeringSporsmal {...sporsmal} key={getKey(sporsmal.tag, sporsmal.id)} overskriftsnivaa={overskriftsnivaa} />;
            })
        }
    </div>) : null;
};

OppsummeringUndersporsmalsliste.propTypes = {
    sporsmalsliste: PropTypes.arrayOf(sporsmalPt),
    overskriftsnivaa: PropTypes.number,
};

export default OppsummeringUndersporsmalsliste;
