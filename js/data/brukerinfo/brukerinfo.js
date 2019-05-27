import { combineReducers } from 'redux';
import * as actiontyper from '../actiontyper';
import { createReducer } from '../createReducer';

const {
    BRUKERINFO_HENTET,
    HENT_BRUKERINFO_FEILET,
    HENTER_BRUKERINFO,
} = actiontyper;

function innlogging(
    state = {
        erInnlogget: true,
        henter: false,
        hentingFeilet: false,
    },
    action = {}) {
    switch (action.type) {
        case actiontyper.BRUKER_ER_UTLOGGET: {
            return {
                erInnlogget: false,
                henter: false,
                hentingFeilet: false,
            };
        }
        case actiontyper.BRUKER_ER_INNLOGGET: {
            return {
                ...state,
                erInnlogget: true,
                henter: false,
                hentingFeilet: false,
            };
        }
        case actiontyper.SJEKKER_INNLOGGING: {
            return {
                ...state,
                henter: true,
                hentingFeilet: false,
            };
        }
        case actiontyper.SJEKK_INNLOGGING_FEILET: {
            return {
                erInnlogget: false,
                hentingFeilet: true,
                henter: false,
            };
        }
        default: {
            return state;
        }
    }
}

const bruker = createReducer(HENT_BRUKERINFO_FEILET, HENTER_BRUKERINFO, BRUKERINFO_HENTET);

const brukerinfo = combineReducers({
    bruker,
    innlogging,
});

export default brukerinfo;

