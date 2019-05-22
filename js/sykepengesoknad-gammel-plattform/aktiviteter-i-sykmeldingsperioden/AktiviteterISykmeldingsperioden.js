import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { getLedetekst, senesteTom as finnSenesteTom } from '@navikt/digisyfo-npm';
import SykepengerSkjema from '../SykepengerSkjema';
import history from '../../history';
import reduxFormSetup from '../utils/reduxFormSetup';
import JaEllerNei, { JaEllerNeiRadioknapper, parseJaEllerNei } from '../../components/skjema/JaEllerNei';
import Datovelger from '../../components/skjema/datovelger/Datovelger';
import Aktiviteter from './Aktiviteter';
import AndreInntektskilder from './AndreInntektskilder';
import { KnapperadSoknad } from '../../components/skjema/Knapperad';
import validate from './validerAktiviteterISykmeldingsperioden';
import connectGjenopptattArbeidFulltUtDato from '../utils/connectGjenopptattArbeidFulltUtDato';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';
import AvbrytSoknadContainer from '../avbryt-soknad/AvbrytSoknadContainer';
import { finnUtdanningssporsmal } from '../utils/finnSykepengesoknadSporsmal';
import { filtrerAktuelleAktiviteter } from '../utils/sykepengesoknadUtils';
import { PreutfyltBjorn } from '../fravar-og-friskmelding/Egenmeldingsdager';
import FeiloppsummeringContainer from '../../containers/skjema/FeiloppsummeringContainer';
import { getSoknadSkjemanavn } from '../../enums/skjemanavn';

export const UtdanningStartDato = ({ senesteTom }) => {
    return (<div className="blokk">
        <label
            className="skjema__sporsmal"
            htmlFor="utdanning.utdanningStartdato">{getLedetekst('sykepengesoknad.utdanning.startdato.sporsmal')}</label>
        <Datovelger name="utdanning.utdanningStartdato" id="utdanning.utdanningStartdato" senesteTom={senesteTom} />
    </div>);
};

UtdanningStartDato.propTypes = {
    senesteTom: PropTypes.instanceOf(Date),
};

export class AktiviteterISykmeldingsperiodenSkjema extends Component {
    componentDidMount() {
        if (this.form) {
            this.form.focus();
        }
    }

    render() {
        const { handleSubmit, sykepengesoknad, autofill, untouch, gjenopptattArbeidFulltUtDato, erUtdanningPreutfylt, erInntektskilderPreutfylt } = this.props;

        const onSubmit = () => {
            history.push(`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${sykepengesoknad.id}/oppsummering`);
        };

        const _aktiviteter = filtrerAktuelleAktiviteter(sykepengesoknad.aktiviteter, gjenopptattArbeidFulltUtDato);
        const _senesteTom = finnSenesteTom(_aktiviteter.map((a) => { return a.periode; }));

        return (<form
            className="soknadskjema"
            ref={(c) => {
                this.form = c;
            }}
            tabIndex="-1"
            id="aktiviteter-i-sykmeldingsperioden-skjema"
            onSubmit={handleSubmit(onSubmit)}>
            <div className="hovedsporsmalliste">
                <FieldArray
                    sykepengesoknad={sykepengesoknad}
                    component={Aktiviteter}
                    fields={_aktiviteter}
                    autofill={autofill}
                    untouch={untouch}
                    name="aktiviteter" />
                <JaEllerNei
                    hovedsporsmal
                    informasjon={<PreutfyltBjorn vis={erInntektskilderPreutfylt} />}
                    name="harAndreInntektskilder"
                    spoersmal={getLedetekst('sykepengesoknad.andre-inntektskilder.janei.sporsmal', {
                        '%ARBEIDSGIVER%': sykepengesoknad.arbeidsgiver.navn,
                    })}>
                    <AndreInntektskilder />
                </JaEllerNei>
                {
                    _aktiviteter.length > 0
                        &&
                            <JaEllerNei
                                hovedsporsmal
                                informasjon={<PreutfyltBjorn vis={erUtdanningPreutfylt} />}
                                name="utdanning.underUtdanningISykmeldingsperioden"
                                spoersmal={finnUtdanningssporsmal(sykepengesoknad, gjenopptattArbeidFulltUtDato)}>
                                <UtdanningStartDato senesteTom={_senesteTom} />
                                <Field
                                    component={JaEllerNeiRadioknapper}
                                    name="utdanning.erUtdanningFulltidsstudium"
                                    parse={parseJaEllerNei}
                                    spoersmal={getLedetekst('sykepengesoknad.utdanning.fulltidsstudium.sporsmal')}
                                    Overskrift="h4" />
                            </JaEllerNei>
                }
            </div>
            <KnapperadSoknad forrigeUrl={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${sykepengesoknad.id}/fravaer-og-friskmelding`} />
            <AvbrytSoknadContainer sykepengesoknad={sykepengesoknad} />
        </form>);
    }
}

AktiviteterISykmeldingsperiodenSkjema.propTypes = {
    handleSubmit: PropTypes.func,
    sykepengesoknad: sykepengesoknadPt,
    autofill: PropTypes.func,
    untouch: PropTypes.func,
    gjenopptattArbeidFulltUtDato: PropTypes.instanceOf(Date),
    erInntektskilderPreutfylt: PropTypes.bool,
    erUtdanningPreutfylt: PropTypes.bool,
};

const AktiviteterISykmeldingsperiodenSkjemaConnected = connectGjenopptattArbeidFulltUtDato(AktiviteterISykmeldingsperiodenSkjema);

const AktiviteterISykmeldingsperiodenReduxSkjema = reduxFormSetup(validate, AktiviteterISykmeldingsperiodenSkjemaConnected);

const AktiviteterISykmeldingsperioden = ({ sykepengesoknad, skjemasoknad }) => {
    return (
        <SykepengerSkjema
            aktivtSteg="3"
            tittel={getLedetekst('sykepengesoknad.aktiviteter-i-sykmeldingsperioden.tittel')}
            sykepengesoknad={sykepengesoknad}>
            <FeiloppsummeringContainer skjemanavn={getSoknadSkjemanavn(sykepengesoknad.id)} />
            <AktiviteterISykmeldingsperiodenReduxSkjema
                sykepengesoknad={sykepengesoknad}
                erUtdanningPreutfylt={skjemasoknad._erUtdanningPreutfylt}
                erInntektskilderPreutfylt={skjemasoknad._erInntektskilderPreutfylt} />
        </SykepengerSkjema>);
};

AktiviteterISykmeldingsperioden.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
    skjemasoknad: PropTypes.shape(),
};

export default AktiviteterISykmeldingsperioden;
