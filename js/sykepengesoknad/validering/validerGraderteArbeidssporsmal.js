import { fraInputdatoTilJSDato, getLedetekst } from '@navikt/digisyfo-npm';
import { fjernIndexFraTag, formaterEnkeltverdi } from '../felleskomponenter/sporsmal/fieldUtils';
import {
    FERIE_NAR_V2,
    FERIE_PERMISJON_UTLAND,
    FERIE_V2,
    HVOR_MANGE_TIMER_PER_UKE,
    HVOR_MYE_HAR_DU_JOBBET,
    HVOR_MYE_PROSENT,
    HVOR_MYE_PROSENT_VERDI,
    HVOR_MYE_TIMER,
    HVOR_MYE_TIMER_VERDI,
    JOBBET_DU_GRADERT,
    PERMISJON_NAR_V2,
    PERMISJON_V2,
} from '../enums/tagtyper';
import { getStillingsprosent } from '../../sykepengesoknad-gammel-plattform/aktiviteter-i-sykmeldingsperioden/BeregnetArbeidsgrad';
import { JA } from '../enums/svarEnums';

const leggIndexPaTag = (tag, index) => {
    return `${tag}_${index}`;
};

export const hentFerieOgPermisjonperioder = (skjemaverdier) => {
    const harHattFerie = formaterEnkeltverdi(skjemaverdier[FERIE_V2]) === JA;
    const harHattPermisjon = formaterEnkeltverdi(skjemaverdier[PERMISJON_V2]) === JA;
    const ferieperioder = harHattFerie ? skjemaverdier[FERIE_NAR_V2] : [];
    const permisjonperioder = harHattPermisjon ? skjemaverdier[PERMISJON_NAR_V2] : [];

    return [
        ...ferieperioder,
        ...permisjonperioder,
    ].map((periode) => {
        return {
            fom: fraInputdatoTilJSDato(periode.fom),
            tom: fraInputdatoTilJSDato(periode.tom),
        };
    });
};

const validerGraderteArbeidssporsmal = (sporsmalsliste, skjemaverdier, soknad) => {
    const feilmeldinger = {};
    const graderteArbeidssporsmal = sporsmalsliste
        .filter((sporsmal) => {
            return fjernIndexFraTag(sporsmal.tag) === JOBBET_DU_GRADERT;
        })
        .filter((sporsmal) => {
            return formaterEnkeltverdi(skjemaverdier[sporsmal.tag]) === sporsmal.kriterieForVisningAvUndersporsmal;
        })
        .filter((sporsmal) => {
            const feriesporsmal = soknad.sporsmal.find((spm) => {
                return spm.tag === FERIE_V2;
            });
            const feriePermUtlandsporsmal = soknad.sporsmal.find((spm) => {
                return spm.tag === FERIE_PERMISJON_UTLAND;
            });
            const hovedsporsmalTags = soknad.sporsmal.map((s) => {
                return s.tag;
            });
            const harSvartPaFeriesporsmal = feriesporsmal
                ? hovedsporsmalTags.indexOf(sporsmal.tag) > hovedsporsmalTags.indexOf(FERIE_V2)
                : !feriePermUtlandsporsmal;
            return harSvartPaFeriesporsmal;
        });
    graderteArbeidssporsmal.forEach((gradertArbeidssporsmal) => {
        const index = parseInt(gradertArbeidssporsmal.tag.split(`${JOBBET_DU_GRADERT}_`)[1], 10);
        const erSvarOppgittITimer = formaterEnkeltverdi(skjemaverdier[leggIndexPaTag(HVOR_MYE_TIMER, index)]);
        if (erSvarOppgittITimer) {
            const antallTimerPerNormalUke = formaterEnkeltverdi(skjemaverdier[leggIndexPaTag(HVOR_MANGE_TIMER_PER_UKE, index)]);
            const antallTimerJobbet = formaterEnkeltverdi(skjemaverdier[leggIndexPaTag(HVOR_MYE_TIMER_VERDI, index)]);
            const periode = soknad.soknadPerioder[index];
            const minsteArbeidsgrad = gradertArbeidssporsmal.undersporsmal
                .find((underspm) => {
                    return fjernIndexFraTag(underspm.tag) === HVOR_MYE_HAR_DU_JOBBET;
                })
                .undersporsmal.find((underspm) => {
                    return fjernIndexFraTag(underspm.tag) === HVOR_MYE_PROSENT;
                })
                .undersporsmal.find((underspm) => {
                    return fjernIndexFraTag(underspm.tag) === HVOR_MYE_PROSENT_VERDI;
                }).min;
            const arbeidsgrad = getStillingsprosent(antallTimerJobbet, antallTimerPerNormalUke, periode, hentFerieOgPermisjonperioder(skjemaverdier));
            if (arbeidsgrad < parseInt(minsteArbeidsgrad, 10)) {
                feilmeldinger[leggIndexPaTag(HVOR_MYE_TIMER_VERDI, index)] = getLedetekst(`soknad.feilmelding.${HVOR_MYE_TIMER_VERDI.toLowerCase()}.min`, {
                    '%MIN%': minsteArbeidsgrad - 1,
                });
            }
        }
    });

    return feilmeldinger;
};

export default validerGraderteArbeidssporsmal;
