import { toDatePrettyPrint, inntektskildetyper as inntektskildetyper_ } from '@navikt/digisyfo-npm';
import { mapAktiviteter } from '../utils/sykepengesoknadUtils';
import { visSoktOmSykepengerUtenlandsoppholdsporsmal } from '../fravar-og-friskmelding/SoktOmSykepengerIUtenlandsopphold';

const parsePeriode = (periode) => {
    return {
        fom: toDatePrettyPrint(periode.fom),
        tom: toDatePrettyPrint(periode.tom),
    };
};

const finnHarHattUtenlandsopphold = (sykepengesoknad) => {
    return sykepengesoknad.utenlandsopphold !== null;
};

const finnHarHattFerie = (sykepengesoknad) => {
    return sykepengesoknad.ferie.length > 0;
};

const finnFerie = (sykepengesoknad) => {
    return sykepengesoknad.ferie.map(parsePeriode);
};

const finnUtenlandsopphold = (sykepengesoknad) => {
    if (sykepengesoknad.utenlandsopphold) {
        const utenlandsoppholdPerioder = sykepengesoknad.utenlandsopphold.perioder.map(parsePeriode);
        const tempSkjemasoknad = {
            harHattFerie: finnHarHattFerie(sykepengesoknad),
            harHattUtenlandsopphold: finnHarHattUtenlandsopphold(sykepengesoknad),
            ferie: finnFerie(sykepengesoknad),
            utenlandsopphold: {
                ...sykepengesoknad.utenlandsopphold,
                perioder: utenlandsoppholdPerioder,
            },
        };

        return visSoktOmSykepengerUtenlandsoppholdsporsmal(tempSkjemasoknad)
            ? {
                ...sykepengesoknad.utenlandsopphold,
                perioder: utenlandsoppholdPerioder,
            }
            : {
                perioder: utenlandsoppholdPerioder,
            };
    }
    return {
        perioder: [],
    };
};

const finnUtdanning = (sykepengesoknad) => {
    return sykepengesoknad.utdanning
        ? {
            utdanningStartdato: toDatePrettyPrint(sykepengesoknad.utdanning.utdanningStartdato),
            underUtdanningISykmeldingsperioden: true,
            erUtdanningFulltidsstudium: sykepengesoknad.utdanning.erUtdanningFulltidsstudium,
        }
        : {
            underUtdanningISykmeldingsperioden: false,
        };
};

const finnAndreInntektskilder = (sykepengesoknad) => {
    const inntektskilder = Object.keys(inntektskildetyper_).map((key) => {
        return {
            annenInntektskildeType: inntektskildetyper_[key],
        };
    });

    return inntektskilder.map((inntektskilde) => {
        const matchendeInntektskilder = sykepengesoknad.andreInntektskilder.filter((i) => {
            return i.annenInntektskildeType === inntektskilde.annenInntektskildeType;
        });
        if (matchendeInntektskilder.length > 0) {
            return {
                annenInntektskildeType: inntektskilde.annenInntektskildeType,
                avkrysset: true,
                sykmeldt: matchendeInntektskilder[0].sykmeldt,
            };
        }
        return inntektskilde;
    });
};

export default function mapBackendsoknadToSkjemasoknad(sykepengesoknad) {
    const ferie = finnFerie(sykepengesoknad);
    const harHattFerie = finnHarHattFerie(sykepengesoknad);
    const harHattUtenlandsopphold = finnHarHattUtenlandsopphold(sykepengesoknad);
    const harHattPermisjon = sykepengesoknad.permisjon.length > 0;
    const utenlandsopphold = finnUtenlandsopphold(sykepengesoknad);
    const utdanning = finnUtdanning(sykepengesoknad);

    return {
        ...sykepengesoknad,
        bekreftetKorrektInformasjon: false,
        ferie,
        permisjon: sykepengesoknad.permisjon.map(parsePeriode),
        utenlandsopphold,
        andreInntektskilder: finnAndreInntektskilder(sykepengesoknad),
        gjenopptattArbeidFulltUtDato: sykepengesoknad.gjenopptattArbeidFulltUtDato
            ? toDatePrettyPrint(sykepengesoknad.gjenopptattArbeidFulltUtDato)
            : null,
        harGjenopptattArbeidFulltUt: sykepengesoknad.gjenopptattArbeidFulltUtDato !== null,
        egenmeldingsperioder: sykepengesoknad.egenmeldingsperioder.map(parsePeriode),
        harHattFerie,
        harHattUtenlandsopphold,
        harHattPermisjon,
        harHattFeriePermisjonEllerUtenlandsopphold: harHattFerie || harHattPermisjon || harHattUtenlandsopphold,
        harAndreInntektskilder: sykepengesoknad.andreInntektskilder.length > 0,
        bruktEgenmeldingsdagerFoerLegemeldtFravaer: sykepengesoknad.egenmeldingsperioder.length > 0,
        utdanning,
        aktiviteter: mapAktiviteter(sykepengesoknad).aktiviteter
            .map((aktivitet) => {
                if (aktivitet.avvik === null) {
                    return {
                        ...aktivitet,
                        avvik: {},
                        jobbetMerEnnPlanlagt: false,
                    };
                }
                const avvik = {
                    enhet: aktivitet.avvik.timer ? 'timer' : 'prosent',
                    arbeidstimerNormalUke: aktivitet.avvik.arbeidstimerNormalUke.toString().replace('.', ','),
                    timer: aktivitet.avvik.timer ? aktivitet.avvik.timer.toString().replace('.', ',') : '',
                    arbeidsgrad: aktivitet.avvik.arbeidsgrad ? aktivitet.avvik.arbeidsgrad.toString().replace('.', ',') : '',
                };

                if (aktivitet.avvik.beregnetArbeidsgrad) {
                    avvik.beregnetArbeidsgrad = aktivitet.avvik.beregnetArbeidsgrad;
                }

                return {
                    ...aktivitet,
                    jobbetMerEnnPlanlagt: true,
                    avvik,
                };
            }),
    };
}
