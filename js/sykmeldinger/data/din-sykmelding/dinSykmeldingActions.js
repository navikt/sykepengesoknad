import * as actiontyper from '../../../actions/actiontyper';

export function angrerBekreftSykmelding() {
    return {
        type: actiontyper.ANGRER_BEKREFT_SYKMELDING,
    };
}

export function angreBekreftSykmeldingFeilet() {
    return {
        type: actiontyper.ANGRE_BEKREFT_SYKMELDING_FEILET,
    };
}

export function bekreftSykmeldingAngret(sykmeldingId) {
    return {
        type: actiontyper.BEKREFT_SYKMELDING_ANGRET,
        sykmeldingId,
    };
}

export function angreBekreftSykmelding(sykmeldingId) {
    return {
        type: actiontyper.ANGRE_BEKREFT_SYKMELDING_FORESPURT,
        sykmeldingId,
    };
}

