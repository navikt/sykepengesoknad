import * as actiontyper from '../actiontyper';
import { createReducer } from '../createReducer';

const defaultState = {
    data: {},
    henter: false,
    hentingFeilet: false,
    hentet: false,
};

const vedlikehold = createReducer(
    actiontyper.HENT_VEDLIKEHOLD_FEILET,
    actiontyper.HENTER_VEDLIKEHOLD,
    actiontyper.VEDLIKEHOLD_HENTET,
    defaultState);

export default vedlikehold;
