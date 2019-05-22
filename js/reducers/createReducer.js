const initiellState = {
    henter: false,
    hentingFeilet: false,
    hentet: false,
    data: {},
};

export const createReducer = (
    feilActionType,
    henterActionType,
    hentetActionType,
    initState = initiellState,
    mapper = null,
    spesialHandler) => {
    return (state = initState, action = {}) => {
        switch (action.type) {
            case feilActionType: {
                return {
                    ...state,
                    henter: false,
                    hentingFeilet: true,
                    hentet: true,
                };
            }
            case henterActionType: {
                return {
                    ...state,
                    henter: true,
                    hentingFeilet: false,
                    hentet: false,
                };
            }
            case hentetActionType: {
                return {
                    data: mapper ? action.data.map(mapper) : action.data,
                    henter: false,
                    hentingFeilet: false,
                    hentet: true,
                };
            }
            default: {
                return spesialHandler
                    ? spesialHandler(state, action)
                    : state;
            }
        }
    };
};
