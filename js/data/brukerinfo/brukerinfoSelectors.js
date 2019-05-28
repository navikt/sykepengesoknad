export const skalHenteBrukerinfoSelector = (state) => {
    return !state.brukerinfo.bruker.henter
        && !state.brukerinfo.bruker.hentet;
};

