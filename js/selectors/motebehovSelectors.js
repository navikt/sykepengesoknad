export const skalHenteMotebehov = (state) => {
    const reducer = state.motebehov;
    return !(reducer.henter || reducer.hentet || reducer.hentingFeilet || reducer.hentingForbudt);
};
