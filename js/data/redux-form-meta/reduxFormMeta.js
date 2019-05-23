import * as actiontyper from '../actiontyper';
import { SEND_SKJEMA_FEILET, SEND_SKJEMA_FEILET_HANDTERT } from '../../enums/reduxFormMetaEnums';

const defaultState = {};

const reduxFormMeta = (state = defaultState, action = {}) => {
    switch (action.type) {
        case actiontyper.SEND_SKJEMA_FEILET: {
            return {
                ...state,
                [action.skjemanavn]: {
                    status: SEND_SKJEMA_FEILET,
                    settFokus: true,
                },
            };
        }
        case actiontyper.SEND_SKJEMA_FEILET_HANDTERT: {
            return {
                ...state,
                [action.skjemanavn]: {
                    status: SEND_SKJEMA_FEILET,
                    settFokus: false,
                },
            };
        }
        case actiontyper.SKJEMA_ER_GYLDIG: {
            return {
                ...state,
                [action.skjemanavn]: {
                    status: SEND_SKJEMA_FEILET_HANDTERT,
                    settFokus: false,
                },
            };
        }
        default: {
            return state;
        }
    }
};

export default reduxFormMeta;
