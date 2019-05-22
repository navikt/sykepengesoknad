import { getFormValues } from 'redux-form';

export const hentSkjemaVerdier = (state, skjemanavn) => {
    return getFormValues(skjemanavn)(state) || {};
};
