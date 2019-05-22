import {
    HENT_SOKNAD_MOTTAKER_FORESPURT,
    HENT_SOKNAD_MOTTAKER_FEILET,
    HENTER_SOKNAD_MOTTAKER,
    SOKNAD_MOTTAKER_HENTET,
} from './soknadMetaActiontyper';

export const hentSoknadMottaker = (soknad) => {
    return {
        type: HENT_SOKNAD_MOTTAKER_FORESPURT,
        soknad,
    };
};

export const soknadMottakerHentet = (soknadId, data) => {
    return {
        type: SOKNAD_MOTTAKER_HENTET,
        soknadId,
        data,
    };
};

export const henterSoknadMottaker = (soknadId) => {
    return {
        type: HENTER_SOKNAD_MOTTAKER,
        soknadId,
    };
};

export const hentSoknadMottakerFeilet = (soknadId) => {
    return {
        type: HENT_SOKNAD_MOTTAKER_FEILET,
        soknadId,
    };
};
