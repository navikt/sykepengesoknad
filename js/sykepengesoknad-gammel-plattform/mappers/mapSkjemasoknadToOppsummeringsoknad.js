import {
    getLedetekst,
    inntektskildetyper as inntektskildetypeEnums,
    sykepengesoknadsvartyper as svartype,
    sporsmalstyper,
    tilDatePeriode,
} from '@navikt/digisyfo-npm';
import {
    finnAktivitetssporsmal, finnEgenmeldingsdagerSporsmal,
    finnFeriePermisjonEllerUtenlandsoppholdSporsmal,
    finnInntektskildeLabel,
    finnTotalJobbingSporsmal,
    finnUtdanningssporsmal,
    finnGjenopptattArbeidFulltUtSporsmal,
} from '../utils/finnSykepengesoknadSporsmal';
import { filtrerAktuelleAktiviteter, getGjenopptattArbeidFulltUtDato } from '../utils/sykepengesoknadUtils';
import * as skjemafelter from '../enums/skjemafelter';
import { visSoktOmSykepengerUtenlandsoppholdsporsmal } from '../fravar-og-friskmelding/SoktOmSykepengerIUtenlandsopphold';
import { getStillingsprosent } from '../aktiviteter-i-sykmeldingsperioden/BeregnetArbeidsgrad';

const {
    ansvarBekreftet,
    bruktEgenmeldingsdagerFoerLegemeldtFravaer,
    egenmeldingsperioder,
    harGjenopptattArbeidFulltUt,
    gjenopptattArbeidFulltUtDato,
    harHattFeriePermisjonEllerUtenlandsopphold,
    harHattFerie,
    harHattPermisjon,
    harHattUtenlandsopphold,
    utenlandsoppholdSoektOmSykepengerIPerioden,
    aktiviteter,
    normalArbeidstimerPerUke,
    harAndreInntektskilder,
    andreInntektskilder,
    underUtdanningISykmeldingsperioden,
    utdanningStartdato,
    erUtdanningFulltidsstudium,
    bekreftetKorrektInformasjon,
    ansvarserklaring,
    arbeidsgiverForskutterer,
} = skjemafelter;

const {
    ansvarBekreftetType,
    egenmeldingsdagerType,
    gjenopptattArbeidFulltUtType,
    feriePermisjonUtenlandsoppholdType,
    aktiviteterType,
    inntektskilderType,
    utdanningType,
    arbeidsgiverForskuttererType,
} = sporsmalstyper;

const jegHar = 'jegHar';

const hovedsporsmalsliste = [
    bruktEgenmeldingsdagerFoerLegemeldtFravaer,
    harGjenopptattArbeidFulltUt,
    harHattFeriePermisjonEllerUtenlandsopphold,
    aktiviteter,
    harAndreInntektskilder,
    underUtdanningISykmeldingsperioden,
    arbeidsgiverForskutterer,
    ansvarBekreftet,
];

const sporsmalstyperTyper = {};

sporsmalstyperTyper[ansvarBekreftet] = ansvarBekreftetType;
sporsmalstyperTyper[bruktEgenmeldingsdagerFoerLegemeldtFravaer] = egenmeldingsdagerType;
sporsmalstyperTyper[harGjenopptattArbeidFulltUt] = gjenopptattArbeidFulltUtType;
sporsmalstyperTyper[harHattFeriePermisjonEllerUtenlandsopphold] = feriePermisjonUtenlandsoppholdType;
sporsmalstyperTyper[aktiviteter] = aktiviteterType;
sporsmalstyperTyper[harAndreInntektskilder] = inntektskilderType;
sporsmalstyperTyper[underUtdanningISykmeldingsperioden] = utdanningType;
sporsmalstyperTyper[arbeidsgiverForskutterer] = arbeidsgiverForskuttererType;

const nokler = {};
nokler[ansvarBekreftet] = 'sykepengesoknad.bekreft-ansvar.label';
nokler[bruktEgenmeldingsdagerFoerLegemeldtFravaer] = 'sykepengesoknad.egenmeldingsdager.janei.sporsmal';
nokler[egenmeldingsperioder] = 'sykepengesoknad.egenmeldingsdager.dato.sporsmal';
nokler[gjenopptattArbeidFulltUtDato] = 'sykepengesoknad.gjenopptatt-arbeid-fullt-ut.dato.sporsmal';
nokler[harHattFeriePermisjonEllerUtenlandsopphold] = 'sykepengesoknad.ferie-permisjon-utenlandsopphold.janei.sporsmal';
nokler[harHattFerie] = 'sykepengesoknad.ferie-permisjon-utenlandsopphold.tatt-ut-ferie';
nokler[harHattUtenlandsopphold] = 'sykepengesoknad.ferie-permisjon-utenlandsopphold.oppholdt-meg-utenfor-norge';
nokler[jegHar] = 'sykepengesoknad.ferie-permisjon-utenlandsopphold.jeg-har';
nokler[harHattPermisjon] = 'sykepengesoknad.ferie-permisjon-utenlandsopphold.hatt-permisjon';
nokler[utenlandsoppholdSoektOmSykepengerIPerioden] = 'sykepengesoknad.ferie-permisjon-utenlandsopphold.sokt-om-sykepenger.sporsmal';
nokler.aktiviteterGradert = 'sykepengesoknad.aktiviteter.gradert.spoersmal-2';
nokler.aktiviteterUgradert = 'sykepengesoknad.aktiviteter.ugradert.spoersmal-2';

nokler[normalArbeidstimerPerUke] = 'sykepengesoknad.angi-tid.normal-arbeidstimer.sporsmal';
nokler.normalArbeidstimerPerUkeSvar = 'sykepengesoknad.angi-tid.normal-arbeidstimer.label-med-verdi';
nokler.totalJobbing = 'sykepengesoknad.aktiviteter.avvik.hvor-mye-har-du-jobbet-totalt';
nokler.angiArbeidsgrad = 'sykepengesoknad.angi-tid.velg-enhet.label.prosent-med-verdi';
nokler.angiArbeidstimer = 'sykepengesoknad.angi-tid.velg-enhet.label.timer-med-verdi';
nokler.detteTilsvarer = 'sykepengesoknad.angi-tid.dette-tilsvarer';
nokler[andreInntektskilder] = 'sykepengesoknad.andre-inntektskilder.hvilke-inntektskilder.sporsmal';
nokler[harAndreInntektskilder] = 'sykepengesoknad.andre-inntektskilder.janei.sporsmal';
nokler.erDuSykmeldtFraInntektskilde = 'sykepengesoknad.andre-inntektskilder.er-du-sykmeldt-fra-dette.sporsmal';
nokler[utdanningStartdato] = 'sykepengesoknad.utdanning.startdato.sporsmal';
nokler[erUtdanningFulltidsstudium] = 'sykepengesoknad.utdanning.fulltidsstudium.sporsmal';
nokler.arbeidsgiverForskuttererSvarJA = 'sykepengesoknad.forskutterer-arbeidsgiver.svar.JA';
nokler.arbeidsgiverForskuttererSvarNEI = 'sykepengesoknad.forskutterer-arbeidsgiver.svar.NEI';
nokler.arbeidsgiverForskuttererSvarVET_IKKE = 'sykepengesoknad.forskutterer-arbeidsgiver.svar.VET_IKKE';
nokler[arbeidsgiverForskutterer] = 'sykepengesoknad.forskutterer-arbeidsgiver.sporsmal';
nokler.periode = 'sykepengesoknad.oppsummering.periode.fra-til';
nokler.dato = 'sykepengesoknad.dato';
nokler.ja = 'sykepengesoknad.ja';
nokler.nei = 'sykepengesoknad.nei';
nokler[ansvarserklaring] = 'sykepengesoknad.oppsummering.vaer-klar-over-at';
nokler[bekreftetKorrektInformasjon] = 'sykepengesoknad.oppsummering.bekreft-korrekt-informasjon.label';

const getNokkelOgVerdier = (nokkel, verdier) => {
    const tekst = getLedetekst(nokkel, verdier);
    if (verdier) {
        return {
            nokkel, verdier, tekst,
        };
    }
    return { nokkel, tekst };
};

const getSporsmalsledetekst = (felt, sykepengesoknad, skjemasoknad) => {
    const nokkel = nokler[felt];
    switch (felt) {
        case bruktEgenmeldingsdagerFoerLegemeldtFravaer: {
            return finnEgenmeldingsdagerSporsmal(sykepengesoknad, getNokkelOgVerdier);
        }
        case harGjenopptattArbeidFulltUt:
            return finnGjenopptattArbeidFulltUtSporsmal(sykepengesoknad, getNokkelOgVerdier);
        case harAndreInntektskilder: {
            return getNokkelOgVerdier(nokkel, {
                '%ARBEIDSGIVER%': sykepengesoknad.arbeidsgiver.navn,
            });
        }
        case harHattFeriePermisjonEllerUtenlandsopphold: {
            const _gjenopptattArbeidFulltUtDato = getGjenopptattArbeidFulltUtDato(skjemasoknad);
            return finnFeriePermisjonEllerUtenlandsoppholdSporsmal(sykepengesoknad, _gjenopptattArbeidFulltUtDato, getNokkelOgVerdier);
        }
        case underUtdanningISykmeldingsperioden: {
            const _gjenopptattArbeidFulltUtDato = getGjenopptattArbeidFulltUtDato(skjemasoknad);
            return finnUtdanningssporsmal(sykepengesoknad, _gjenopptattArbeidFulltUtDato, getNokkelOgVerdier);
        }
        default: {
            return getNokkelOgVerdier(nokkel);
        }
    }
};

const tilPeriode = ({ fom, tom }) => {
    const verdier = {
        '%FOM%': fom,
        '%TOM%': tom,
    };

    return {
        ledetekst: {
            nokkel: nokler.periode,
            verdier,
            tekst: getLedetekst(nokler.periode, verdier),
        },
        type: svartype.DATOSPENN,
        undersporsmal: [],
    };
};

export const Tilleggstekst = function (ledetekst, type) {
    this.ledetekst = ledetekst;
    this.type = type;
};

export const Sporsmal = function (ledetekst, svar, type) {
    this.ledetekst = ledetekst;
    this.svar = svar;
    if (type) {
        this.type = type;
    }
};

export const Svar = function (ledetekst, type = svartype.TEKSTSVAR, undersporsmal = [], tilleggstekst) {
    this.ledetekst = ledetekst;
    this.type = type;
    this.undersporsmal = undersporsmal;

    if (tilleggstekst) {
        this.tilleggstekst = tilleggstekst;
    }
};

const getJaEllerNeiSvar = (bool, undersporsmal) => {
    const ledetekst = bool ? getNokkelOgVerdier(nokler.ja) : getNokkelOgVerdier(nokler.nei);
    return [new Svar(ledetekst, svartype.RADIOKNAPPER, undersporsmal)];
};

const tilEgenmeldingFoerLegemeldt = (skjemasoknad, sykepengesoknad, felt) => {
    const undersporsmalEgenmeldingsperioder = new Sporsmal(null, skjemasoknad.egenmeldingsperioder.map(tilPeriode));
    return new Sporsmal(
        getSporsmalsledetekst(felt, sykepengesoknad, skjemasoknad),
        getJaEllerNeiSvar(Object.byString(skjemasoknad, felt), [undersporsmalEgenmeldingsperioder]),
        sporsmalstyperTyper[felt],
    );
};

const tilGjenopptattArbeidFulltUt = (skjemasoknad, sykepengesoknad, felt) => {
    const verdier = {
        '%DATO%': skjemasoknad[gjenopptattArbeidFulltUtDato],
    };
    const undersporsmalGjenopptattArbeid = new Sporsmal(null, [new Svar(getNokkelOgVerdier(nokler.dato, verdier), svartype.DATO)]);
    return new Sporsmal(
        getSporsmalsledetekst(felt, sykepengesoknad, skjemasoknad),
        getJaEllerNeiSvar(Object.byString(skjemasoknad, felt), [undersporsmalGjenopptattArbeid]),
        sporsmalstyperTyper[felt],
    );
};

const tilFeriePermisjonOgUtenlandsopphold = (skjemasoknad, sykepengesoknad, felt) => {
    const utenlandsopphold = (() => {
        if (!skjemasoknad.harHattUtenlandsopphold) {
            return null;
        }
        const utenlandsoppholdperiodersporsmal = new Sporsmal(null, skjemasoknad.utenlandsopphold.perioder.map(tilPeriode));
        const utenlandsoppholdSoektSporsmal = visSoktOmSykepengerUtenlandsoppholdsporsmal(skjemasoknad)
            ? new Sporsmal(
                getSporsmalsledetekst(utenlandsoppholdSoektOmSykepengerIPerioden),
                getJaEllerNeiSvar(skjemasoknad.utenlandsopphold.soektOmSykepengerIPerioden))
            : null;
        const undersporsmal = utenlandsoppholdSoektSporsmal
            ? [utenlandsoppholdperiodersporsmal, utenlandsoppholdSoektSporsmal]
            : [utenlandsoppholdperiodersporsmal];
        return new Svar(getNokkelOgVerdier(nokler[harHattUtenlandsopphold]), svartype.RADIOKNAPPER, undersporsmal);
    })();

    const ferieOgPermisjonssvar = [harHattFerie, harHattPermisjon].map((_felt) => {
        if (skjemasoknad[_felt]) {
            const skjemafelt = _felt === harHattFerie ? 'ferie' : 'permisjon';
            const periodesporsmal = new Sporsmal(null, skjemasoknad[skjemafelt].map(tilPeriode));
            return new Svar(getNokkelOgVerdier(nokler[_felt]), svartype.CHECKBOX, [periodesporsmal]);
        }
        return null;
    });

    const alleSvar = [...ferieOgPermisjonssvar, utenlandsopphold].filter((s) => {
        return s !== null;
    });
    const undersporsmal = new Sporsmal(getSporsmalsledetekst(jegHar, sykepengesoknad, skjemasoknad), alleSvar);

    return new Sporsmal(
        getSporsmalsledetekst(felt, sykepengesoknad, skjemasoknad),
        getJaEllerNeiSvar(Object.byString(skjemasoknad, felt), [undersporsmal]),
        sporsmalstyperTyper[felt],
    );
};

const tilAktiviteterSpm = (skjemasoknad, sykepengesoknad, felt) => {
    const _aktiviteter = filtrerAktuelleAktiviteter(skjemasoknad.aktiviteter, getGjenopptattArbeidFulltUtDato(skjemasoknad));

    return _aktiviteter.map((aktivitet) => {
        const harAvvik = aktivitet.jobbetMerEnnPlanlagt;
        let undersporsmal = [];

        if (harAvvik) {
            const valgtEnhet = aktivitet.avvik.enhet;
            const prosent = 'prosent';
            const normalArbeidstimePerUkeVerdier = {
                '%ANTALL%': aktivitet.avvik.arbeidstimerNormalUke,
            };
            const arbeidsgradverdier = {
                '%ANTALL%': valgtEnhet === prosent ? aktivitet.avvik.arbeidsgrad : aktivitet.avvik.timer,
            };
            const svarnokkel = valgtEnhet === prosent ? nokler.angiArbeidsgrad : nokler.angiArbeidstimer;
            const faktiskjobbingSvar = new Svar(getNokkelOgVerdier(svarnokkel, arbeidsgradverdier));

            if (valgtEnhet !== prosent) {
                const ferieperioder = skjemasoknad.harHattFeriePermisjonEllerUtenlandsopphold && skjemasoknad.harHattFerie ? skjemasoknad.ferie : [];
                const permisjonperioder = skjemasoknad.harHattFeriePermisjonEllerUtenlandsopphold && skjemasoknad.harHattPermisjon ? skjemasoknad.permisjon : [];
                const feriePerioderSomJSDatePerioder = [...ferieperioder, ...permisjonperioder].map(tilDatePeriode);
                const beregnetArbeidsgrad = getStillingsprosent(aktivitet.avvik.timer, aktivitet.avvik.arbeidstimerNormalUke, aktivitet.periode, feriePerioderSomJSDatePerioder);

                if (beregnetArbeidsgrad && beregnetArbeidsgrad > 0) {
                    faktiskjobbingSvar.tilleggstekst = new Tilleggstekst(getNokkelOgVerdier(nokler.detteTilsvarer, {
                        '%STILLINGSPROSENT%': beregnetArbeidsgrad.toString(),
                    }), svartype.HTML);
                }
            }

            undersporsmal = [
                new Sporsmal(
                    getSporsmalsledetekst(normalArbeidstimerPerUke),
                    [new Svar(getNokkelOgVerdier(nokler.normalArbeidstimerPerUkeSvar,
                        normalArbeidstimePerUkeVerdier))]),
                new Sporsmal(finnTotalJobbingSporsmal(sykepengesoknad.arbeidsgiver.navn, getNokkelOgVerdier), [faktiskjobbingSvar]),
            ];
        }

        return new Sporsmal(
            finnAktivitetssporsmal(aktivitet, sykepengesoknad.arbeidsgiver.navn, getNokkelOgVerdier),
            getJaEllerNeiSvar(harAvvik, undersporsmal),
            sporsmalstyperTyper[felt],
        );
    });
};

const tilAndreInntektskilder = (skjemasoknad, sykepengesoknad, felt) => {
    const svar = skjemasoknad.andreInntektskilder.map((inntektskilde) => {
        if (inntektskilde.avkrysset) {
            const label = finnInntektskildeLabel(inntektskilde.annenInntektskildeType, getNokkelOgVerdier);
            if (inntektskilde.annenInntektskildeType !== inntektskildetypeEnums.ANNET) {
                const undersporsmal = new Sporsmal(getNokkelOgVerdier(nokler.erDuSykmeldtFraInntektskilde), getJaEllerNeiSvar(inntektskilde.sykmeldt));
                return new Svar(label, svartype.CHECKBOX, [undersporsmal]);
            }
            return new Svar(label, svartype.CHECKBOX);
        }
        return null;
    }).filter((i) => {
        return i !== null;
    });
    const undersporsmal = [new Sporsmal(getSporsmalsledetekst(andreInntektskilder), svar)];
    return new Sporsmal(
        getSporsmalsledetekst(felt, sykepengesoknad, skjemasoknad),
        getJaEllerNeiSvar(Object.byString(skjemasoknad, felt), undersporsmal),
        sporsmalstyperTyper[felt],
    );
};

function tilUtdanning(skjemasoknad, sykepengesoknad, felt) {
    const svar1 = new Svar(getNokkelOgVerdier(nokler.dato, {
        '%DATO%': skjemasoknad.utdanning.utdanningStartdato,
    }));
    const startdatoSporsmal = new Sporsmal(getSporsmalsledetekst(utdanningStartdato), [svar1]);
    const fulltidsstudiumSporsmal = new Sporsmal(getSporsmalsledetekst(erUtdanningFulltidsstudium), getJaEllerNeiSvar(skjemasoknad.utdanning.erUtdanningFulltidsstudium));

    return new Sporsmal(
        getSporsmalsledetekst(felt, sykepengesoknad, skjemasoknad),
        getJaEllerNeiSvar(Object.byString(skjemasoknad, felt), [startdatoSporsmal, fulltidsstudiumSporsmal]),
        sporsmalstyperTyper[felt],
    );
}

export default (skjemasoknad, sykepengesoknad) => {
    const returverdi = hovedsporsmalsliste.map((felt) => {
        if (skjemasoknad[felt]) {
            switch (felt) {
                case bruktEgenmeldingsdagerFoerLegemeldtFravaer: {
                    return tilEgenmeldingFoerLegemeldt(skjemasoknad, sykepengesoknad, felt);
                }
                case harGjenopptattArbeidFulltUt: {
                    return tilGjenopptattArbeidFulltUt(skjemasoknad, sykepengesoknad, felt);
                }
                case harHattFeriePermisjonEllerUtenlandsopphold: {
                    return tilFeriePermisjonOgUtenlandsopphold(skjemasoknad, sykepengesoknad, felt);
                }
                case aktiviteter: {
                    return tilAktiviteterSpm(skjemasoknad, sykepengesoknad, felt);
                }
                case harAndreInntektskilder: {
                    return tilAndreInntektskilder(skjemasoknad, sykepengesoknad, felt);
                }
                case ansvarBekreftet: {
                    const svar = new Svar(getNokkelOgVerdier(nokler[ansvarBekreftet]), svartype.CHECKBOX);
                    return new Sporsmal(null, [svar], ansvarBekreftetType);
                }
                default: {
                    break;
                }
            }
        }

        if (felt === underUtdanningISykmeldingsperioden) {
            const _aktiviteter = filtrerAktuelleAktiviteter(skjemasoknad.aktiviteter, getGjenopptattArbeidFulltUtDato(skjemasoknad));

            if (!_aktiviteter || _aktiviteter.length === 0) {
                return null;
            } else if (skjemasoknad.utdanning && skjemasoknad.utdanning.underUtdanningISykmeldingsperioden) {
                return tilUtdanning(skjemasoknad, sykepengesoknad, felt);
            }
        }

        if (felt === arbeidsgiverForskutterer) {
            if (!skjemasoknad.arbeidsgiverForskutterer) {
                return null;
            }
            const nokkel = nokler[`arbeidsgiverForskuttererSvar${skjemasoknad.arbeidsgiverForskutterer}`];
            const svar = new Svar(getNokkelOgVerdier(nokkel), svartype.RADIOKNAPPER);

            return new Sporsmal(getSporsmalsledetekst(arbeidsgiverForskutterer), [svar], arbeidsgiverForskuttererType);
        }
        return new Sporsmal(getSporsmalsledetekst(felt, sykepengesoknad, skjemasoknad), getJaEllerNeiSvar(Object.byString(skjemasoknad, felt)), sporsmalstyperTyper[felt]);
    });

    /* Arbeidsspørsmålet er et array av Sporsmal, mens de andre spørsmålene er Sporsmal-instanser.
    Vi må derfor pakke arbeidsspørsmålet ut slik at det ligger på samme nivå som de andre spørsmålene */

    const indeksForArbeidssporsmal = 3;
    const soknad = [...returverdi.slice(0, indeksForArbeidssporsmal),
        ...returverdi[indeksForArbeidssporsmal],
        ...returverdi.slice(indeksForArbeidssporsmal + 1, returverdi.length)]
        .filter((s) => {
            return s !== null;
        });

    return {
        soknad,
        vaerKlarOverAt: new Tilleggstekst(getNokkelOgVerdier(nokler[ansvarserklaring]), svartype.HTML),
        bekreftetKorrektInformasjon: new Sporsmal(null, [new Svar(getNokkelOgVerdier(nokler[bekreftetKorrektInformasjon]), svartype.CHECKBOX)]),
    };
};
