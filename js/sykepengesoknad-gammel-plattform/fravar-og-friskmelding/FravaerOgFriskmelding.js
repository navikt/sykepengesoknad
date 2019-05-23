import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getLedetekst } from '@navikt/digisyfo-npm';
import SykepengerSkjema from '../SykepengerSkjema';
import history from '../../history';
import reduxFormSetup from '../utils/reduxFormSetup';
import Egenmeldingsdager from './Egenmeldingsdager';
import GjenopptattArbeidFulltUt from './GjenopptattArbeidFulltUt';
import FeriePermisjonEllerUtenlandsopphold from './FeriePermisjonEllerUtenlandsopphold';
import { KnapperadSoknad } from '../../components/skjema/Knapperad';
import validerFravaerOgFriskmelding from './validerFravaerOgFriskmelding';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';
import AvbrytSoknadContainer from '../avbryt-soknad/AvbrytSoknadContainer';
import FeiloppsummeringContainer from '../../components/skjema/feiloppsummering/FeiloppsummeringContainer';
import { getSoknadSkjemanavn } from '../../enums/skjemanavn';
import { getUrlTilAktiviteterISykmeldingsperioden, getUrlTilSoknad } from '../../utils/urlUtils';

export class FravaerOgFriskmeldingSkjema extends Component {
    componentDidMount() {
        if (this.form) {
            this.form.focus();
        }
    }

    render() {
        const { handleSubmit, sykepengesoknad, erEgenmeldingsperioderPreutfylt } = this.props;
        const onSubmit = () => {
            history.push(getUrlTilAktiviteterISykmeldingsperioden(sykepengesoknad.id));
        };
        return (<form
            className="soknadskjema"
            ref={(c) => {
                this.form = c;
            }}
            tabIndex="-1"
            id="fravaer-og-friskmelding-skjema"
            onSubmit={handleSubmit(onSubmit)}>
            <div className="hovedsporsmalliste">
                <Egenmeldingsdager sykepengesoknad={sykepengesoknad} erEgenmeldingsperioderPreutfylt={erEgenmeldingsperioderPreutfylt} />
                <GjenopptattArbeidFulltUt sykepengesoknad={sykepengesoknad} />
                <FeriePermisjonEllerUtenlandsopphold sykepengesoknad={sykepengesoknad} />
            </div>
            <KnapperadSoknad forrigeUrl={getUrlTilSoknad(sykepengesoknad.id)} />
            <AvbrytSoknadContainer sykepengesoknad={sykepengesoknad} />
        </form>);
    }
}

FravaerOgFriskmeldingSkjema.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    sykepengesoknad: sykepengesoknadPt,
    erEgenmeldingsperioderPreutfylt: PropTypes.bool,
};

const FravaerOgFriskmeldingSkjemaSetup = reduxFormSetup(validerFravaerOgFriskmelding, FravaerOgFriskmeldingSkjema);

const FravaerOgFriskmelding = ({ sykepengesoknad, skjemasoknad }) => {
    return (
        <SykepengerSkjema
            aktivtSteg="2"
            tittel={getLedetekst('sykepengesoknad.fraver-og-friskmelding.tittel')}
            sykepengesoknad={sykepengesoknad}>
            <FeiloppsummeringContainer skjemanavn={getSoknadSkjemanavn(sykepengesoknad.id)} />
            <FravaerOgFriskmeldingSkjemaSetup
                sykepengesoknad={sykepengesoknad}
                erEgenmeldingsperioderPreutfylt={skjemasoknad._erEgenmeldingsperioderPreutfylt} />
        </SykepengerSkjema>);
};

FravaerOgFriskmelding.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
    skjemasoknad: PropTypes.shape(),
};

export default FravaerOgFriskmelding;
