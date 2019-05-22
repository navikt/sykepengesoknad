import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getFormValues } from 'redux-form';
import { getLedetekst, sykepengesoknad as sykepengesoknadPt } from '@navikt/digisyfo-npm';
import { connect } from 'react-redux';
import { Radio } from 'nav-frontend-skjema';
import TekstfeltMedEnhet from '../../components/skjema/TekstfeltMedEnhet';
import { lagDesimaltall, getObjectValueByString, lagHeltall } from '../../utils/index';
import BeregnetArbeidsgrad, { getStillingsprosent } from './BeregnetArbeidsgrad';
import { soknadperiode, fieldPropTypes } from '../../propTypes/index';
import { getFeriePermisjonPerioder } from '../utils/sykepengesoknadUtils';
import { finnTotalJobbingSporsmal } from '../utils/finnSykepengesoknadSporsmal';
import { getSoknadSkjemanavn } from '../../enums/skjemanavn';

class OppgiArbeid extends Component {
    constructor(props) {
        super(props);
        let valgtEnhet = 'prosent';
        try {
            const timerName = this.props.names[1];
            const timer = getObjectValueByString(this.props, timerName).input.value;
            if (timer && timer !== '') {
                valgtEnhet = 'timer';
            }
        } catch (e) {
            valgtEnhet = 'prosent';
        }

        this.state = {
            valgtEnhet,
        };
    }

    componentDidMount() {
        this.setEnhet(this.getValgtEnhet());
    }

    setEnhet(enhet) {
        const { autofill } = this.props;
        autofill(this.getEnhetName(), enhet);
    }

    getValgtEnhet() {
        return this.state.valgtEnhet;
    }

    getEnhetLabel() {
        return getLedetekst(`sykepengesoknad.angi-tid.antall.label-totalt.${this.getValgtEnhet()}`);
    }

    getAntallName() {
        if (this.getValgtEnhet() === 'prosent') {
            return this.props.names[0];
        }
        return this.props.names[1];
    }

    getEnhetName() {
        return this.props.names[3];
    }

    getAntallId() {
        return `angiTid-${this.props.aktivitetIndex}`;
    }

    getStillingsprosent() {
        const { periode, ferieOgPermisjonPerioder } = this.props;
        const avvik = this.getAvvik();
        const timer = avvik.timer.input.value;
        const arbeidstimerNormalUke = avvik.arbeidstimerNormalUke.input.value;
        return getStillingsprosent(timer, arbeidstimerNormalUke, periode, ferieOgPermisjonPerioder);
    }

    getAvvik() {
        const { aktiviteter, aktivitetIndex } = this.props;
        return aktiviteter[aktivitetIndex].avvik;
    }

    _lagreStillingsprosent() {
        const stillingsprosent = this.getStillingsprosent();
        if (this.getValgtEnhet() === 'timer' && this.visTilsvarendeIProsent()) {
            this.props.autofill(this.props.names[4], stillingsprosent);
        }
    }

    visTilsvarendeIProsent() {
        const avvik = this.getAvvik();
        const timer = avvik.timer.input.value;
        const stillingsprosent = this.getStillingsprosent();
        return timer !== '' && stillingsprosent !== undefined;
    }

    render() {
        const { autofill, untouch, sykepengesoknad } = this.props;

        const enheter = [{
            value: 'prosent',
        }, {
            value: 'timer',
        }];

        return (<div className="blokk">
            <div className="skjema__input blokk">
                <label
                    htmlFor={`aktivitet-${this.props.aktivitetIndex}-normal`}
                    className="skjema__sporsmal">
                    {getLedetekst('sykepengesoknad.angi-tid.normal-arbeidstimer.sporsmal')}
                </label>
                <Field
                    name={this.props.names[2]}
                    id={this.props.names[2]}
                    component={TekstfeltMedEnhet}
                    parse={lagDesimaltall}
                    label={getLedetekst('sykepengesoknad.angi-tid.normal-arbeidstimer.label')} />
            </div>
            <h4 className="skjema__sporsmal">
                {finnTotalJobbingSporsmal(sykepengesoknad.arbeidsgiver.navn)}
            </h4>
            <div className="inputgruppe inputgruppe--horisontal">
                {
                    enheter.map((enhet, index) => {
                        const name = `enhet_${this.props.aktivitetIndex}`;
                        const id = `${name}_${index}`;
                        return (<Radio
                            key={id}
                            onChange={() => {
                                autofill(this.getAntallName(), null);
                                untouch(this.getAntallName());
                                this.setState({
                                    valgtEnhet: enhet.value,
                                });
                                this.setEnhet(enhet.value);
                            }}
                            value={enhet.value}
                            name={name}
                            id={id}
                            label={getLedetekst(`sykepengesoknad.angi-tid.velg-enhet.label.${enhet.value}`)}
                            checked={enhet.value === this.state.valgtEnhet}
                            aria-controls={this.getAntallName()} />);
                    })
                }
            </div>
            <Field
                id={this.getAntallName()}
                component={TekstfeltMedEnhet}
                parse={(v) => {
                    return this.getValgtEnhet() === 'timer'
                        ? lagDesimaltall(v)
                        : lagHeltall(v);
                }}
                label={this.getEnhetLabel()}
                name={this.getAntallName()} />
            { this.visTilsvarendeIProsent() && <BeregnetArbeidsgrad stillingsprosent={this.getStillingsprosent()} /> }
        </div>);
    }
}

OppgiArbeid.propTypes = {
    aktivitetIndex: PropTypes.number,
    names: PropTypes.arrayOf(PropTypes.string),
    autofill: PropTypes.func,
    untouch: PropTypes.func,
    ferieOgPermisjonPerioder: PropTypes.arrayOf(soknadperiode),
    sykepengesoknad: sykepengesoknadPt,
    periode: soknadperiode,
    aktiviteter: PropTypes.arrayOf(PropTypes.shape({
        avvik: PropTypes.shape(fieldPropTypes),
        arbeidsgrad: PropTypes.shape(fieldPropTypes),
        beregnetArbeidsgrad: PropTypes.shape(fieldPropTypes),
        enhet: PropTypes.shape(fieldPropTypes),
        timer: PropTypes.shape(fieldPropTypes),
    })),
};

const mapStateToProps = (state, ownProps) => {
    const values = getFormValues(getSoknadSkjemanavn(ownProps.sykepengesoknad.id))(state);
    const ferieOgPermisjonPerioder = getFeriePermisjonPerioder(values);
    return {
        ferieOgPermisjonPerioder,
    };
};

export default connect(mapStateToProps)(OppgiArbeid);
