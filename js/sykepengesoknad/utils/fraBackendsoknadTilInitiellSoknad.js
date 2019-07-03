import { toDatePrettyPrint } from '@navikt/digisyfo-npm';
import {
    CHECKBOX, CHECKBOX_PANEL, DATO, FRITEKST, JA_NEI, PERIODER, PROSENT, TIMER,
    TALL, RADIO_GRUPPE, RADIO_GRUPPE_TIMER_PROSENT, RADIO, LAND,
} from '../enums/svartyper';
import { genererParseForEnkeltverdi } from '../felleskomponenter/sporsmal/fieldUtils';
import { CHECKED } from '../enums/svarEnums';

const tilPeriodedato = (datoEllerStreng) => {
    return datoEllerStreng.split('.').length === 3
        ? datoEllerStreng
        : toDatePrettyPrint(datoEllerStreng);
};

const tilInitielleSvarverder = ({ svar, svartype, undersporsmal }) => {
    const parse = genererParseForEnkeltverdi();

    let svarverdier;
    switch (svartype) {
        case DATO:
            svarverdier = parse(toDatePrettyPrint(new Date(svar[0].verdi)));
            break;

        case PERIODER:
            svarverdier = svar.length === 0
                ? [{}]
                : svar.map((s) => {
                    const periode = JSON.parse(s.verdi);
                    const periodeSvar = {};
                    if (periode.fom) {
                        periodeSvar.fom = tilPeriodedato(periode.fom);
                    }
                    if (periode.tom) {
                        periodeSvar.tom = tilPeriodedato(periode.tom);
                    }
                    return periodeSvar;
                });
            break;

        case LAND:
            svarverdier = svar;
            break;

        case CHECKBOX:
            svarverdier = parse(svar.map((_svar) => {
                return (_svar.verdi ? 'CHECKED' : 'UNCHECKED');
            })[0]);
            break;

        case JA_NEI:
        case CHECKBOX_PANEL:
        case TIMER:
        case PROSENT:
        case FRITEKST:
        case TALL:
        case RADIO:
            svarverdier = parse(svar[0].verdi);
            break;

        case RADIO_GRUPPE:
        case RADIO_GRUPPE_TIMER_PROSENT:
            const aktivtUndersporsmal = undersporsmal.find((uspm) => {
                return uspm.svar[0] && uspm.svar[0].verdi === CHECKED;
            });
            svarverdier = aktivtUndersporsmal
                ? parse(aktivtUndersporsmal.sporsmalstekst)
                : null;
            break;

        default:
            svarverdier = null;
            break;
    }

    if (svarverdier) {
        svarverdier.forEach((s, idx) => {
            s.avgittAv = svar[idx].avgittAv;
        });
    }

    return svarverdier;
};

const fraBackendsoknadTilInitiellSoknad = (soknad) => {
    const flatten = (sporsmal, accumulator = []) => {
        accumulator.push(sporsmal);
        sporsmal.undersporsmal.forEach((undersporsmal) => {
            return flatten(undersporsmal, accumulator);
        });
        return accumulator;
    };

    const alleSporsmal = soknad.sporsmal
        .map((sporsmal) => {
            return flatten(sporsmal);
        })
        .flatten()
        .filter((spm) => {
            return spm.svar.length > 0
                || spm.svartype === RADIO_GRUPPE
                || spm.svartype === RADIO_GRUPPE_TIMER_PROSENT
                || spm.svartype === PERIODER;
        });

    return alleSporsmal
        .reduce((acc, sporsmal) => {
            acc[sporsmal.tag] = tilInitielleSvarverder(sporsmal);
            return acc;
        }, {});
};

export default fraBackendsoknadTilInitiellSoknad;
