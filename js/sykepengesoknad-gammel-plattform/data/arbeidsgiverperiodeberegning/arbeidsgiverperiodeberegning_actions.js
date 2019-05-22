import * as actiontyper from '../../../actions/actiontyper';

export function hentArbeidsgiverperiodeberegning(sykepengesoknad) {
    return {
        type: actiontyper.HENT_ARBEIDSGIVERPERIODEBEREGNING_FORESPURT,
        sykepengesoknad,
    };
}

export function henterArbeidsgiverperiodeberegning() {
    return {
        type: actiontyper.HENTER_ARBEIDSGIVERPERIODEBEREGNING,
    };
}

export function arbeidsgiverperiodeberegningHentet(data) {
    return {
        type: actiontyper.ARBEIDSGIVERPERIODEBEREGNING_HENTET,
        data,
    };
}

export function arbeidsgiverperiodeberegningFeilet() {
    return {
        type: actiontyper.HENT_ARBEIDSGIVERPERIODEBEREGNING_FEILET,
    };
}
