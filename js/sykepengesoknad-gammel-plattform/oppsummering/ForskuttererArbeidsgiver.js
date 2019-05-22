import React from 'react';
import { Field } from 'redux-form';
import { getLedetekst, getHtmlLedetekst, forskutterersvar } from '@navikt/digisyfo-npm';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import Feilomrade from '../../components/skjema/Feilomrade';
import SporsmalMedTillegg from '../../components/skjema/SporsmalMedTillegg';
import { Radioknapp } from '../../components/skjema/Radioknapper';
import { fieldPropTypes, arbeidsgiver as arbeidsgiverPt } from '../../propTypes/index';

const { JA, NEI, VET_IKKE } = forskutterersvar;

export const ForskuttererSporsmal = ({ input, meta }) => {
    return (<Feilomrade {...meta} id="arbeidsgiverForskutterer">
        <div className="medHjelpetekst">
            <h3 className="skjema__sporsmal">{getLedetekst('sykepengesoknad.forskutterer-arbeidsgiver.sporsmal')}</h3>
            <Hjelpetekst id="forskutterer-hjelpetekst">{getLedetekst('sykepengesoknad.forskutterer-arbeidsgiver.hjelpetekst.tekst')}</Hjelpetekst>
        </div>
        {
            [JA, NEI, VET_IKKE].map((alternativ, index) => {
                return (<Radioknapp
                    key={index}
                    value={alternativ}
                    label={getLedetekst(`sykepengesoknad.forskutterer-arbeidsgiver.svar.${alternativ}`)}
                    id={`arbeidsgiverForskutterer-${alternativ}`}
                    input={input} />);
            })
        }
    </Feilomrade>);
};

ForskuttererSporsmal.propTypes = {
    input: fieldPropTypes.input,
    meta: fieldPropTypes.meta,
    arbeidsgiver: arbeidsgiverPt,
};

export const RendreForskuttererArbeidsgiver = (props) => {
    const Sporsmal = <ForskuttererSporsmal {...props} />;
    return (<SporsmalMedTillegg
        className="hovedsporsmal blokk"
        {...props}
        Sporsmal={Sporsmal}
        visTillegg={(_props) => {
            const input = _props.input;
            return input && (input.value === VET_IKKE || input.value === NEI || input.value === JA);
        }}>
        { props.input.value
            && (<div
                className="ekstrasporsmal ekstrasporsmal--sist"
                dangerouslySetInnerHTML={getHtmlLedetekst(`sykepengesoknad.forskutterer-arbeidsgiver.infotekst.${props.input.value}`)} />) }
    </SporsmalMedTillegg>);
};

RendreForskuttererArbeidsgiver.propTypes = {
    input: fieldPropTypes.input,
};

const ForskuttererArbeidsgiver = () => {
    return (<Field
        component={RendreForskuttererArbeidsgiver}
        name="arbeidsgiverForskutterer" />);
};

export default ForskuttererArbeidsgiver;
