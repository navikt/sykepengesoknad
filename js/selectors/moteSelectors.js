export const skalHenteMote = (state) => {
    const reducer = state.mote;
    return !(reducer.henter || reducer.hentet || reducer.hentingFeilet);
};
