import React from 'react';
import PropTypes from 'prop-types';
import { svartypePt, sporsmal as sporsmalPt } from '../../../propTypes/index';
import OppsummeringSporsmalscontainer from './OppsummeringSporsmalscontainer';
import OppsummeringSporsmalstekst from './OppsummeringSporsmalstekst';
import OppsummeringUndersporsmalsliste from './OppsummeringUndersporsmalsliste';
import OppsummeringAvkrysset from './OppsummeringAvkrysset';
import { CHECKED } from '../../enums/svarEnums';
import { RADIO_GRUPPE } from '../../enums/svartyper';

const OppsummeringRadiogruppe = ({ sporsmalstekst, tag, overskriftsnivaa, undersporsmal, id, svartype }) => {
    const besvartUndersporsmal = undersporsmal.find((s) => {
        return s.svar.length > 0 && s.svar[0].verdi === CHECKED;
    });
    return besvartUndersporsmal
        ? (<OppsummeringSporsmalscontainer tag={tag}>
            <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>{sporsmalstekst}</OppsummeringSporsmalstekst>
            { svartype === RADIO_GRUPPE && <OppsummeringAvkrysset id={id} tekst={besvartUndersporsmal.sporsmalstekst} /> }
            <OppsummeringUndersporsmalsliste sporsmalsliste={besvartUndersporsmal.undersporsmal} overskriftsnivaa={overskriftsnivaa + 1} />
        </OppsummeringSporsmalscontainer>)
        : null;
};

OppsummeringRadiogruppe.propTypes = {
    sporsmalstekst: PropTypes.string,
    tag: PropTypes.string,
    overskriftsnivaa: PropTypes.number,
    undersporsmal: PropTypes.arrayOf(sporsmalPt),
    id: PropTypes.string,
    svartype: svartypePt,
};

export default OppsummeringRadiogruppe;
