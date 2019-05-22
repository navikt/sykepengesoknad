export const skalHenteSykeforloep = (state) => {
    return !state.sykeforloep.hentet
        && !state.sykeforloep.henter
        && !state.sykeforloep.hentingFeilet;
};
