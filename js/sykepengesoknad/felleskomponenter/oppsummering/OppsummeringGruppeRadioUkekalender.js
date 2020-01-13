import React from 'react';
import PropTypes from 'prop-types';
import { toDatePrettyPrint } from '@navikt/digisyfo-npm/lib/utils/datoUtils';
import { CHECKED } from '../../enums/svarEnums';
import OppsummeringSporsmalscontainer from './OppsummeringSporsmalscontainer';
import OppsummeringSporsmalstekst from './OppsummeringSporsmalstekst';
import OppsummeringAvkrysset from './OppsummeringAvkrysset';
import { sporsmal as sporsmalPt } from '../../prop-types/sporsmalProptype';

const OppsummeringGruppeRadioUkekalender = ({ sporsmalstekst, tag, overskriftsnivaa, undersporsmal, id }) => {
    const besvartUndersporsmal = undersporsmal.find((s) => {
        return s.svar.length > 0 && s.svar[0].verdi === CHECKED;
    });
    return besvartUndersporsmal
        ? (<OppsummeringSporsmalscontainer tag={tag}>
            <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>{sporsmalstekst}</OppsummeringSporsmalstekst>
            <OppsummeringAvkrysset id={id} tekst={toDatePrettyPrint(besvartUndersporsmal.sporsmalstekst)} />
        </OppsummeringSporsmalscontainer>)
        : null;
};

OppsummeringGruppeRadioUkekalender.propTypes = {
    sporsmalstekst: PropTypes.string,
    tag: PropTypes.string,
    overskriftsnivaa: PropTypes.number,
    undersporsmal: PropTypes.arrayOf(sporsmalPt),
    id: PropTypes.string,
};

export default OppsummeringGruppeRadioUkekalender;
