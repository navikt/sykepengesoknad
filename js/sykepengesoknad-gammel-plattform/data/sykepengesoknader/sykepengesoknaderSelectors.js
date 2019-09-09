/* eslint arrow-body-style: ["error", "as-needed"] */
import { sykepengesoknadstatuser } from '@navikt/digisyfo-npm';

const { NY, FREMTIDIG } = sykepengesoknadstatuser;

const selectSlice = state => state.sykepengesoknader;

export const selectSykepengesoknaderData = state => selectSlice(state).data;

const selectHenter = state => selectSlice(state).henter;
const selectHentet = state => selectSlice(state).hentet;
const selectHentingFeilet = state => selectSlice(state).hentingFeilet;

export const erForsteSykepengesoknad = state => selectSykepengesoknaderData(state)
    .map(soknad => soknad.status)
    .filter(status => [NY, FREMTIDIG].includes(status))
    .length === selectSykepengesoknaderData(state).length;

export const skalHenteSykepengesoknader = state => !selectHenter(state)
    && !selectHentet(state)
    && !selectHentingFeilet(state);
