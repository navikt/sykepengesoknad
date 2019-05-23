import * as actiontyper from '../actiontyper';

export function sendSkjemaFeilet(skjemanavn) {
    return {
        type: actiontyper.SEND_SKJEMA_FEILET,
        skjemanavn,
    };
}

export function sendSkjemaFeiletHandtert(skjemanavn) {
    return {
        type: actiontyper.SEND_SKJEMA_FEILET_HANDTERT,
        skjemanavn,
    };
}

export function skjemaErGyldig(skjemanavn) {
    return {
        type: actiontyper.SKJEMA_ER_GYLDIG,
        skjemanavn,
    };
}
