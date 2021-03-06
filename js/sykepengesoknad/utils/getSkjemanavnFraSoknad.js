import { OPPHOLD_UTLAND, SELVSTENDIGE_OG_FRILANSERE, ARBEIDSTAKERE, ARBEIDSLEDIG, BEHANDLINGSDAGER, ANNET_ARBEIDSFORHOLD } from '../enums/soknadtyper';
import { getSoknadSkjemanavn, OPPHOLD_UTLAND_SKJEMA } from '../../enums/skjemanavn';

export const getSkjemanavnFraSoknad = (soknad) => {
    switch (soknad.soknadstype) {
        case OPPHOLD_UTLAND: {
            return OPPHOLD_UTLAND_SKJEMA;
        }
        case ARBEIDSTAKERE:
        case ARBEIDSLEDIG:
        case BEHANDLINGSDAGER:
        case ANNET_ARBEIDSFORHOLD:
        case SELVSTENDIGE_OG_FRILANSERE: {
            return getSoknadSkjemanavn(soknad.id);
        }
        default: {
            return null;
        }
    }
};
