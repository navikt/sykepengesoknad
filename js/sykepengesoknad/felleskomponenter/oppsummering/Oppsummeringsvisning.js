import React from 'react';
import OppsummeringSporsmal from './OppsummeringSporsmal';
import { soknadPt } from '../../../propTypes/index';
import { IKKE_RELEVANT, INFO_BEHANDLINGSDAGER } from '../../enums/svartyper';

export const getKey = (tag, id) => {
    return `${tag}_${id}`;
};

const Oppsummeringsvisning = ({ soknad }) => {
    return (<div>
        {
            soknad.sporsmal
                .filter((sporsmal) => {
                    return (sporsmal.svar.length > 0 || sporsmal.undersporsmal.length > 0 || sporsmal.svartype === IKKE_RELEVANT || sporsmal.svartype === INFO_BEHANDLINGSDAGER);
                })
                .map((sporsmal) => {
                    return (<div className="oppsummering__seksjon" key={getKey(sporsmal.tag, sporsmal.id)}>
                        <OppsummeringSporsmal {...sporsmal} />
                    </div>);
                })
        }
    </div>);
};

Oppsummeringsvisning.propTypes = {
    soknad: soknadPt,
};

export default Oppsummeringsvisning;
