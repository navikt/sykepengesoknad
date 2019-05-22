import React from 'react';
import PropTypes from 'prop-types';
import { Fields } from 'redux-form';
import { getLedetekst, Bjorn, sykepengesoknad as sykepengesoknadPt } from '@navikt/digisyfo-npm';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import JaEllerNei from '../../components/skjema/JaEllerNei';
import AngiTid from './OppgiArbeid';
import { soknadsaktivitet } from '../../propTypes/index';
import { finnAktivitetssporsmal } from '../utils/finnSykepengesoknadSporsmal';

export const Aktivitet = ({ field, index, autofill, untouch, sykepengesoknad }) => {
    const hjelpetekst = field.grad !== 100
        ? (<Hjelpetekst>{getLedetekst('sykepengesoknad.aktiviteter.gradert.hjelpetekst.tekst')}</Hjelpetekst>)
        : null;

    return (<JaEllerNei
        hovedsporsmal
        name={`aktiviteter[${index}].jobbetMerEnnPlanlagt`}
        spoersmal={finnAktivitetssporsmal(field, sykepengesoknad.arbeidsgiver.navn)}
        hjelpetekst={hjelpetekst}>
        <div>
            <Fields
                autofill={autofill}
                untouch={untouch}
                component={AngiTid}
                aktivitetIndex={index}
                sykepengesoknad={sykepengesoknad}
                periode={field.periode}
                names={[
                    `aktiviteter[${index}].avvik.arbeidsgrad`,
                    `aktiviteter[${index}].avvik.timer`,
                    `aktiviteter[${index}].avvik.arbeidstimerNormalUke`,
                    `aktiviteter[${index}].avvik.enhet`,
                ]} />
            <Bjorn nokkel="sykepengesoknad.angi-tid.bjorn" />
        </div>
    </JaEllerNei>);
};

Aktivitet.propTypes = {
    field: soknadsaktivitet,
    index: PropTypes.number,
    autofill: PropTypes.func,
    untouch: PropTypes.func,
    sykepengesoknad: sykepengesoknadPt,
};

const Aktiviteter = ({ fields, sykepengesoknad, autofill, untouch }) => {
    return (<React.Fragment>
        {
            fields.map((field, index) => {
                return (<Aktivitet
                    field={field}
                    index={index}
                    key={index}
                    sykepengesoknad={sykepengesoknad}
                    autofill={autofill}
                    untouch={untouch} />);
            })
        }
    </React.Fragment>);
};

Aktiviteter.propTypes = {
    fields: PropTypes.arrayOf(soknadsaktivitet),
    autofill: PropTypes.func,
    untouch: PropTypes.func,
    sykepengesoknad: sykepengesoknadPt,
};

export default Aktiviteter;
