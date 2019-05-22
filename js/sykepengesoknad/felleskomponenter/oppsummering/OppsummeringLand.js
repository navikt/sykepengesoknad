import React from 'react';
import PropTypes from 'prop-types';
import OppsummeringSporsmalstekst from './OppsummeringSporsmalstekst';
import { svar as svarPt } from '../../../propTypes/index';

const OppsummeringLand = ({ sporsmalstekst, id, overskriftsnivaa, svar }) => {
    const svarliste = svar.length === 1
        ? <p className="sist">{svar[0].verdi}</p>
        : (<ul className="oppsummering__landliste">
            {
                svar.map((s) => {
                    return <li className="oppsummering__land" key={s.verdi}>{s.verdi}</li>;
                })
            }
        </ul>);
    return (<div className="oppsummering__fritekst" id={id}>
        <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>{sporsmalstekst}</OppsummeringSporsmalstekst>
        <div className="oppsummering__tekstsvar">{svarliste}</div>
    </div>);
};

OppsummeringLand.propTypes = {
    svar: svarPt,
    overskriftsnivaa: PropTypes.number,
    sporsmalstekst: PropTypes.string,
    id: PropTypes.string,
};

export default OppsummeringLand;
