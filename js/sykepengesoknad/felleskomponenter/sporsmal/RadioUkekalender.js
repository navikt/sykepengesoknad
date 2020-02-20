import React from 'react';
import { connect } from 'react-redux';
import { autofill as autofillAction, Field } from 'redux-form';
import { Radio } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { formaterEnkeltverdi, genererParseForEnkeltverdi } from './fieldUtils';
import { getSkjemanavnFraSoknad } from '../../utils/getSkjemanavnFraSoknad';
import { hentSkjemaVerdier } from '../../../data/redux-form/reduxFormSelectors';
import Feilomrade from '../../../components/skjema/Feilomrade';
import { fieldPropTypes, soknadPt, sporsmal as sporsmalPt } from '../../../propTypes/index';

const lagLabel = (sporsmalstekst) => {
    if (sporsmalstekst === '') {
        return 'fjern';
    }
    return new Date(sporsmalstekst).getDate().toString();
};

const dagerSidenMandag = (min) => {
    return Array(((new Date(min).getDay() - 1) % 7))
        .fill(0)
        .map((i, idx) => {
            return (
                <div className="kalenderdag" key={idx}>
                    <div className="tomdag" />
                </div>
            );
        });
};

const dagerTilFredag = (max) => {
    return Array((5 - new Date(max).getDay()))
        .fill(0)
        .map((i, idx) => {
            return (
                <div className="kalenderdag" key={idx}>
                    <div className="tomdag" />
                </div>
            );
        });
};

const ukeDatoListe = (min, max) => {
    const ukeListe = [];
    let dato = dayjs(min);
    while (dato.toDate() <= dayjs(max).toDate()) {
        ukeListe.push(dato);
        dato = dato.add(1, 'day');
    }
    return ukeListe;
};

const fjernKlikk = (id) => {
    const fjern = document.getElementById(id);
    fjern.classList.add('skjul');
    const dag = fjern.parentElement.parentElement.querySelector('.valgtDiv');
    dag.classList.remove('valgtDiv');
};

const visFjernRadio = (id) => {
    const fjern = document.getElementById(id);
    if (fjern) {
        fjern.classList.remove('skjul');
    }
};

const velgUkedag = (e) => {
    const nydag = e.target;
    const valgt = nydag.parentElement.parentElement.parentElement
        .querySelector('.valgtDiv');
    if (valgt) {
        valgt.classList.remove('valgtDiv');
    }
    nydag.parentElement.classList.add('valgtDiv');
};

const Radioknapp = ({ input, label, children, id, className }) => {
    const checked = input.value === label;
    return (
        <div role="button" className="kalenderdag" >
            <Radio {...input} label={lagLabel(label)} value={label} checked={checked} id={id} className={className} />
            {checked && children}
        </div>
    );
};

Radioknapp.propTypes = {
    input: fieldPropTypes.input,
    label: PropTypes.string,
    children: PropTypes.node,
    id: PropTypes.string,
    className: PropTypes.string,
};

const RadioUkekalenderComponent = (props) => {
    const { meta, sporsmal, autofill, soknad } = props;
    const ukedager = ukeDatoListe(sporsmal.min, sporsmal.max);
    return (
        <Feilomrade {...meta}>
            <div className="skjema__beh-dager">
                <div className="ukedager">
                    <span>Man</span>
                    <span>Tir</span>
                    <span>Ons</span>
                    <span>Tor</span>
                    <span>Fre</span>
                </div>
                <div className="kalenderuke">
                    {dagerSidenMandag(sporsmal.min)}
                    {ukedager.map((dato) => {
                        const formatertDato = dato.format('YYYY-MM-DD');
                        const valgt = sporsmal.svar[0] && sporsmal.svar[0].verdi === formatertDato
                            ? 'valgtDiv'
                            : '';

                        return (
                            <Field component={Radioknapp}
                                key={formatertDato}
                                label={formatertDato}
                                id={formatertDato}
                                name={sporsmal.tag}
                                className={valgt}
                                onChange={(e) => {
                                    velgUkedag(e);
                                    autofill(
                                        getSkjemanavnFraSoknad(soknad),
                                        sporsmal.tag,
                                        genererParseForEnkeltverdi()(formatertDato),
                                    );
                                    visFjernRadio(`${sporsmal.id}_label`);
                                }}
                                parse={genererParseForEnkeltverdi()}
                                format={formaterEnkeltverdi}
                            />
                        );
                    })}
                    {dagerTilFredag(sporsmal.max)}

                    <div className="kalenderdag">
                        <input type="radio"
                            name={sporsmal.id}
                            className="radioknapp"
                            value=""
                            id={`${sporsmal.id}_fjern`}
                        />
                        <label htmlFor={`${sporsmal.id}_fjern`}
                            id={`${sporsmal.id}_label`}
                            className={`fjern ${sporsmal.svar[0] ? '' : 'skjul'}`}
                            onClick={() => {
                                fjernKlikk(`${sporsmal.id}_label`);
                                autofill(
                                    getSkjemanavnFraSoknad(soknad),
                                    sporsmal.tag,
                                    genererParseForEnkeltverdi()(),
                                );
                            }}
                        >
                            fjern
                        </label>
                    </div>
                </div>
            </div>
        </Feilomrade>
    );
};

RadioUkekalenderComponent.propTypes = {
    input: fieldPropTypes.input,
    meta: fieldPropTypes.meta,
    sporsmal: sporsmalPt,
    autofill: PropTypes.func,
    soknad: soknadPt,
    verdi: PropTypes.string,
};

const RadioUkekalender = (props) => {
    return <Field name={props.tag} component={RadioUkekalenderComponent} {...props} />;
};

RadioUkekalender.propTypes = {
    tag: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
    const verdier = hentSkjemaVerdier(state, getSkjemanavnFraSoknad(ownProps.soknad));
    const verdi = verdier[ownProps.name] !== null ? verdier[ownProps.name] : { svarverdier: [{ verdi: 'Ikke til behandling' }] };
    return {
        verdi: formaterEnkeltverdi(verdi),
    };
};

export default connect(mapStateToProps, { autofill: autofillAction })(RadioUkekalender);
