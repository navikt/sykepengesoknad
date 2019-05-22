import {
    HENT_SOKNAD_MOTTAKER_FEILET,
    HENTER_SOKNAD_MOTTAKER,
    SOKNAD_MOTTAKER_HENTET,
} from './soknadMetaActiontyper';

const soknadMeta = (state = {}, action = {}) => {
    switch (action.type) {
        case HENTER_SOKNAD_MOTTAKER: {
            return {
                ...state,
                [action.soknadId]: {
                    henter: true,
                    hentingFeilet: false,
                    hentet: false,
                    data: {},
                },
            };
        }
        case SOKNAD_MOTTAKER_HENTET: {
            return {
                ...state,
                [action.soknadId]: {
                    ...state[action.soknadId],
                    data: {
                        ...state[action.soknadId].data,
                        ...action.data,
                    },
                    hentet: true,
                    henter: false,
                    hentingFeilet: false,
                },
            };
        }
        case HENT_SOKNAD_MOTTAKER_FEILET: {
            return {
                ...state,
                [action.soknadId]: {
                    ...state[action.soknadId],
                    hentet: true,
                    hentingFeilet: true,
                    henter: false,
                },
            };
        }
        default: {
            return state;
        }
    }
};

export default soknadMeta;
