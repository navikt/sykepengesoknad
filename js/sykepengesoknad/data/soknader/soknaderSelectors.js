/* eslint arrow-body-style: ["error", "as-needed"] */
import { ARBEIDSTAKERE, SELVSTENDIGE_OG_FRILANSERE } from '../../enums/soknadtyper';
import { SENDT } from '../../enums/soknadstatuser';
import { selectSykepengesoknaderData } from '../../../sykepengesoknad-gammel-plattform/data/sykepengesoknader/sykepengesoknaderSelectors';

const selectSlice = state => state.soknader;

export const selectSoknaderData = state => selectSlice(state).data;

export const erForsteSoknad = (state) => {
    const sendteSoknader = selectSoknaderData(state)
        .filter(soknad => [ARBEIDSTAKERE, SELVSTENDIGE_OG_FRILANSERE].includes(soknad.soknadstype)
            && soknad.status === SENDT);
    const sendteSykepengesoknader = selectSykepengesoknaderData(state).filter(soknad => soknad.status === SENDT);
    return sendteSoknader.length === 0 && sendteSykepengesoknader.length === 0;
};

export const skalHenteSoknader = state => !selectSlice(state).hentet
    && !selectSlice(state).henter
    && !selectSlice(state).hentingFeilet;

export const skalHenteSoknaderHvisIkkeHenter = state => !selectSlice(state).henter;

export const sykmeldingHarBehandletSoknad = (state, sykmeldingId) => selectSoknaderData(state)
    .filter(soknad => soknad.sykmeldingId === sykmeldingId && soknad.status === SENDT).length > 0;

export const hentSoknad = (state, soknad) => selectSoknaderData(state).find(s => s.id === soknad.id);
