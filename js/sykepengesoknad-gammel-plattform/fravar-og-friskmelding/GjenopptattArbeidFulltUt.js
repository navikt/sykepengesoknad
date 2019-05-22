import React from 'react';
import { getLedetekst, tidligsteFom, senesteTom } from '@navikt/digisyfo-npm';
import JaEllerNei from '../../components/skjema/JaEllerNei';
import Datovelger from '../../components/skjema/datovelger/Datovelger';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';
import { finnGjenopptattArbeidFulltUtSporsmal } from '../utils/finnSykepengesoknadSporsmal';

const GjenopptattArbeidFulltUt = ({ sykepengesoknad }) => {
    const perioder = sykepengesoknad.aktiviteter.map((aktivitet) => {
        return aktivitet.periode;
    });
    return (<JaEllerNei
        hovedsporsmal
        spoersmal={finnGjenopptattArbeidFulltUtSporsmal(sykepengesoknad)}
        name="harGjenopptattArbeidFulltUt">
        <div>
            <label htmlFor="gjenopptattArbeidFulltUtDato" className="skjema__sporsmal">
                {getLedetekst('sykepengesoknad.gjenopptatt-arbeid-fullt-ut.dato.sporsmal')}
            </label>
            <Datovelger id="gjenopptattArbeidFulltUtDato" name="gjenopptattArbeidFulltUtDato" tidligsteFom={tidligsteFom(perioder)} senesteTom={senesteTom(perioder)} />
        </div>
    </JaEllerNei>);
};

GjenopptattArbeidFulltUt.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

export default GjenopptattArbeidFulltUt;
