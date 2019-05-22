import { parseSykepengesoknad, tidligsteFom, senesteTom, sykepengesoknadstatuser } from '@navikt/digisyfo-npm';
import * as actiontyper from '../../../actions/actiontyper';

const { KORRIGERT, AVBRUTT, NY, UTKAST_TIL_KORRIGERING, SLETTET_UTKAST } = sykepengesoknadstatuser;

const initiellState = {
    henter: false,
    hentingFeilet: false,
    sender: false,
    sendingFeilet: false,
    data: [],
    hentet: false,
    henterBerikelse: false,
    henterBerikelseFeilet: false,
};

export function sorterAktiviteterEldsteFoerst(soknad) {
    const aktiviteter = soknad.aktiviteter.sort((a, b) => {
        if (a.periode.fom.getTime() !== b.periode.fom.getTime()) {
            return a.periode.fom - b.periode.fom;
        }
        return a.periode.tom - b.periode.tom;
    });
    return {
        ...soknad,
        aktiviteter,
    };
}

const setSykepengesoknaderProps = (_sykepengesoknader, soknadsId, props) => {
    return _sykepengesoknader.map((soknad) => {
        if (soknad.id === soknadsId) {
            return {
                ...soknad,
                ...props,
            };
        }
        return soknad;
    });
};

export const settErOppdelt = (soknad) => {
    const perioder = soknad.aktiviteter.map((a) => {
        return a.periode;
    });
    const _senesteTom = senesteTom(perioder);
    const _tidligsteFom = tidligsteFom(perioder);
    const _erOppdelt = (() => {
        if (!soknad.fom || !soknad.tom) {
            return false;
        }
        return !(soknad.fom.getTime() === _tidligsteFom.getTime() && soknad.tom.getTime() === _senesteTom.getTime());
    })();
    return {
        ...soknad,
        _erOppdelt,
    };
};

export const finnSoknad = (state, id) => {
    return state.sykepengesoknader.data.filter((s) => {
        return `${s.id}` === id;
    })[0] || {};
};

export default function sykepengesoknader(state = initiellState, action = {}) {
    switch (action.type) {
        case actiontyper.SYKEPENGESOKNADER_HENTET: {
            const soknader = action.sykepengesoknader.map((s) => {
                const soknad = settErOppdelt(parseSykepengesoknad(s));
                return sorterAktiviteterEldsteFoerst(soknad);
            });
            return {
                ...state,
                data: soknader,
                henter: false,
                hentingFeilet: false,
                hentet: true,
            };
        }
        case actiontyper.HENTER_SYKEPENGESOKNADER: {
            return {
                ...state,
                henter: true,
                hentingFeilet: false,
                hentet: false,
            };
        }
        case actiontyper.HENT_SYKEPENGESOKNADER_FEILET: {
            return {
                ...state,
                henter: false,
                hentingFeilet: true,
                hentet: true,
            };
        }
        case actiontyper.SENDER_SYKEPENGESOKNAD: {
            return {
                ...state,
                sender: true,
                sendingFeilet: false,
            };
        }
        case actiontyper.SEND_SYKEPENGESOKNAD_FEILET: {
            return {
                ...state,
                sender: false,
                sendingFeilet: true,
            };
        }
        case actiontyper.SEND_SYKEPENGESOKNAD_HAR_IKKE_FEILET: {
            return {
                ...state,
                sendingFeilet: false,
                sender: false,
            };
        }
        case actiontyper.START_ENDRING_SYKEPENGESOKNAD_FORESPURT: {
            return {
                ...state,
                starterEndring: true,
                startEndringFeilet: false,
            };
        }
        case actiontyper.ENDRING_SYKEPENGESOKNAD_STARTET: {
            let data = state.data;
            const soknad = settErOppdelt(parseSykepengesoknad(action.sykepengesoknad));
            if (state.data.filter((s) => {
                return s.id === soknad.id;
            }).length === 0) {
                data = [...state.data, soknad];
            }
            return {
                ...state,
                data,
                starterEndring: false,
                startEndringFeilet: false,
            };
        }
        case actiontyper.START_ENDRING_FEILET: {
            return {
                ...state,
                starterEndring: false,
                startEndringFeilet: true,
            };
        }
        case actiontyper.SYKEPENGESOKNAD_SENDT:
        case actiontyper.SYKEPENGESOKNAD_SENDT_TIL_NAV:
        case actiontyper.SYKEPENGESOKNAD_SENDT_TIL_ARBEIDSGIVER: {
            let data = setSykepengesoknaderProps(state.data, action.sykepengesoknadsId, settErOppdelt(parseSykepengesoknad(action.sykepengesoknad)));
            if (action.sykepengesoknad.korrigerer) {
                data = setSykepengesoknaderProps(data, action.sykepengesoknad.korrigerer, {
                    status: KORRIGERT,
                });
            }
            return {
                ...state,
                data,
                sender: false,
                sendingFeilet: false,
            };
        }
        case actiontyper.SYKEPENGESOKNAD_BERIKELSE_HENTET: {
            const berikelse = {
                ...action.data,
                forrigeSykeforloepTom: action.data.forrigeSykeforloepTom ? new Date(action.data.forrigeSykeforloepTom) : action.data.forrigeSykeforloepTom,
                oppfoelgingsdato: action.data.oppfoelgingsdato ? new Date(action.data.oppfoelgingsdato) : action.data.oppfoelgingsdato,
            };
            const data = setSykepengesoknaderProps(state.data, action.sykepengesoknadsId, berikelse);
            return {
                ...state,
                data,
                henterBerikelse: false,
                henterBerikelseFeilet: false,
            };
        }
        case actiontyper.HENTER_SYKEPENGESOKNAD_BERIKELSE: {
            return {
                ...state,
                henterBerikelse: true,
                henterBerikelseFeilet: false,
            };
        }
        case actiontyper.SYKEPENGESOKNAD_BERIKELSE_FEILET: {
            return {
                ...state,
                henterBerikelse: false,
                henterBerikelseFeilet: true,
            };
        }
        case actiontyper.AVBRYTER_SYKEPENGESOKNAD: {
            return {
                ...state,
                avbryter: true,
            };
        }
        case actiontyper.AVBRYT_SYKEPENGESOKNAD_FEILET: {
            return {
                ...state,
                avbryter: false,
                avbrytFeilet: true,
            };
        }
        case actiontyper.SYKEPENGESOKNAD_AVBRUTT: {
            const soknad = finnSoknad({ sykepengesoknader: state }, action.sykepengesoknadsId);
            let status = AVBRUTT;
            if (soknad.status === UTKAST_TIL_KORRIGERING) {
                status = SLETTET_UTKAST;
            }
            const data = setSykepengesoknaderProps(state.data, action.sykepengesoknadsId, {
                status,
                avbruttDato: new Date(),
            });
            return {
                ...state,
                data,
                avbryter: false,
                avbrytFeilet: false,
            };
        }
        case actiontyper.GJENAPNER_SYKEPENGESOKNAD: {
            return {
                ...state,
                gjenapner: true,
            };
        }
        case actiontyper.GJENAPNE_SYKEPENGESOKNAD_FEILET: {
            return {
                ...state,
                gjenapner: false,
                gjenapneFeilet: true,
            };
        }
        case actiontyper.SYKEPENGESOKNAD_GJENAPNET: {
            const data = setSykepengesoknaderProps(state.data, action.sykepengesoknadsId, {
                status: NY,
                avbruttDato: null,
            });
            return {
                ...state,
                data,
                gjenapner: false,
                gjenapneFeilet: false,
            };
        }
        default:
            return state;
    }
}
