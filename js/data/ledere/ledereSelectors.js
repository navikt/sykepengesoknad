export const selectLedereSlice = (state) => {
    return state.ledere;
};

export const selectLedereData = (state) => {
    return selectLedereSlice(state).data;
};
