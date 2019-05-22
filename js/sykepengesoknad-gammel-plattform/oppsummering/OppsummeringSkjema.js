import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Hovedknapp } from 'nav-frontend-knapper';
import { getLedetekst, Utvidbar, SoknadOppsummering, VaerKlarOverAt } from '@navikt/digisyfo-npm';
import reduxFormSetup from '../utils/reduxFormSetup';
import SykepengerSkjema from '../SykepengerSkjema';
import Knapperad from '../../components/skjema/Knapperad';
import mapSkjemasoknadToBackendsoknad from '../mappers/mapSkjemasoknadToBackendsoknad';
import CheckboxSelvstendig from '../../components/skjema/CheckboxSelvstendig';
import validate from './validerOppsummering';
import { sykepengesoknad as sykepengesoknadPt, oppsummeringsoknad as oppsummeringsoknadPt } from '../../propTypes/index';
import ForskuttererArbeidsgiver from './ForskuttererArbeidsgiver';
import AvbrytSoknadContainer from '../avbryt-soknad/AvbrytSoknadContainer';
import Feilstripe from '../../components/Feilstripe';
import FeiloppsummeringContainer from '../../containers/skjema/FeiloppsummeringContainer';
import { getSoknadSkjemanavn } from '../../enums/skjemanavn';
import { ARBEIDSGIVER, ARBEIDSGIVER_OG_NAV, NAV } from '../../sykepengesoknad/enums/soknadmottakertyper';

const mottaker = (sendesTil, sykepengesoknad) => {
    switch (sendesTil) {
        case NAV: return getLedetekst('sykepengesoknad.oppsummering.nav-som-mottaker');
        case ARBEIDSGIVER: return getLedetekst('sykepengesoknad.oppsummering.arbeidsgiver-som-mottaker', { '%ARBEIDSGIVER%': sykepengesoknad.arbeidsgiver.navn });
        case ARBEIDSGIVER_OG_NAV: return getLedetekst('sykepengesoknad.oppsummering.nav-og-arbeidsgiver-som-mottaker', { '%ARBEIDSGIVER%': sykepengesoknad.arbeidsgiver.navn });
        default: return undefined;
    }
};

export class OppsummeringForm extends Component {
    componentDidMount() {
        if (this.form) {
            this.form.focus();
        }
    }

    render() {
        const { sykepengesoknad, oppsummeringsoknad, handleSubmit, actions, sender, sendingFeilet, visForskutteringssporsmal, sendesTil } = this.props;
        const label = getLedetekst('sykepengesoknad.oppsummering.bekreft-korrekt-informasjon.label');
        const onSubmit = (values) => {
            const soknad = mapSkjemasoknadToBackendsoknad(values, {
                visForskutteringssporsmal: visForskutteringssporsmal === true,
            });
            soknad.oppsummering = oppsummeringsoknad;
            const soknadObjekt = JSON.parse(JSON.stringify(soknad)); // Hack for å sikre riktig datoformat
            actions.sendSykepengesoknad(soknadObjekt);
        };

        return (<form
            className="soknadskjema"
            ref={(c) => {
                this.form = c;
            }}
            tabIndex="-1"
            id="oppsummering-skjema"
            onSubmit={handleSubmit(onSubmit)}>
            <Utvidbar tittel="Oppsummering" erApen={false} className="blokk">
                <SoknadOppsummering oppsummeringsoknad={oppsummeringsoknad} />
            </Utvidbar>
            <div className="redaksjonelt-innhold oppsummering__vaerKlarOverAt blokk">
                <VaerKlarOverAt oppsummeringsoknad={oppsummeringsoknad} />
            </div>
            <div className="blokk">
                <Field component={CheckboxSelvstendig} name="bekreftetKorrektInformasjon" id="bekreftetKorrektInformasjon" label={label} />
            </div>
            { visForskutteringssporsmal && <ForskuttererArbeidsgiver /> }
            <Feilstripe vis={sendingFeilet} className="blokk" />
            { !visForskutteringssporsmal && <p className="js-mottaker sykepengerskjema__sendesTil">{mottaker(sendesTil, sykepengesoknad)}</p> }
            <Knapperad variant="knapperad--medAvbryt">
                <Hovedknapp
                    className="js-send"
                    spinner={sender}
                    disabled={sender}>{getLedetekst('sykepengesoknad.send')}
                </Hovedknapp>
            </Knapperad>
            <AvbrytSoknadContainer sykepengesoknad={sykepengesoknad} />
        </form>);
    }
}

OppsummeringForm.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
    handleSubmit: PropTypes.func,
    oppsummeringsoknad: oppsummeringsoknadPt,
    actions: PropTypes.shape({
        sendSykepengesoknad: PropTypes.func,
    }),
    sender: PropTypes.bool,
    sendingFeilet: PropTypes.bool,
    visForskutteringssporsmal: PropTypes.bool,
    sendesTil: PropTypes.string,
};

const OppsummeringSkjema = reduxFormSetup(validate, OppsummeringForm);

const OppsummeringSide = (props) => {
    const { sykepengesoknad } = props;
    return (<SykepengerSkjema aktivtSteg="4" sykepengesoknad={sykepengesoknad}>
        <FeiloppsummeringContainer skjemanavn={getSoknadSkjemanavn(sykepengesoknad.id)} />
        <OppsummeringSkjema {...props} />
    </SykepengerSkjema>);
};

OppsummeringSide.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

export default OppsummeringSide;
