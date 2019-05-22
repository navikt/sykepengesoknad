import React from 'react';
import OppsummeringSporsmalscontainer from './OppsummeringSporsmalscontainer';
import OppsummeringSporsmalstekst from './OppsummeringSporsmalstekst';
import OppsummeringSporsmal from './OppsummeringSporsmal';
import { oppsummeringSporsmal } from '../../../propTypes/index';
import { getKey } from './Oppsummeringsvisning';

const OppsummeringCheckboxgruppe = ({ tag, sporsmalstekst, undersporsmal, overskriftsnivaa }) => {
    return (<OppsummeringSporsmalscontainer tag={tag}>
        <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>{sporsmalstekst}</OppsummeringSporsmalstekst>
        {
            undersporsmal.map((s) => {
                return <OppsummeringSporsmal {...s} overskriftsnivaa={overskriftsnivaa + 1} key={getKey(s.tag, s.id)} />;
            })
        }
    </OppsummeringSporsmalscontainer>);
};

OppsummeringCheckboxgruppe.propTypes = oppsummeringSporsmal;

export default OppsummeringCheckboxgruppe;
