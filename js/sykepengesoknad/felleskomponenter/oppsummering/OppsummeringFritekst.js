import React from 'react';
import PropTypes from 'prop-types';
import OppsummeringSporsmalstekst from './OppsummeringSporsmalstekst';
import { svar as svarPt } from '../../../propTypes/index';

const OppsummeringFritekst = ({ sporsmalstekst, id, overskriftsnivaa, svar }) => {
    return (<div className="oppsummering__fritekst" id={id}>
        <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>{sporsmalstekst}</OppsummeringSporsmalstekst>
        <p className="sist">{svar[0].verdi}</p>
    </div>);
};

OppsummeringFritekst.propTypes = {
    svar: svarPt,
    overskriftsnivaa: PropTypes.number,
    sporsmalstekst: PropTypes.string,
    id: PropTypes.string,
};

export default OppsummeringFritekst;
