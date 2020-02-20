import React from 'react';
import { toDatePrettyPrint } from '@navikt/digisyfo-npm/lib/utils/datoUtils';
import OppsummeringSporsmalscontainer from './OppsummeringSporsmalscontainer';
import OppsummeringSporsmalstekst from './OppsummeringSporsmalstekst';
import OppsummeringAvkrysset from './OppsummeringAvkrysset';
import { oppsummeringSporsmal } from '../../../propTypes/index';

const OppsummeringGruppeRadioUkekalender = ({ tag, svar, sporsmalstekst, overskriftsnivaa, id }) => {
    const oppsummertSvar = svar[0]
        ? toDatePrettyPrint(svar[0].verdi)
        : 'Ikke til behnadling';
    return (
        <OppsummeringSporsmalscontainer tag={tag}>
            <OppsummeringSporsmalstekst
                overskriftsnivaa={overskriftsnivaa}>{sporsmalstekst}</OppsummeringSporsmalstekst>
            <OppsummeringAvkrysset id={id} tekst={oppsummertSvar} />
        </OppsummeringSporsmalscontainer>);
};

OppsummeringGruppeRadioUkekalender.propTypes = oppsummeringSporsmal;

export default OppsummeringGruppeRadioUkekalender;
