import * as actiontyper from './actiontyper';

export const hentVedlikehold = () => {
    return {
        type: actiontyper.HENT_VEDLIKEHOLD_FORESPURT,
    };
};

export const henterVedlikehold = () => {
    return {
        type: actiontyper.HENTER_VEDLIKEHOLD,
    };
};

export const vedlikeholdHentet = (vedlikehold) => {
    return {
        type: actiontyper.VEDLIKEHOLD_HENTET,
        data: {
            vedlikehold,
        },
    };
};

export const hentVedlikeholdFeilet = () => {
    return {
        type: actiontyper.HENT_VEDLIKEHOLD_FEILET,
    };
};
