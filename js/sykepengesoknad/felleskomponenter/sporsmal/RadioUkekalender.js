import React from 'react';
import { connect } from 'react-redux';
import { autofill as autofillAction, Field } from 'redux-form';
import { Radio } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import { formaterEnkeltverdi, genererParseForEnkeltverdi } from './fieldUtils';
import { getSkjemanavnFraSoknad } from '../../utils/getSkjemanavnFraSoknad';
import { hentSkjemaVerdier } from '../../../data/redux-form/reduxFormSelectors';
import { CHECKED } from '../../enums/svarEnums';
import Undersporsmalsliste from './Undersporsmalsliste';
import Feilomrade from '../../../components/skjema/Feilomrade';
import { fieldPropTypes, soknadPt, sporsmal as sporsmalPt } from '../../../propTypes/index';

const lagLabel = (sporsmalstekst) => {
    if (sporsmalstekst === 'Ikke til behandling') {
        return 'fjern';
    }
    return new Date(sporsmalstekst).getDate().toString();
};

const dagerSidenMandag = (sporsmal) => {
    return (((new Date(sporsmal.sporsmalstekst).getDay() - 1) % 7) + 7) % 7;
};

const Radioknapp = ({ input, label, children, id }) => {
    const checked = input.value === label;
    return (<div role={label === 'fjern' ? 'link' : 'button'} className={`kalenderdag${lagLabel(label) === 'fjern' ? ' fjern' : ''}`}>
        <Radio {...input} label={lagLabel(label)} value={label} checked={checked} id={id} />
        {checked && children}
    </div>);
};

Radioknapp.propTypes = {
    input: fieldPropTypes.input,
    label: PropTypes.string,
    children: PropTypes.node,
    id: PropTypes.string,
};

const RadioUkekalenderComponent = ({ meta, tag, undersporsmal, autofill, soknad, verdi }) => {
    const sporsmalMedUndersporsmal = undersporsmal.find((s) => {
        return s.sporsmalstekst === verdi;
    });
    return (<Feilomrade {...meta}>
        <div className={'ukedager'}><span>Man</span><span>Tir</span><span>Ons</span><span>Tor</span><span>Fre</span></div>
        <div className={'ukekalender'}>
            {
                Array(dagerSidenMandag(undersporsmal[0])).fill(0).map(() => {
                    return (
                        <div className={'kalenderdag'}><div className={'ikkedag'} /></div>
                    );
                })
            }
            {
                undersporsmal.map((sporsmal) => {
                    return (
                        <Field
                            component={Radioknapp}
                            key={lagLabel(sporsmal.sporsmalstekst)}
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

RadioUkekalenderComponent.propTypes = {
    input: fieldPropTypes.input,
    meta: fieldPropTypes.meta,
    tag: PropTypes.string,
    undersporsmal: PropTypes.arrayOf(sporsmalPt),
    autofill: PropTypes.func,
    soknad: soknadPt,
    verdi: PropTypes.string,
};

const RadioUkekalender = (props) => {
    return (<Field name={props.tag} component={RadioUkekalenderComponent} {...props} />);
};

RadioUkekalender.propTypes = {
    tag: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
    const verdier = hentSkjemaVerdier(state, getSkjemanavnFraSoknad(ownProps.soknad));

    const verdi = verdier[ownProps.tag] !== null ? verdier[ownProps.tag] : { svarverdier: [{ verdi: 'Ikke til behandling' }] };

    return {
        verdi: formaterEnkeltverdi(verdi),
    };
};

export default connect(mapStateToProps, { autofill: autofillAction })(RadioUkekalender);
