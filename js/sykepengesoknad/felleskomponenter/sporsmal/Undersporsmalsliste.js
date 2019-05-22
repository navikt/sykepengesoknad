import React from 'react';
import PropTypes from 'prop-types';
import Undersporsmal from './Undersporsmal';
import { sporsmal as sporsmalPt, soknadPt } from '../../../propTypes/index';

const Undersporsmalsliste = ({ undersporsmal, soknad, parentValue }) => {
    const sporsmalsliste = undersporsmal
        .filter((underspm) => {
            return underspm.svar !== null;
        })
        .map((underspm) => {
            return (parentValue
                && underspm.visningskriterie
                && parentValue === underspm.visningskriterie) || !underspm.visningskriterie
                ? <Undersporsmal
                    sporsmal={underspm}
                    key={underspm.tag}
                    soknad={soknad} />
                : null;
        })
        .filter((underspm) => {
            return underspm !== null;
        });

    return sporsmalsliste.length > 0
        ? <div>{sporsmalsliste}</div>
        : null;
};

Undersporsmalsliste.propTypes = {
    undersporsmal: PropTypes.arrayOf(sporsmalPt),
    soknad: soknadPt.isRequired,
    parentValue: PropTypes.string,
};

export default Undersporsmalsliste;
