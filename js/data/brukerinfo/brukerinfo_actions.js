import * as actiontyper from '../actiontyper';

export function hentBrukerinfoFeilet() {
    return {
        type: actiontyper.HENT_BRUKERINFO_FEILET,
    };
}

export function henterBrukerinfo() {
    return {
        type: actiontyper.HENTER_BRUKERINFO,
    };
}

export function brukerinfoHentet(brukerinfo = {}) {
    return {
        type: actiontyper.BRUKERINFO_HENTET,
        data: brukerinfo,
    };
}

export function setArbeidssituasjon(arbeidssituasjon) {
    return {
        type: actiontyper.SET_TIDSLINJE_ARBEIDSSITUASJON,
        arbeidssituasjon,
    };
}

export function setErInnlogget() {
    return {
        type: actiontyper.BRUKER_ER_INNLOGGET,
    };
}

export function setErUtlogget() {
    return {
        type: actiontyper.BRUKER_ER_UTLOGGET,
    };
}

export function sjekkerInnlogging() {
    return {
        type: actiontyper.SJEKKER_INNLOGGING,
    };
}

export function sjekkInnlogging() {
    return {
        type: actiontyper.SJEKK_INNLOGGING_FORESPURT,
    };
}

export function sjekkInnloggingFeilet() {
    return {
        type: actiontyper.SJEKK_INNLOGGING_FEILET,
    };
}

export function hentBrukerinfo() {
    return {
        type: actiontyper.HENT_BRUKERINFO_FORESPURT,
    };
}

export function hentOppfolging() {
    return {
        type: actiontyper.HENT_OPPFOLGING_FORESPURT,
    };
}

export function henterOppfolging() {
    return {
        type: actiontyper.HENTER_OPPFOLGING,
    };
}

export function oppfolgingHentet(data) {
    return {
        type: actiontyper.OPPFOLGING_HENTET,
        data,
    };
}

export function hentOppfolgingFeilet() {
    return {
        type: actiontyper.HENT_OPPFOLGING_FEILET,
    };
}


export function hentSykmeldtinfodata() {
    return {
        type: actiontyper.HENT_SYKMELDTINFODATA_FORESPURT,
    };
}

export function henterSykmeldtinfodata() {
    return {
        type: actiontyper.HENTER_SYKMELDTINFODATA,
    };
}

export function sykmeldtInfodataHentet(data) {
    return {
        type: actiontyper.SYKMELDTINFODATA_HENTET,
        data,
    };
}

export function hentSykmeldtinfodataFeilet() {
    return {
        type: actiontyper.HENT_SYKMELDTINFODATA_FEILET,
    };
}
