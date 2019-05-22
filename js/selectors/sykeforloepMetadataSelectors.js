export const erTiltakSykmeldteInngangAktivSelector = (state) => {
    return state.sykeforloepMetadata.data.erTiltakSykmeldteInngangAktiv;
};

export const skalHenteSykeforloepMetadata = (state) => {
    return !state.sykeforloepMetadata.henter
        && !state.sykeforloepMetadata.hentet
        && !state.sykeforloepMetadata.hentingFeilet;
};
