import * as actiontyper from '../../../actions/actiontyper';

export const hentLedere = () => {
    return {
        type: actiontyper.HENT_LEDERE_FORESPURT,
    };
};

export const henterLedere = () => {
    return {
        type: actiontyper.HENTER_LEDERE,
    };
};

export const ledereHentet = (data) => {
    return {
        type: actiontyper.LEDERE_HENTET,
        data,
    };
};

export const hentLedereFeilet = () => {
    return {
        type: actiontyper.HENT_LEDERE_FEILET,
    };
};

export const avkreftLeder = (orgnummer) => {
    return {
        type: actiontyper.AVKREFT_LEDER_FORESPURT,
        orgnummer,
    };
};

export const lederAvkreftet = (orgnummer) => {
    return {
        type: actiontyper.LEDER_AVKREFTET,
        orgnummer,
    };
};

export const avkreftLederFeilet = () => {
    return {
        type: actiontyper.LEDER_AVKREFTET_FEILET,
    };
};

export const avkrefterLeder = () => {
    return {
        type: actiontyper.AVKREFTER_LEDER,
    };
};
