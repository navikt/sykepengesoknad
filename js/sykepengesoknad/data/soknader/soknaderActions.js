import {
    AVBRYT_SOKNAD_FEILET,
    AVBRYT_SOKNAD_FORESPURT,
    AVBRYTER_SOKNAD,
    GJENAPNE_SOKNAD_FEILET,
    GJENAPNE_SOKNAD_FORESPURT,
    GJENAPNER_SOKNAD,
    HENT_SOKNADER_FEILET,
    HENT_SOKNADER_FORESPURT,
    HENTER_SOKNADER,
    LAGRE_SOKNAD_FORESPURT,
    OPPDATER_SOKNAD_FEILET,
    OPPRETT_SYKEPENGESOKNADUTLAND_FEILET,
    OPPRETT_UTKAST_TIL_KORRIGERING_FEILET,
    OPPRETT_UTKAST_TIL_KORRIGERING_FORESPURT,
    OPPRETTER_SYKEPENGESOKNADUTLAND,
    OPPRETTER_UTKAST_TIL_KORRIGERING,
    SEND_SOKNAD_FEILET,
    SEND_SOKNAD_FORESPURT,
    SENDER_SOKNAD,
    SOKNAD_AVBRUTT,
    SOKNAD_ENDRET,
    SOKNAD_GJENAPNET,
    SOKNAD_LAGRET,
    SOKNAD_OPPDATERT,
    SOKNAD_SENDT,
    SOKNADER_HENTET,
    SYKEPENGESOKNADUTLAND_OPPRETTET,
    UTKAST_TIL_KORRIGERING_OPPRETTET,
    OPPRETT_SYKEPENGESOKNADUTLAND_FORESPURT,
    OPPDATERER_SOKNAD,
    OPPDATER_SOKNAD_FEILET_OK,
    OPPDATER_SOKNADER_FORESPURT,
} from './soknaderActiontyper';

export const soknaderHentet = (soknader) => {
    return {
        type: SOKNADER_HENTET,
        soknader,
    };
};

export const henterSoknader = () => {
    return {
        type: HENTER_SOKNADER,
    };
};

export const hentSoknaderFeilet = () => {
    return {
        type: HENT_SOKNADER_FEILET,
    };
};

export const hentSoknader = () => {
    return {
        type: HENT_SOKNADER_FORESPURT,
    };
};

export const oppdaterSoknader = () => {
    return {
        type: OPPDATER_SOKNADER_FORESPURT,
    };
};

export const sendSoknad = (soknad) => {
    return {
        type: SEND_SOKNAD_FORESPURT,
        soknad,
    };
};

export const senderSoknad = () => {
    return {
        type: SENDER_SOKNAD,
    };
};

export const sendSoknadFeilet = () => {
    return {
        type: SEND_SOKNAD_FEILET,
    };
};

export const soknadSendt = (soknad) => {
    return {
        type: SOKNAD_SENDT,
        soknad,
    };
};

export const opprettSoknadUtland = () => {
    return {
        type: OPPRETT_SYKEPENGESOKNADUTLAND_FORESPURT,
    };
};

export const opprettSoknadUtlandFeilet = () => {
    return {
        type: OPPRETT_SYKEPENGESOKNADUTLAND_FEILET,
    };
};

export const oppretterSoknadUtland = () => {
    return {
        type: OPPRETTER_SYKEPENGESOKNADUTLAND,
    };
};

export const soknadUtlandOpprettet = (soknad) => {
    return {
        type: SYKEPENGESOKNADUTLAND_OPPRETTET,
        soknad,
    };
};

export function avbrytSoknad(soknad) {
    return {
        type: AVBRYT_SOKNAD_FORESPURT,
        soknad,
    };
}

export function avbryterSoknad() {
    return {
        type: AVBRYTER_SOKNAD,
    };
}

export function soknadAvbrutt(soknad) {
    return {
        type: SOKNAD_AVBRUTT,
        soknad,
    };
}

export function avbrytSoknadFeilet() {
    return {
        type: AVBRYT_SOKNAD_FEILET,
    };
}

export const soknadEndret = (soknad, feltnavn, nyVerdi, svartype) => {
    return {
        type: SOKNAD_ENDRET,
        soknad,
        feltnavn,
        nyVerdi,
        svartype,
    };
};

export const soknadOppdatert = (soknad) => {
    return {
        type: SOKNAD_OPPDATERT,
        soknad,
    };
};

export const oppdatererSoknad = (soknad) => {
    return {
        type: OPPDATERER_SOKNAD,
        soknad,
    };
};

export const oppdaterSoknadFeilet = (soknad) => {
    return {
        type: OPPDATER_SOKNAD_FEILET,
        soknad,
    };
};

export const oppdaterSoknadFeiletOk = () => {
    return {
        type: OPPDATER_SOKNAD_FEILET_OK,
    };
};

export function opprettUtkastTilKorrigeringForespurt(sykepengesoknadsId) {
    return {
        sykepengesoknadsId,
        type: OPPRETT_UTKAST_TIL_KORRIGERING_FORESPURT,
    };
}

export function oppretterKorrigering() {
    return {
        type: OPPRETTER_UTKAST_TIL_KORRIGERING,
    };
}

export function korrigeringOpprettet(utkastTilKorrigering) {
    return {
        utkast: utkastTilKorrigering,
        type: UTKAST_TIL_KORRIGERING_OPPRETTET,
    };
}

export function opprettUtkastTilKorrigeringFeilet() {
    return {
        type: OPPRETT_UTKAST_TIL_KORRIGERING_FEILET,
    };
}

export const gjenapneSoknad = (soknad) => {
    return {
        type: GJENAPNE_SOKNAD_FORESPURT,
        soknad,
    };
};

export const gjenapnerSoknad = (soknad) => {
    return {
        type: GJENAPNER_SOKNAD,
        soknad,
    };
};

export const soknadGjenapnet = (soknad) => {
    return {
        type: SOKNAD_GJENAPNET,
        soknad,
    };
};

export const gjenapneSoknadFeilet = () => {
    return {
        type: GJENAPNE_SOKNAD_FEILET,
    };
};

export const lagreSoknad = (soknad, sidenummer) => {
    return {
        type: LAGRE_SOKNAD_FORESPURT,
        soknad,
        sidenummer,
    };
};

export const soknadLagret = (soknad) => {
    return {
        type: SOKNAD_LAGRET,
        soknad,
    };
};
