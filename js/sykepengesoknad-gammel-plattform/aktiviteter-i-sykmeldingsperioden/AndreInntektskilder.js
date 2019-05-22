import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { getLedetekst, inntektskildetyper as inntektskildetypeEnums } from '@navikt/digisyfo-npm';
import Checkbox from '../../components/skjema/Checkbox';
import { parseJaEllerNei } from '../../components/skjema/JaEllerNei';
import Feilomrade from '../../components/skjema/Feilomrade';
import Radioknapper from '../../components/skjema/Radioknapper';
import { annenInntektskilde, fieldPropTypes } from '../../propTypes/index';
import { finnInntektskildeLabel } from '../utils/finnSykepengesoknadSporsmal';

const getPresisering = (annenInntektskildeType) => {
    return getLedetekst(`sykepengesoknad.andre-inntektskilder.${annenInntektskildeType}.presisering`);
};

export const inntektskildetyper = Object.keys(inntektskildetypeEnums).map((key) => {
    return {
        annenInntektskildeType: inntektskildetypeEnums[key],
    };
});

export const VelgInntektskilder = ({ fields, meta }) => {
    return (<Feilomrade {...meta} id="andreInntektskilder">
        <h4 className="skjema__sporsmal">{getLedetekst('sykepengesoknad.andre-inntektskilder.hvilke-inntektskilder.sporsmal')}</h4>
        {
            fields.map((field, index) => {
                return (
                    <Field
                        label={finnInntektskildeLabel(field.annenInntektskildeType)}
                        id={`inntektskilde-${index}`}
                        name={`andreInntektskilder[${index}].avkrysset`}
                        key={index}
                        component={Checkbox}>
                        {
                            field.annenInntektskildeType !== inntektskildetypeEnums.ANNET && <Field
                                component={Radioknapper}
                                spoersmal={getLedetekst('sykepengesoknad.andre-inntektskilder.er-du-sykmeldt-fra-dette.sporsmal')}
                                parse={parseJaEllerNei}
                                name={`andreInntektskilder[${index}].sykmeldt`}>
                                <div label={getLedetekst('sykepengesoknad.ja')} value>
                                    <div className="presisering blokk">
                                        <p className="sist">{getPresisering(field.annenInntektskildeType)}</p>
                                    </div>
                                </div>
                                <input label={getLedetekst('sykepengesoknad.nei')} value={false} />
                            </Field>
                        }
                    </Field>);
            })
        }
        <p>{getLedetekst('sykepengesoknad.andre-inntektskilder.hvilke-inntektskilder.informasjon')}</p>
    </Feilomrade>);
};

VelgInntektskilder.propTypes = {
    fields: PropTypes.arrayOf(annenInntektskilde),
    meta: fieldPropTypes.meta,
};

const AndreInntektskilderComponent = () => {
    return <FieldArray component={VelgInntektskilder} fields={inntektskildetyper} name="andreInntektskilder" />;
};

export default AndreInntektskilderComponent;
