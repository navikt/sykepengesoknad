import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLedetekst, sykmelding as sykmeldingPt, Utvidbar } from '@navikt/digisyfo-npm';
import { Hovedknapp } from 'nav-frontend-knapper';
import { skjemasvar as skjemasvarPt, soknadPt } from '../../../propTypes';
import Feilstripe from '../../../components/Feilstripe';
import Knapperad from '../../../components/skjema/Knapperad';
import populerSoknadMedSvar from '../../utils/populerSoknadMedSvar';
import Oppsummeringsvisning from '../../felleskomponenter/oppsummering/Oppsummeringsvisning';
import { BEKREFT_OPPLYSNINGER, VAER_KLAR_OVER_AT } from '../../enums/tagtyper';
import OppsummeringUndertekst from '../../felleskomponenter/oppsummering/OppsummeringUndertekst';
import Sporsmal from '../../felleskomponenter/sporsmal/Sporsmal';
import SoknadMottaker, { mapStateToSoknadMottakerProps } from './SoknadMottaker';
import AvbrytSoknadContainer from '../../felleskomponenter/avbryt-soknad/AvbrytSoknadContainer';

const Sendknapp = ({ sender, henter }) => {
    return (<Hovedknapp
        className="js-send"
        disabled={sender || henter}
        spinner={sender}>{getLedetekst('sykepengesoknad.send')}</Hovedknapp>);
};

Sendknapp.propTypes = {
    sender: PropTypes.bool,
    henter: PropTypes.bool,
};

const ConnectedSendknapp = connect(mapStateToSoknadMottakerProps)(Sendknapp);

export const OppsummeringUtvidbar = ({ soknad }) => {
    const _soknad = {
        ...soknad,
        sporsmal: soknad.sporsmal.filter((s) => {
            return s.tag !== VAER_KLAR_OVER_AT;
        }),
    };
    return (<Utvidbar className="blokk js-soknad-oppsummering" tittel={getLedetekst('sykepengesoknad.oppsummering.tittel')} erApen={false}>
        <Oppsummeringsvisning soknad={_soknad} />
    </Utvidbar>);
};

OppsummeringUtvidbar.propTypes = {
    soknad: soknadPt,
};

export const SykepengesoknadArbeidstakerOppsummeringSkjema = (props) => {
    const {
        handleSubmit,
        soknad,
        skjemasvar,
        actions,
        sender,
        sendingFeilet,
        sykmelding,
    } = props;

    const populertSoknad = populerSoknadMedSvar(soknad, skjemasvar);

    const vaerKlarOverAtSpm = soknad.sporsmal.find((s) => {
        return s.tag === VAER_KLAR_OVER_AT;
    });
    const bekreftOpplysningerSpm = soknad.sporsmal.find((s) => {
        return s.tag === BEKREFT_OPPLYSNINGER;
    });

    const onSubmit = () => {
        actions.sendSoknad(populertSoknad);
    };

    return (<form className="soknadskjema" id="oppsummering-skjema" onSubmit={handleSubmit(onSubmit)}>
        {skjemasvar && <OppsummeringUtvidbar soknad={populertSoknad} />}
        <div className="blokk oppsummering__vaerKlarOverAt">
            <OppsummeringUndertekst {...vaerKlarOverAtSpm} />
        </div>
        <div className="blokk">
            <Sporsmal
                sporsmal={bekreftOpplysningerSpm}
                name={bekreftOpplysningerSpm.tag}
                soknad={soknad} />
        </div>
        <SoknadMottaker
            soknad={soknad}
            skjemasvar={skjemasvar}
            mottakernavn={sykmelding ? sykmelding.mottakendeArbeidsgiver.navn : null} />
        <Feilstripe vis={sendingFeilet} />
        <Knapperad variant="blokk">
            <ConnectedSendknapp className="js-send" sender={sender} soknad={soknad} />
        </Knapperad>
        <AvbrytSoknadContainer sykepengesoknad={soknad} />
    </form>);
};

SykepengesoknadArbeidstakerOppsummeringSkjema.propTypes = {
    handleSubmit: PropTypes.func,
    soknad: soknadPt,
    skjemasvar: skjemasvarPt,
    actions: PropTypes.shape({
        sendSoknad: PropTypes.func,
    }),
    sender: PropTypes.bool,
    sendingFeilet: PropTypes.bool,
    sykmelding: sykmeldingPt,
    sidenummer: PropTypes.number,
};
