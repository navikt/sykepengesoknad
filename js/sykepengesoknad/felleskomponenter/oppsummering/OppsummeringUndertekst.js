import React from 'react';
import PropTypes from 'prop-types';
import OppsummeringSporsmalstekst from './OppsummeringSporsmalstekst';
import OppsummeringUndersporsmalsliste from './OppsummeringUndersporsmalsliste';
import { sporsmal as sporsmalPt } from '../../../propTypes/index';

const OppsummeringUndertekst = ({ sporsmalstekst, id, overskriftsnivaa, undertekst, undersporsmal }) => {
    return (<div className="oppsummering__VisUndertekst" id={id}>
        <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>{sporsmalstekst}</OppsummeringSporsmalstekst>
        <div className="redaksjonelt-innhold" dangerouslySetInnerHTML={{ __html: undertekst }} />
        <OppsummeringUndersporsmalsliste sporsmalsliste={undersporsmal} overskriftsnivaa={overskriftsnivaa} />
    </div>);
};

OppsummeringUndertekst.propTypes = {
    undersporsmal: PropTypes.arrayOf(sporsmalPt),
    undertekst: PropTypes.string,
    overskriftsnivaa: PropTypes.number,
    sporsmalstekst: PropTypes.string,
    id: PropTypes.string,
};

export default OppsummeringUndertekst;
