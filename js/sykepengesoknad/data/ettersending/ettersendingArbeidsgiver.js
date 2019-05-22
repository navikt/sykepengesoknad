/* eslint arrow-body-style: ["error", "as-needed"] */
export const ETTERSEND_SOKNAD_ARBG_FORESPURT = 'ETTERSEND_SOKNAD_ARBG_FORESPURT';
export const ETTERSENDER_SOKNAD_ARBG = 'ETTERSENDER_SOKNAD_ARBG';
export const ETTERSEND_SOKNAD_ARBG_FEILET = 'ETTERSEND_SOKNAD_ARBG_FEILET';
export const SOKNAD_ETTERSENDT_ARBG = 'SOKNAD_ETTERSENDT_ARBG';
export const ETTERSEND_SOKNAD_ARBG_NULLSTILT = 'ETTERSEND_SOKNAD_ARBG_NULLSTILT';

const initiellState = {
    sender: false,
    sendt: false,
    sendingFeilet: false,
};

export const ettersendSoknadTilArbeidsgiver = soknadId => ({
    type: ETTERSEND_SOKNAD_ARBG_FORESPURT,
    soknadId,
});

export const ettersenderSoknadTilArbeidsgiver = () => ({
    type: ETTERSENDER_SOKNAD_ARBG,
});

export const ettersendSoknadTilArbeidsgiverFeilet = () => ({
    type: ETTERSEND_SOKNAD_ARBG_FEILET,
});

export const soknadEttersendtTilArbeidsgiver = () => ({
    type: SOKNAD_ETTERSENDT_ARBG,
});

export const ettersendSoknadTilArbeidsgiverNullstill = () => ({
    type: ETTERSEND_SOKNAD_ARBG_NULLSTILT,
});

export default (state = initiellState, action = {}) => {
    switch (action.type) {
        case ETTERSENDER_SOKNAD_ARBG: {
            return {
                ...state,
                sender: true,
                sendingFeilet: false,
                sendt: false,
            };
        }
        case SOKNAD_ETTERSENDT_ARBG: {
            return {
                ...state,
                sender: false,
                sendingFeilet: false,
                sendt: true,
            };
        }
        case ETTERSEND_SOKNAD_ARBG_FEILET: {
            return {
                ...state,
                sender: false,
                sendingFeilet: true,
                sendt: false,
            };
        }
        case ETTERSEND_SOKNAD_ARBG_NULLSTILT: {
            return initiellState;
        }
        default: {
            return state;
        }
    }
};
