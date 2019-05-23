import * as actiontyper from '../../../data/actiontyper';

export function henterDineSykmeldinger() {
    return {
        type: actiontyper.HENTER_DINE_SYKMELDINGER,
    };
}

export function hentDineSykmeldingerFeilet() {
    return {
        type: actiontyper.HENT_DINE_SYKMELDINGER_FEILET,
    };
}

export function setDineSykmeldinger(sykmeldinger = []) {
    return {
        type: actiontyper.SET_DINE_SYKMELDINGER,
        sykmeldinger,
    };
}

export function sorterSykmeldinger(kriterium, status) {
    return {
        type: actiontyper.SET_SORTERING,
        kriterium,
        status,
    };
}

export function hentDineSykmeldinger() {
    return {
        type: actiontyper.HENT_DINE_SYKMELDINGER_FORESPURT,
    };
}
