import { getLedetekst } from '@navikt/digisyfo-npm';
import { fjernIndexFraTag, formaterEnkeltverdi } from '../felleskomponenter/sporsmal/fieldUtils';
import { beregnFeilmeldingstekstFraTag } from './validerSporsmal';
import { HVOR_MYE_PROSENT_VERDI } from '../enums/tagtyper';

const validerTall = (min, max, tag, verdi, undertekst) => {
    const tagUtenIndex = fjernIndexFraTag(tag);
    const blankfeilmelding = beregnFeilmeldingstekstFraTag(tagUtenIndex);
    const formatertVerdi = formaterEnkeltverdi(verdi);
    const parsetVerdi = parseInt(formatertVerdi, 10);
    if (parsetVerdi > max || parsetVerdi < min) {
        if (tagUtenIndex === HVOR_MYE_PROSENT_VERDI && parsetVerdi < min) {
            if (min > 1) {
                return getLedetekst('soknad.feilmelding.tall-prosent-min-max', {
                    '%MIN%': min,
                    '%MAX%': max,
                    '%ANDEL%': min - 1,
                });
            }
            return getLedetekst('soknad.feilmelding.tall-prosent-100', {
                '%MIN%': min,
                '%MAX%': max,
                '%ANDEL%': min - 1,
            });
        }
        return getLedetekst('soknad.feilmelding.tall-min-max', {
            '%MIN%': min,
            '%MAX%': max,
        });
    }
    if (!parsetVerdi || isNaN(parsetVerdi)) {
        return blankfeilmelding;
    }
    if (undertekst === 'prosent' && formatertVerdi.indexOf(',') > -1) {
        return 'Prosenten må oppgis som et helt tall uten komma';
    }
    return undefined;
};

export default validerTall;
