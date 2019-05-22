import * as actiontyper from '../actions/actiontyper';
import { createReducer } from './createReducer';

const initiellState = {
    data: {},
    henter: false,
    hentingFeilet: false,
    hentet: false,
};

const unleashToggles = createReducer(
    actiontyper.HENT_UNLEASH_TOGGLES_FEILET,
    actiontyper.HENTER_UNLEASH_TOGGLES,
    actiontyper.HENTET_UNLEASH_TOGGLES,
    initiellState);

export default unleashToggles;
