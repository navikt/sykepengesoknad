import React from 'react';
import { toDatePrettyPrint, getLedetekst, Bjorn } from '@navikt/digisyfo-npm';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import PropTypes from 'prop-types';
import getContextRoot from '../../utils/getContextRoot';
import JaEllerNei from '../../components/skjema/JaEllerNei';
import Periodevelger from '../../components/skjema/periodevelger/Periodevelger';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';
import { getTidligsteStartdatoSykeforloep } from '../../utils/sykmeldingUtils';
import { finnEgenmeldingsdagerSporsmal } from '../utils/finnSykepengesoknadSporsmal';
import { Vis } from '../../utils/index';
import { tilLesbarDatoMedArstall } from '../../utils/datoUtils';

export const PreutfyltBjorn = ({ vis }) => {
    return (<Vis
        hvis={vis}
        render={() => {
            return (<Bjorn
                className="press"
                nokkel="sykepengesoknad.egenmeldingsdager.preutfylt-melding"
                rootUrl={getContextRoot()} />);
        }} />);
};

PreutfyltBjorn.propTypes = {
    vis: PropTypes.bool,
};

const getEgenmeldingsperioderSporsmal = (sykepengesoknad) => {
    const startSykeforloep = getTidligsteStartdatoSykeforloep(sykepengesoknad);
    return getLedetekst('sykepengesoknad.egenmeldingsdager.dato.sporsmal-2', {
        '%DATO%': tilLesbarDatoMedArstall(startSykeforloep),
    });
};

const EgenmeldingsDager = ({ sykepengesoknad, erEgenmeldingsperioderPreutfylt }) => {
    const startSykeforloep = getTidligsteStartdatoSykeforloep(sykepengesoknad);
    const senesteTom = new Date(startSykeforloep);
    senesteTom.setDate(startSykeforloep.getDate() - 1);
    const tidligsteFom = new Date(senesteTom);
    tidligsteFom.setMonth(senesteTom.getMonth() - 6);

    const hjelpetekst = (<Hjelpetekst
        id="egenmeldingsdager-hjelpetekst">{getLedetekst('sykepengesoknad.egenmeldingsdager.hjelpetekst.tekst', {
            '%DATO%': toDatePrettyPrint(startSykeforloep),
        })}</Hjelpetekst>);

    const informasjon = <PreutfyltBjorn vis={erEgenmeldingsperioderPreutfylt} />;

    return (<JaEllerNei
        hovedsporsmal
        spoersmal={finnEgenmeldingsdagerSporsmal(sykepengesoknad)}
        name="bruktEgenmeldingsdagerFoerLegemeldtFravaer"
        hjelpetekst={hjelpetekst}
        informasjon={informasjon}>
        <Periodevelger
            name="egenmeldingsperioder"
            spoersmal={getEgenmeldingsperioderSporsmal(sykepengesoknad)}
            tidligsteFom={tidligsteFom}
            senesteTom={senesteTom} />
    </JaEllerNei>);
};

EgenmeldingsDager.propTypes = {
    sykepengesoknad: sykepengesoknadPt.isRequired,
    erEgenmeldingsperioderPreutfylt: PropTypes.bool,
};

export default EgenmeldingsDager;
