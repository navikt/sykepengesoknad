const selectLedeteksterSlice = (state) => {
    return state.ledetekster;
};

export const selectLedeteksterData = (state) => {
    return selectLedeteksterSlice(state).data;
};

export const selectLedeteksterHenter = (state) => {
    return selectLedeteksterSlice(state).henter;
};

export const selectLedeteksterHentingFeilet = (state) => {
    return selectLedeteksterSlice(state).hentingFeilet;
};
