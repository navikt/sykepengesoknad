export const soknadMottakerSelector = (state, soknadId) => {
    const soknadMeta = state.soknadMeta[soknadId];
    return soknadMeta && soknadMeta.data
        ? soknadMeta.data.mottaker
        : null;
};
