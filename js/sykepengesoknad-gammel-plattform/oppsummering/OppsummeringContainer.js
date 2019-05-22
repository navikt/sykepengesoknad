import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLedetekst, sykepengesoknadstatuser, forskutterersvar } from '@navikt/digisyfo-npm';
import OppsummeringSkjema from './OppsummeringSkjema';
import GenerellSoknadContainer from '../soknad/GenerellArbeidstakersoknadContainer';
import StartIgjen from '../../components/soknad-felles/StartIgjen';
import Kvittering from '../kvittering/Kvittering';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';
import mapSkjemasoknadToBackendsoknad from '../mappers/mapSkjemasoknadToBackendsoknad';
import { hentArbeidsgiverperiodeberegning } from '../data/arbeidsgiverperiodeberegning/arbeidsgiverperiodeberegning_actions';
import { hentLedere } from '../../landingsside/data/ledere/ledereActions';
import AppSpinner from '../../components/AppSpinner';
import mapSkjemasoknadToOppsummeringsoknad from '../mappers/mapSkjemasoknadToOppsummeringsoknad';
import { ARBEIDSGIVER, ARBEIDSGIVER_OG_NAV, NAV } from '../../sykepengesoknad/enums/soknadmottakertyper';

const beforeunload = 'beforeunload';

const { SENDT, TIL_SENDING, NY, UTKAST_TIL_KORRIGERING } = sykepengesoknadstatuser;

const onBeforeUnload = (e) => {
    (e || window.event).returnValue = getLedetekst('sykepengesoknad.navigeringsvarsel');
    return getLedetekst('sykepengesoknad.navigeringsvarsel');
};

export class Oppsummering extends Component {
    componentWillMount() {
        const { backendsoknad, router, route } = this.props;
        this.props.hentArbeidsgiverperiodeberegning(backendsoknad);
        this.props.hentLedere();
        router.setRouteLeaveHook(route, this.routerWillLeave.bind(this));
        window.addEventListener(beforeunload, onBeforeUnload);
    }

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        window.removeEventListener(beforeunload, onBeforeUnload);
        this._mounted = false;
    }

    routerWillLeave(nextLocation) {
        const { pathname } = nextLocation;
        const { sykepengesoknad } = this.props;
        if ([NY, UTKAST_TIL_KORRIGERING].indexOf(sykepengesoknad.status) === -1 || !this._mounted || pathname.indexOf(sykepengesoknad.id) > -1) {
            return null;
        }
        return getLedetekst('sykepengesoknad.navigeringsvarsel');
    }

    render() {
        if (this.props.henterArbeidsgiverperiodeberegning || this.props.henterLedere) {
            return <AppSpinner />;
        }
        return <OppsummeringSkjema {...this.props} />;
    }
}

Oppsummering.propTypes = {
    hentArbeidsgiverperiodeberegning: PropTypes.func,
    hentLedere: PropTypes.func,
    backendsoknad: sykepengesoknadPt,
    henterArbeidsgiverperiodeberegning: PropTypes.bool,
    henterLedere: PropTypes.bool,
    sendesTil: PropTypes.string,
    router: PropTypes.shape(),
    route: PropTypes.shape(),
    sykepengesoknad: sykepengesoknadPt,
};

const brukersSvarPaForskuttering = (arbeidsgiverForskutterer) => {
    return arbeidsgiverForskutterer === forskutterersvar.JA || arbeidsgiverForskutterer === forskutterersvar.VET_IKKE;
};

const AGsSvarPaForskuttering = (ledere, arbeidsgiverOrgnummer) => {
    return ledere
        .filter((leder) => { return leder.orgnummer === arbeidsgiverOrgnummer; })
        .map((leder) => { return leder.arbeidsgiverForskuttererLoenn; })[0];
};

const harAGSvartPaForskuttering = (ledere, arbeidsgiverOrgnummer) => {
    const ledersSvar = AGsSvarPaForskuttering(ledere, arbeidsgiverOrgnummer);
    return ledersSvar === true || ledersSvar === false;
};

const SEKSTEN_DAGER = (16 * 86400000);
const getSisteDagIAGPerioden = (arbeidsgiverPeriodeStartdato) => {
    return new Date(new Date().setTime(arbeidsgiverPeriodeStartdato.getTime() + SEKSTEN_DAGER));
};

const erSoknadInnenforAGPerioden = (arbeidsgiverPeriodeStartdato, soknadFom, soknadTom) => {
    return soknadTom <= getSisteDagIAGPerioden(arbeidsgiverPeriodeStartdato)
    && soknadFom >= arbeidsgiverPeriodeStartdato;
};

const forsteDagISoknadForEllerSammeDagSomSisteDagIAGPerioden = (arbeidsgiverPeriodeStartdato, soknadFom) => {
    return soknadFom <= getSisteDagIAGPerioden(arbeidsgiverPeriodeStartdato);
};

export const utledMottaker = (ledere, skjemasoknad, startdato) => {
    return (erSoknadInnenforAGPerioden(startdato, skjemasoknad.fom, skjemasoknad.tom)
        ? ARBEIDSGIVER
        : ledere
            && (forsteDagISoknadForEllerSammeDagSomSisteDagIAGPerioden(startdato, skjemasoknad.fom)
            || AGsSvarPaForskuttering(ledere, skjemasoknad.arbeidsgiver.orgnummer)
            || brukersSvarPaForskuttering(skjemasoknad.arbeidsgiverForskutterer))
            ? ARBEIDSGIVER_OG_NAV
            : NAV);
};

export const skalViseForskutteringssporsmal = (ledere, skjemasoknad, startdato) => {
    return !ledere
    || (!erSoknadInnenforAGPerioden(startdato, skjemasoknad.fom, skjemasoknad.tom)
    && !forsteDagISoknadForEllerSammeDagSomSisteDagIAGPerioden(startdato, skjemasoknad.fom)
    && !harAGSvartPaForskuttering(ledere, skjemasoknad.arbeidsgiver.orgnummer));
};

export const mapStateToProps = (state, ownProps) => {
    const arbeidsgiverperiodeStartdato = state.arbeidsgiverperiodeberegning.data && state.arbeidsgiverperiodeberegning.data.startdato;
    return {
        henterArbeidsgiverperiodeberegning: state.arbeidsgiverperiodeberegning.henter === true,
        henterLedere: state.ledere.henter,
        visForskutteringssporsmal: skalViseForskutteringssporsmal(state.ledere.data, ownProps.skjemasoknad, new Date(arbeidsgiverperiodeStartdato)),
        sendesTil: utledMottaker(state.ledere.data, ownProps.skjemasoknad, new Date(arbeidsgiverperiodeStartdato)),
        backendsoknad: mapSkjemasoknadToBackendsoknad(ownProps.skjemasoknad),
        oppsummeringsoknad: mapSkjemasoknadToOppsummeringsoknad(ownProps.skjemasoknad, ownProps.sykepengesoknad),
    };
};

export const ConnectedOppsummering = connect(mapStateToProps, {
    hentArbeidsgiverperiodeberegning,
    hentLedere,
})(Oppsummering);

export const Controller = (props) => {
    if (props.sykepengesoknad.status === SENDT || props.sykepengesoknad.status === TIL_SENDING) {
        return <Kvittering sykepengesoknad={props.sykepengesoknad} />;
    }
    if (props.skjemasoknad) {
        return <ConnectedOppsummering {...props} />;
    }
    return <StartIgjen soknad={props.sykepengesoknad} />;
};

Controller.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
    skjemasoknad: PropTypes.shape(),
};

const OppsummeringContainer = (props) => {
    const { params, router, route } = props;
    return (<GenerellSoknadContainer
        Component={Controller}
        router={router}
        route={route}
        params={params} />);
};

OppsummeringContainer.propTypes = {
    params: PropTypes.shape({
        sykepengesoknadId: PropTypes.string,
    }),
    router: PropTypes.shape(),
    route: PropTypes.shape(),
};

export default OppsummeringContainer;
