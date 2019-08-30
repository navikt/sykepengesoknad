/* eslint arrow-body-style: ["error", "as-needed"] */
export const ETTERSEND_SOKNAD_SENDER = 'ETTERSEND_SOKNAD_SENDER';
export const ETTERSEND_SOKNAD_SENDT = 'ETTERSEND_SOKNAD_SENDT';
export const ETTERSEND_SOKNAD_FEILET = 'ETTERSEND_SOKNAD_FEILET';
export const ALLEREDE_ETTERSENDT = 'ALLEREDE_ETTERSENDT';

export const selectEttersenderSoknad = state => state.ettersendingNav.sender || state.ettersendingArbeidsgiver.sender;

export const selectEttersendtSoknad = state => state.ettersendingNav.sendt || state.ettersendingArbeidsgiver.sendt;

export const selectEttersendSoknadFeilet = state => state.ettersendingNav.sendingFeilet || state.ettersendingArbeidsgiver.sendingFeilet;

export const selectAlleredeEttersendt = state => state.ettersendingNav.alleredeEttersendt || state.ettersendingArbeidsgiver.alleredeEttersendt;

export const selectEttersendSoknadStatus = (state) => {
    if (selectEttersenderSoknad(state)) {
        return ETTERSEND_SOKNAD_SENDER;
    } else if (selectEttersendtSoknad(state)) {
        return ETTERSEND_SOKNAD_SENDT;
    } else if (selectEttersendSoknadFeilet(state)) {
        return ETTERSEND_SOKNAD_FEILET;
    } else if (selectAlleredeEttersendt(state)) {
        return ALLEREDE_ETTERSENDT;
    }
    return null;
};
