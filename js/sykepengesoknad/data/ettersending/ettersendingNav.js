/* eslint arrow-body-style: ["error", "as-needed"] */
export const ETTERSEND_SOKNAD_NAV_FORESPURT = 'ETTERSEND_SOKNAD_NAV_FORESPURT';
export const ETTERSENDER_SOKNAD_NAV = 'ETTERSENDER_SOKNAD_NAV';
export const ETTERSEND_SOKNAD_NAV_FEILET = 'ETTERSEND_SOKNAD_NAV_FEILET';
export const SOKNAD_ETTERSENDT_NAV = 'SOKNAD_ETTERSENDT_NAV';
export const ETTERSEND_SOKNAD_NAV_NULLSTILT = 'ETTERSEND_SOKNAD_NAV_NULLSTILT';

const initiellState = {
    sender: false,
    sendt: false,
    sendingFeilet: false,
};

export const ettersendSoknadTilNav = soknadId => ({
    type: ETTERSEND_SOKNAD_NAV_FORESPURT,
    soknadId,
});

export const ettersenderSoknadTilNav = () => ({
    type: ETTERSENDER_SOKNAD_NAV,
});

export const ettersendSoknadTilNavFeilet = () => ({
    type: ETTERSEND_SOKNAD_NAV_FEILET,
});

export const soknadEttersendtTilNav = () => ({
    type: SOKNAD_ETTERSENDT_NAV,
});

export const ettersendSoknadTilNavNullstill = () => ({
    type: ETTERSEND_SOKNAD_NAV_NULLSTILT,
});

export default (state = initiellState, action = {}) => {
    switch (action.type) {
        case ETTERSENDER_SOKNAD_NAV: {
            return {
                ...state,
                sender: true,
                sendingFeilet: false,
                sendt: false,
            };
        }
        case SOKNAD_ETTERSENDT_NAV: {
            return {
                ...state,
                sender: false,
                sendingFeilet: false,
                sendt: true,
            };
        }
        case ETTERSEND_SOKNAD_NAV_FEILET: {
            return {
                ...state,
                sender: false,
                sendingFeilet: true,
                sendt: false,
            };
        }
        case ETTERSEND_SOKNAD_NAV_NULLSTILT: {
            return initiellState;
        }
        default: {
            return state;
        }
    }
};
