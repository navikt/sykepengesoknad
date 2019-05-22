import * as actiontyper from './actiontyper';

export const hentUnleashToggles = () => {
    return {
        type: actiontyper.HENT_UNLEASH_TOGGLES_FORESPURT,
    };
};

export const henterUnleashToggles = () => {
    return {
        type: actiontyper.HENTER_UNLEASH_TOGGLES,
    };
};

export const unleashTogglesHentet = (data) => {
    return {
        type: actiontyper.HENTET_UNLEASH_TOGGLES,
        data,
    };
};

export const hentUnleashTogglesFeilet = () => {
    return {
        type: actiontyper.HENT_UNLEASH_TOGGLES_FEILET,
    };
};
