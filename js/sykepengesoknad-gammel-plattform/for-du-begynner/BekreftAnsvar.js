import React from 'react';
import { Field } from 'redux-form';
import { getLedetekst } from '@navikt/digisyfo-npm';
import CheckboxSelvstendig from '../../components/skjema/CheckboxSelvstendig';

const BekreftAnsvar = () => {
    const label = getLedetekst('sykepengesoknad.bekreft-ansvar.label');
    return (<div className="blokk">
        <p>{getLedetekst('sykepengesoknad.bekreft-ansvar.introtekst')}</p>
        <Field component={CheckboxSelvstendig} name="ansvarBekreftet" id="ansvarBekreftet" label={label} />
    </div>);
};

export default BekreftAnsvar;
