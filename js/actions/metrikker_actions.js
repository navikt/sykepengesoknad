import { EVENT_REGISTRERT } from './actiontyper';
import { UTFYLLING_STARTET } from '../enums/metrikkerEnums';

const eventRegistrert = (eventtype, ressursId) => {
    return {
        type: EVENT_REGISTRERT,
        tid: new Date(),
        ressursId,
        eventtype,
    };
};

export const utfyllingStartet = (ressursId) => {
    return eventRegistrert(UTFYLLING_STARTET, ressursId);
};
