import { SELVSTENDIGE_OG_FRILANSERE, ARBEIDSTAKERE } from '../../enums/soknadtyper';
import { SENDT } from '../../enums/soknadstatuser';

export const erForsteSoknad = (state) => {
    const sendteSoknader = state.soknader.data.filter((soknad) => {
        return (soknad.soknadstype === ARBEIDSTAKERE || soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE)
            && soknad.status === SENDT;
    });
    const sendteSykepengesoknader = state.sykepengesoknader.data.filter((soknad) => {
        return soknad.status === SENDT;
    });
    return sendteSoknader.length === 0 && sendteSykepengesoknader.length === 0;
};

export const skalHenteSoknader = (state) => {
    return !state.soknader.hentet
        && !state.soknader.henter
        && !state.soknader.hentingFeilet;
};

export const skalHenteSoknaderHvisIkkeHenter = (state) => {
    return !state.soknader.henter;
};

export const sykmeldingHarBehandletSoknad = (state, sykmeldingId) => {
    return state.soknader.data.filter((soknad) => {
        return soknad.sykmeldingId === sykmeldingId && soknad.status === SENDT;
    }).length > 0;
};

export const hentSoknad = (state, soknad) => {
    return state.soknader.data.find((s) => {
        return s.id === soknad.id;
    });
};
