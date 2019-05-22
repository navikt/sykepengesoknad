import React from 'react';
import { getLedetekst } from '@navikt/digisyfo-npm';
import { TIMER } from '../../enums/svartyper';
import OppsummeringSporsmalscontainer from './OppsummeringSporsmalscontainer';
import OppsummeringSporsmalstekst from './OppsummeringSporsmalstekst';
import { oppsummeringSporsmal } from '../../../propTypes/index';
import { getKey } from './Oppsummeringsvisning';

const OppsummeringTall = ({ svar, sporsmalstekst, tag, overskriftsnivaa, svartype, undertekst }) => {
    const labelnokkel = svartype === TIMER ? 'soknad.timer-totalt' : 'soknad.prosent';
    const label = undertekst || getLedetekst(labelnokkel);
    return (<OppsummeringSporsmalscontainer tag={tag}>
        <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>{sporsmalstekst}</OppsummeringSporsmalstekst>
        <div className="oppsummering__tekstsvar">
            {
                svar.map((svarverdi, index) => {
                    return <p className="oppsummering__tekst" key={getKey(tag, index)}>{svarverdi.verdi} {label}</p>;
                })
            }
        </div>
    </OppsummeringSporsmalscontainer>);
};

OppsummeringTall.propTypes = oppsummeringSporsmal;

export default OppsummeringTall;
