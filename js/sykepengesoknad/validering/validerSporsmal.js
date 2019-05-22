import { getLedetekst } from '@navikt/digisyfo-npm';
import { fjernIndexFraTag, formaterEnkeltverdi, formaterFlereVerdier } from '../felleskomponenter/sporsmal/fieldUtils';
import { CHECKED } from '../enums/svarEnums';
import { CHECKBOX_GRUPPE, FRITEKST, IKKE_RELEVANT, PERIODER, TALL } from '../enums/svartyper';
import { validerPerioder } from '../../sykepengesoknad-gammel-plattform/utils/valideringUtils';
import validerTall from './validerTall';
import {
    LAND,
} from '../enums/tagtyper';

const hentSporsmalMedStilteUndersporsmal = (sporsmalsliste, values) => {
    return sporsmalsliste
        .filter((sporsmal) => {
            return values[sporsmal.tag] !== undefined;
        })
        .filter((sporsmal) => {
            const verdi = formaterEnkeltverdi(values[sporsmal.tag]);
            const formatertVerdi = verdi === true ? CHECKED : verdi;
            return (sporsmal.svar && formatertVerdi === sporsmal.kriterieForVisningAvUndersporsmal);
        });
};

export const beregnFeilmeldingnokkelFraTag = (tag, max) => {
    const tagUtenIndex = fjernIndexFraTag(tag);
    return `soknad.feilmelding.${tagUtenIndex.toLowerCase()}${max ? '.max' : ''}`;
};

export const beregnFeilmeldingstekstFraTag = (tag, max) => {
    const nokkel = beregnFeilmeldingnokkelFraTag(tag, max);
    return getLedetekst(nokkel, {
        '%MAX%': max,
    });
};

const verdiErTom = (verdi) => {
    return (verdi || verdi === '')
        && verdi.trim
        && verdi.trim() === '';
};

const validerUndersporsmalsliste = (sporsmalsliste = [], values = {}, feilmeldingerParam = {}) => {
    let feilmeldinger = { ...feilmeldingerParam };
    const sporsmalMedStilteUndersporsmal = hentSporsmalMedStilteUndersporsmal(sporsmalsliste, values);

    sporsmalMedStilteUndersporsmal
        .forEach((sporsmalMedUndersporsmal) => {
            const undersporsmalsliste = sporsmalMedUndersporsmal.undersporsmal;
            undersporsmalsliste.forEach((undersporsmal) => {
                switch (undersporsmal.svartype) {
                    case CHECKBOX_GRUPPE: {
                        const avkryssedeCheckboxer = undersporsmal.undersporsmal
                            .map((checkboxSporsmal) => {
                                const verdi = values[checkboxSporsmal.tag];
                                return formaterEnkeltverdi(verdi);
                            })
                            .filter((verdi) => {
                                return verdi === true;
                            });

                        if (avkryssedeCheckboxer.length === 0) {
                            feilmeldinger[undersporsmal.tag] = {
                                _error: beregnFeilmeldingstekstFraTag(undersporsmal.tag),
                            };
                        } else {
                            feilmeldinger = validerUndersporsmalsliste(undersporsmal.undersporsmal, values, feilmeldinger);
                        }
                        break;
                    }
                    case PERIODER: {
                        const periodeFeilmeldinger = validerPerioder(values[undersporsmal.tag]);
                        if (periodeFeilmeldinger) {
                            feilmeldinger[undersporsmal.tag] = periodeFeilmeldinger;
                        }
                        break;
                    }
                    case TALL: {
                        const feilmelding = validerTall(
                            undersporsmal.min,
                            undersporsmal.max,
                            undersporsmal.tag,
                            values[undersporsmal.tag],
                            undersporsmal.undertekst);
                        if (feilmelding) {
                            feilmeldinger[undersporsmal.tag] = feilmelding;
                        }
                        feilmeldinger = validerUndersporsmalsliste(undersporsmal.undersporsmal, values, feilmeldinger);
                        break;
                    }
                    default: {
                        const verdi = formaterEnkeltverdi(values[undersporsmal.tag]);
                        if (verdiErTom(verdi)) {
                            feilmeldinger[undersporsmal.tag] = beregnFeilmeldingstekstFraTag(undersporsmal.tag);
                        }
                        feilmeldinger = validerUndersporsmalsliste(undersporsmal.undersporsmal, values, feilmeldinger);
                        break;
                    }
                }
            });
        });

    return feilmeldinger;
};

const arrayErTomt = (array) => {
    return array.filter((streng) => {
        return verdiErTom(streng);
    }).length === array.length;
};

export default function validerSporsmal(sporsmal = [], values = {}) {
    const feilmeldinger = {};
    sporsmal
        .filter((s) => {
            const verdi = s.svartype === LAND
                ? formaterFlereVerdier(values[s.tag])
                : formaterEnkeltverdi(values[s.tag]);
            return ((values[s.tag] === undefined
                    || verdi === false
                    || (s.svartype === LAND && arrayErTomt(verdi))
                    || (s.svartype === FRITEKST && verdiErTom(verdi))
                    || (s.svartype === FRITEKST && s.max && verdi.length > s.max)
                    || (s.svartype === PERIODER))
                        && s.svartype !== IKKE_RELEVANT
            );
        })
        .forEach((s) => {
            switch (s.svartype) {
                case PERIODER: {
                    const periodeFeilmeldinger = validerPerioder(values[s.tag]);
                    if (periodeFeilmeldinger) {
                        feilmeldinger[s.tag] = periodeFeilmeldinger;
                    }
                    break;
                }
                case FRITEKST: {
                    const verdi = formaterEnkeltverdi(values[s.tag]);
                    feilmeldinger[s.tag] = s.max && verdi.length > s.max
                        ? beregnFeilmeldingstekstFraTag(s.tag, s.max)
                        : beregnFeilmeldingstekstFraTag(s.tag);
                    break;
                }
                default: {
                    feilmeldinger[s.tag] = beregnFeilmeldingstekstFraTag(s.tag);
                    break;
                }
            }
        });
    return validerUndersporsmalsliste(sporsmal, values, feilmeldinger);
}
