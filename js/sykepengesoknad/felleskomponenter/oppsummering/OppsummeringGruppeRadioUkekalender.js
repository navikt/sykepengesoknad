import React from 'react';
import PropTypes from 'prop-types';
import { tilLesbarPeriodeMedArstall, toDatePrettyPrint } from '@navikt/digisyfo-npm/lib/utils/datoUtils';
import { CHECKED } from '../../enums/svarEnums';
import OppsummeringSporsmalscontainer from './OppsummeringSporsmalscontainer';
import OppsummeringSporsmalstekst from './OppsummeringSporsmalstekst';
import OppsummeringAvkrysset from './OppsummeringAvkrysset';
import { sporsmal as sporsmalPt } from '../../prop-types/sporsmalProptype';

const OppsummeringGruppeRadioUkekalender = ({ tag, overskriftsnivaa, undersporsmal, id }) => {
    const besvartUndersporsmal = undersporsmal.find((s) => {
        return s.svar.length > 0 && s.svar[0].verdi === CHECKED;
    });
    const sporsmalstekst = undersporsmal.length > 2
        ? tilLesbarPeriodeMedArstall(undersporsmal[0].sporsmalstekst, undersporsmal[undersporsmal.length - 2].sporsmalstekst)
        : toDatePrettyPrint(undersporsmal[0].sporsmalstekst);
    const undersporsmalstekst = besvartUndersporsmal.sporsmalstekst === 'Ikke til behandling'
        ? besvartUndersporsmal.sporsmalstekst
        : toDatePrettyPrint(besvartUndersporsmal.sporsmalstekst);
    return besvartUndersporsmal
        ? (<OppsummeringSporsmalscontainer tag={tag}>
            <OppsummeringSporsmalstekst
                overskriftsnivaa={overskriftsnivaa}>{sporsmalstekst}</OppsummeringSporsmalstekst>
            <OppsummeringAvkrysset id={id} tekst={undersporsmalstekst} />
        </OppsummeringSporsmalscontainer>)
        : null;
};

OppsummeringGruppeRadioUkekalender.propTypes = {
    tag: PropTypes.string,
    overskriftsnivaa: PropTypes.number,
    undersporsmal: PropTypes.arrayOf(sporsmalPt),
    id: PropTypes.string,
};

export default OppsummeringGruppeRadioUkekalender;
