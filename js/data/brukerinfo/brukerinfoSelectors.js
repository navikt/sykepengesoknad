export const harStrengtFortroligAdresseSelector = (state) => {
    return state.brukerinfo.bruker.data.strengtFortroligAdresse;
};

export const skalHenteBrukerinfoSelector = (state) => {
    return !state.brukerinfo.bruker.henter
        && !state.brukerinfo.bruker.hentet;
};

export const skalHenteOppfolgingSelector = (state) => {
    return !state.brukerinfo.oppfolging.henter
        && !state.brukerinfo.oppfolging.hentet;
};

export const skalHenteSykmeldtinfodata = (state) => {
    return !state.brukerinfo.sykmeldtinfodata.henter
        && !state.brukerinfo.sykmeldtinfodata.hentet;
};
