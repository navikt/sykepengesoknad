import { EVENT_REGISTRERT, SYKEPENGESOKNAD_SENDT, SYKMELDING_BEKREFTET, SYKMELDING_SENDT } from '../actiontyper';
import { SOKNAD_SENDT } from '../../sykepengesoknad/data/soknader/soknaderActiontyper';

const initiellState = {
    data: [],
};

const metrikker = (state = initiellState, action = {}) => {
    switch (action.type) {
        case EVENT_REGISTRERT: {
            return {
                data: [
                    ...state.data,
                    {
                        tid: new Date(),
                        ressursId: action.ressursId,
                        type: action.eventtype,
                    },
                ],
            };
        }
        case SYKMELDING_BEKREFTET:
        case SYKMELDING_SENDT: {
            return {
                data: [
                    ...state.data,
                    {
                        ressursId: action.sykmeldingId,
                        tid: new Date(),
                        type: SYKMELDING_SENDT,
                    },
                ],
            };
        }
        case SYKEPENGESOKNAD_SENDT: {
            return {
                data: [
                    ...state.data,
                    {
                        ressursId: action.sykepengesoknad.id,
                        tid: new Date(),
                        type: SYKEPENGESOKNAD_SENDT,
                    },
                ],
            };
        }
        case SOKNAD_SENDT: {
            return {
                data: [
                    ...state.data,
                    {
                        ressursId: action.soknad.id,
                        tid: new Date(),
                        type: SOKNAD_SENDT,
                    },
                ],
            };
        }
        default: {
            return state;
        }
    }
};

export default metrikker;
