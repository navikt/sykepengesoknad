import React from 'react';
import { connect } from 'react-redux';
import { autofill as autofillAction, Field } from 'redux-form';
import { Radio } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import { formaterEnkeltverdi, genererParseForEnkeltverdi } from './fieldUtils';
import Sporsmalstekst from './Sporsmalstekst';
import { getSkjemanavnFraSoknad } from '../../utils/getSkjemanavnFraSoknad';
import { hentSkjemaVerdier } from '../../../selectors/reduxFormSelectors';
import { CHECKED } from '../../enums/svarEnums';
import Undersporsmalsliste from './Undersporsmalsliste';
import Feilomrade from '../../../components/skjema/Feilomrade';
import { fieldPropTypes, soknadPt, sporsmal as sporsmalPt, svartypePt } from '../../../propTypes/index';
import { RADIO_GRUPPE_TIMER_PROSENT } from '../../enums/svartyper';

export const erHorisontal = (svartype) => {
    return svartype === RADIO_GRUPPE_TIMER_PROSENT;
};

const Radioknapp = ({ input, label, children, id }) => {
    const checked = input.value === label;
    return (<div>
        <Radio {...input} label={label} value={label} checked={checked} id={id} />
        {checked && children}
    </div>);
};

Radioknapp.propTypes = {
    input: fieldPropTypes.input,
    label: PropTypes.string,
    children: PropTypes.node,
    id: PropTypes.string,
};

const RadiogruppeComponent = ({ meta, tag, sporsmalstekst, svartype, undersporsmal, autofill, soknad, verdi }) => {
    const sporsmalMedUndersporsmal = undersporsmal.find((s) => {
        return s.sporsmalstekst === verdi;
    });
    return (<Feilomrade {...meta}>
        <Sporsmalstekst tekst={sporsmalstekst} />
        <div className={erHorisontal(svartype) ? 'inputgruppe inputgruppe--horisontal' : 'inputgruppe'}>
            {
                undersporsmal.map((sporsmal) => {
                    return (
                        <Field
                            component={Radioknapp}
                            key={sporsmal.sporsmalstekst}
                            label={sporsmal.sporsmalstekst}
                            id={sporsmal.tag}
                            name={tag}
                            onChange={() => {
                                undersporsmal.forEach((_underspm) => {
                                    const value = _underspm.tag === sporsmal.tag ? CHECKED : '';
                                    autofill(getSkjemanavnFraSoknad(soknad), _underspm.tag, genererParseForEnkeltverdi()(value));
                                });
                            }}
                            parse={genererParseForEnkeltverdi()}
                            format={formaterEnkeltverdi} />);
                })
            }
        </div>
        {
            sporsmalMedUndersporsmal && <Undersporsmalsliste soknad={soknad} undersporsmal={sporsmalMedUndersporsmal.undersporsmal} />
        }
    </Feilomrade>);
};

RadiogruppeComponent.propTypes = {
    input: fieldPropTypes.input,
    meta: fieldPropTypes.meta,
    tag: PropTypes.string,
    sporsmalstekst: PropTypes.string,
    undersporsmal: PropTypes.arrayOf(sporsmalPt),
    autofill: PropTypes.func,
    soknad: soknadPt,
    verdi: PropTypes.string,
    svartype: svartypePt,
};

const RadioGruppe = (props) => {
    return (<Field name={props.tag} component={RadiogruppeComponent} {...props} />);
};

RadioGruppe.propTypes = {
    tag: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
    const verdier = hentSkjemaVerdier(state, getSkjemanavnFraSoknad(ownProps.soknad));

    return {
        verdi: formaterEnkeltverdi(verdier[ownProps.tag]),
    };
};

export default connect(mapStateToProps, { autofill: autofillAction })(RadioGruppe);
