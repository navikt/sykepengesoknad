import chai from 'chai';
import deepFreeze from 'deep-freeze';
import { inntektskildetyper as inntektskildetyper_, setLedetekster, sporsmalstyper } from '@navikt/digisyfo-npm';

import { getSoknad } from '../../../test/mock/mockSykepengesoknader';
import mapSkjemasoknadToOppsummeringSoknad from './mapSkjemasoknadToOppsummeringsoknad';

const expect = chai.expect;

const inntektskildetyper = Object.keys(inntektskildetyper_).map((key) => {
    return {
        annenInntektskildeType: inntektskildetyper_[key],
    };
});

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

describe('mapSkjemasoknadToOppsummeringSoknad', () => {
    let skjemasoknad;
    let sykepengesoknad;

    let aktivitet1;
    let aktivitet2;

    beforeEach(() => {
        /* eslint-disable max-len */
        const tekster = {
            'sykepengesoknad.nei': 'Nei',
            'sykepengesoknad.ja': 'Ja',
            'sykepengesoknad.bekreft-ansvar.label': 'Jeg bekrefter ditt og datt',
            'sykepengesoknad.egenmeldingsdager.janei.sporsmal': 'Vi har registrert at dette legemeldte sykefraværet startet %DATO%. Var du borte fra jobb på grunn av sykdom før dette?',
            'sykepengesoknad.egenmeldingsdager.janei.sporsmal-2': 'Vi har registrert at du ble sykmeldt %DATO%. Brukte du egenmeldinger eller var du sykmeldt i perioden %FOM% til %TOM%?',
            'sykepengesoknad.egenmeldingsdager.janei.sporsmal-3': 'Vi har registrert at du ble sykmeldt %DATO%. Brukte du egenmeldinger eller var du sykmeldt i perioden %PERIODE%?',
            'sykepengesoknad.egenmeldingsdager.dato.sporsmal': 'Når gjorde du dette?',
            'sykepengesoknad.gjenopptatt-arbeid-fullt-ut.janei.sporsmal-2': 'Var du tilbake i fullt arbeid hos %ARBEIDSGIVER% før %DATO%?',
            'sykepengesoknad.gjenopptatt-arbeid-fullt-ut.dato.sporsmal': 'Fra hvilken dato ble arbeidet gjenopptatt?',
            'sykepengesoknad.ferie-permisjon-utenlandsopphold.jeg-har': 'Jeg har...',
            'sykepengesoknad.oppsummering.periode.fra-til': 'Fra %FOM% til %TOM%',
            'sykepengesoknad.dato': '%DATO%',
            'sykepengesoknad.ferie-permisjon-utenlandsopphold.janei.sporsmal': 'Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden %FOM%–%TOM%?',
            'sykepengesoknad.ferie-permisjon-utenlandsopphold.janei.sporsmal-2': 'Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden %PERIODE%?',
            'sykepengesoknad.ferie-permisjon-utenlandsopphold.tatt-ut-ferie': 'hatt ferie',
            'sykepengesoknad.ferie-permisjon-utenlandsopphold.hatt-permisjon': 'hatt permisjon',
            'sykepengesoknad.ferie-permisjon-utenlandsopphold.oppholdt-meg-utenfor-norge': 'oppholdt meg utenfor Norge',
            'sykepengesoknad.ferie-permisjon-utenlandsopphold.sokt-om-sykepenger.sporsmal': 'Har du søkt om å beholde sykepenger under dette oppholdet utenfor Norge?',
            'sykepengesoknad.aktiviteter.ugradert.spoersmal-3': 'I perioden %PERIODE% var du 100 % sykmeldt fra %ARBEIDSGIVER%. Jobbet du noe i denne perioden?',
            'sykepengesoknad.aktiviteter.gradert.spoersmal-3': 'I perioden %PERIODE% skulle du ifølge sykmeldingen jobbe %ARBEIDSGRAD% % av din normale arbeidstid hos %ARBEIDSGIVER%. Jobbet du mer enn dette?',
            'sykepengesoknad.angi-tid.normal-arbeidstimer.sporsmal': 'Hvor mange timer jobber du normalt per uke?',
            'sykepengesoknad.angi-tid.normal-arbeidstimer.label-med-verdi': '%ANTALL% timer per uke',
            'sykepengesoknad.aktiviteter.avvik.hvor-mye-har-du-jobbet-totalt': 'Hvor mye jobbet du totalt i denne perioden hos %ARBEIDSGIVER%?',
            'sykepengesoknad.angi-tid.velg-enhet.label.timer-med-verdi': '%ANTALL% timer totalt',
            'sykepengesoknad.angi-tid.velg-enhet.label.prosent-med-verdi': '%ANTALL% prosent per uke',
            'sykepengesoknad.angi-tid.dette-tilsvarer': 'Vår foreløpige beregning er at du jobbet <strong>%STILLINGSPROSENT% %</strong> av stillingen din.',
            'sykepengesoknad.andre-inntektskilder.janei.sporsmal': 'Har du andre inntektskilder, eller jobber du for andre enn %ARBEIDSGIVER%?',
            'sykepengesoknad.andre-inntektskilder.hvilke-inntektskilder.sporsmal': 'Hvilke andre inntektskilder har du?',
            'sykepengesoknad.andre-inntektskilder.ANNET.label': 'Annet',
            'sykepengesoknad.andre-inntektskilder.FRILANSER.label': 'Frilanser',
            'sykepengesoknad.andre-inntektskilder.JORDBRUKER_FISKER_REINDRIFTSUTOEVER.label': 'Jordbruker, fisker, reindriftsutøver',
            'sykepengesoknad.andre-inntektskilder.SELVSTENDIG_NAERINGSDRIVENDE_DAGMAMMA.label': 'Dagmamma',
            'sykepengesoknad.andre-inntektskilder.SELVSTENDIG_NAERINGSDRIVENDE.label': 'Selvstendig næringsdrivende',
            'sykepengesoknad.andre-inntektskilder.ANDRE_ARBEIDSFORHOLD.label': 'Andre arbeidsforhold',
            'sykepengesoknad.andre-inntektskilder.er-du-sykmeldt-fra-dette.sporsmal': 'Er du sykmeldt fra dette?',
            'sykepengesoknad.utdanning.ja-nei.sporsmal-2': 'Har du vært under utdanning i løpet av perioden %PERIODE%?',
            'sykepengesoknad.utdanning.startdato.sporsmal': 'Når startet du på utdanningen?',
            'sykepengesoknad.utdanning.fulltidsstudium.sporsmal': 'Er utdanningen et fulltidsstudium?',
            'sykepengesoknad.oppsummering.vaer-klar-over-at': '<p>Vær klar over dette!</p>',
            'sykepengesoknad.oppsummering.bekreft-korrekt-informasjon.label': 'Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.',
            'sykepengesoknad.forskutterer-arbeidsgiver.svar.JA': 'Ja',
            'sykepengesoknad.forskutterer-arbeidsgiver.svar.NEI': 'Nei',
            'sykepengesoknad.forskutterer-arbeidsgiver.svar.VET_IKKE': 'Vet ikke',
            'sykepengesoknad.forskutterer-arbeidsgiver.sporsmal': 'Betaler arbeidsgiveren lønnen din når du er syk?',
        };
        /* eslint-enable max-len */

        setLedetekster(tekster);

        sykepengesoknad = getSoknad({
            arbeidsgiver: {
                navn: 'Olsens Sykkelservice',
            },
        });

        aktivitet1 = Object.assign({}, sykepengesoknad.aktiviteter[0], {
            jobbetMerEnnPlanlagt: false,
        });
        aktivitet2 = Object.assign({}, sykepengesoknad.aktiviteter[1], {
            jobbetMerEnnPlanlagt: false,
        });

        skjemasoknad = {
            aktiviteter: [aktivitet1, aktivitet2],
        };
    });

    describe('Før du begynner', () => {
        it('Skal mappe ansvarBekreftet når ansvar er bekreftet', () => {
            skjemasoknad.ansvarBekreftet = true;
            const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
            expect(verdier.soknad[verdier.soknad.length - 1]).to.deep.equal({
                type: ansvarBekreftetType,
                ledetekst: null,
                svar: [{
                    ledetekst: {
                        nokkel: 'sykepengesoknad.bekreft-ansvar.label',
                        tekst: 'Jeg bekrefter ditt og datt',
                    },
                    type: 'CHECKBOX',
                    undersporsmal: [],
                }],
            });
        });
    });

    describe('Fravær og friskmelding', () => {
        describe('bruktEgenmeldingsdagerFoerLegemeldtFravaer', () => {
            it('Skal mappe bruktEgenmeldingsdagerFoerLegemeldtFravaer når bruktEgenmeldingsdagerFoerLegemeldtFravaer = false', () => {
                skjemasoknad.bruktEgenmeldingsdagerFoerLegemeldtFravaer = false;
                sykepengesoknad.identdato = new Date('2017-02-19');
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                expect(verdier.soknad[0]).to.deep.equal({
                    type: egenmeldingsdagerType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.egenmeldingsdager.janei.sporsmal-3',
                        verdier: {
                            '%DATO%': 'søndag 19. februar 2017',
                            '%PERIODE%': '3. – 18. februar 2017',
                        },
                        tekst: 'Vi har registrert at du ble sykmeldt søndag 19. februar 2017. Brukte du egenmeldinger eller var du sykmeldt i perioden 3. – 18. februar 2017?',
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.nei',
                            tekst: 'Nei',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [],
                    }],
                });
            });

            describe('Når bruktEgenmeldingsdagerFoerLegemeldtFravaer er true', () => {
                beforeEach(() => {
                    skjemasoknad.bruktEgenmeldingsdagerFoerLegemeldtFravaer = true;
                    sykepengesoknad.identdato = new Date('2017-02-19');
                    skjemasoknad.egenmeldingsperioder = [{
                        fom: '01.02.2017',
                        tom: '12.01.2017',
                    }];
                });

                it('Skal mappe bruktEgenmeldingsdagerFoerLegemeldtFravaer og egenmeldingsperioder', () => {
                    const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                    expect(verdier.soknad[0]).to.deep.equal({
                        type: egenmeldingsdagerType,
                        ledetekst: {
                            nokkel: 'sykepengesoknad.egenmeldingsdager.janei.sporsmal-3',
                            verdier: {
                                '%DATO%': 'søndag 19. februar 2017',
                                '%PERIODE%': '3. – 18. februar 2017',
                            },
                            tekst: 'Vi har registrert at du ble sykmeldt søndag 19. februar 2017. Brukte du egenmeldinger eller var du sykmeldt i perioden 3. – 18. februar 2017?',
                        },
                        svar: [{
                            ledetekst: {
                                nokkel: 'sykepengesoknad.ja',
                                tekst: 'Ja',
                            },
                            type: 'RADIOKNAPPER',
                            undersporsmal: [{
                                ledetekst: null,
                                svar: [{
                                    ledetekst: {
                                        nokkel: 'sykepengesoknad.oppsummering.periode.fra-til',
                                        tekst: 'Fra 01.02.2017 til 12.01.2017',
                                        verdier: {
                                            '%FOM%': '01.02.2017',
                                            '%TOM%': '12.01.2017',
                                        },
                                    },
                                    type: 'DATOSPENN',
                                    undersporsmal: [],
                                }],
                            }],
                        }],
                    });
                });
            });
        });

        describe('GjenopptattArbeidFulltUt', () => {
            it('Skal mappe harGjenopptattArbeidFulltUt når harGjenopptattArbeidFulltUt er false', () => {
                skjemasoknad.harGjenopptattArbeidFulltUt = false;
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                expect(verdier.soknad[1]).to.deep.equal({
                    type: gjenopptattArbeidFulltUtType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.gjenopptatt-arbeid-fullt-ut.janei.sporsmal-2',
                        verdier: {
                            '%ARBEIDSGIVER%': 'Olsens Sykkelservice',
                            '%DATO%': '26. januar 2017',
                        },
                        tekst: 'Var du tilbake i fullt arbeid hos Olsens Sykkelservice før 26. januar 2017?',
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.nei',
                            tekst: 'Nei',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [],
                    }],
                });
            });

            it('Skal mappe harGjenopptattArbeidFulltUt når det er en oppdelt søknad', () => {
                skjemasoknad.harGjenopptattArbeidFulltUt = false;
                sykepengesoknad.tom = new Date('2017-01-13');
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                expect(verdier.soknad[1]).to.deep.equal({
                    type: gjenopptattArbeidFulltUtType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.gjenopptatt-arbeid-fullt-ut.janei.sporsmal-2',
                        verdier: {
                            '%ARBEIDSGIVER%': 'Olsens Sykkelservice',
                            '%DATO%': '14. januar 2017',
                        },
                        tekst: 'Var du tilbake i fullt arbeid hos Olsens Sykkelservice før 14. januar 2017?',
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.nei',
                            tekst: 'Nei',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [],
                    }],
                });
            });

            it('Skal mappe harGjenopptattArbeidFulltUt når harGjenopptattArbeidFulltUt er true', () => {
                skjemasoknad.harGjenopptattArbeidFulltUt = true;
                skjemasoknad.gjenopptattArbeidFulltUtDato = '05.01.2017';
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                expect(verdier.soknad[1]).to.deep.equal({
                    type: gjenopptattArbeidFulltUtType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.gjenopptatt-arbeid-fullt-ut.janei.sporsmal-2',
                        verdier: {
                            '%ARBEIDSGIVER%': 'Olsens Sykkelservice',
                            '%DATO%': '26. januar 2017',
                        },
                        tekst: 'Var du tilbake i fullt arbeid hos Olsens Sykkelservice før 26. januar 2017?',
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.ja',
                            tekst: 'Ja',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [{
                            ledetekst: null,
                            svar: [{
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.dato',
                                    verdier: {
                                        '%DATO%': '05.01.2017',
                                    },
                                    tekst: '05.01.2017',
                                },
                                type: 'DATO',
                                undersporsmal: [],
                            }],
                        }],
                    }],
                });
            });
        });

        describe('Ferie, permisjon eller utenlandsopphold', () => {
            it('Skal mappe harHattFeriePermisjonEllerUtenlandsopphold når feltet er false', () => {
                skjemasoknad.harHattFeriePermisjonEllerUtenlandsopphold = false;
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                expect(verdier.soknad[2]).to.deep.equal({
                    type: feriePermisjonUtenlandsoppholdType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.janei.sporsmal-2',
                        verdier: {
                            '%PERIODE%': '1. – 25. januar 2017',
                        },
                        tekst: 'Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 1. – 25. januar 2017?',
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.nei',
                            tekst: 'Nei',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [],
                    }],
                });
            });

            it('Skal mappe harHattFeriePermisjonEllerUtenlandsopphold når feltet er true', () => {
                skjemasoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                skjemasoknad.harHattFerie = true;
                skjemasoknad.ferie = [{
                    fom: '02.01.2017',
                    tom: '08.01.2017',
                }];
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));

                expect(verdier.soknad[2]).to.deep.equal({
                    type: feriePermisjonUtenlandsoppholdType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.janei.sporsmal-2',
                        verdier: {
                            '%PERIODE%': '1. – 25. januar 2017',
                        },
                        tekst: 'Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 1. – 25. januar 2017?',
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.ja',
                            tekst: 'Ja',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [{
                            ledetekst: {
                                nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.jeg-har',
                                tekst: 'Jeg har...',
                            },
                            svar: [{
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.tatt-ut-ferie',
                                    tekst: 'hatt ferie',
                                },
                                type: 'CHECKBOX',
                                undersporsmal: [{
                                    ledetekst: null,
                                    svar: [{
                                        type: 'DATOSPENN',
                                        ledetekst: {
                                            nokkel: 'sykepengesoknad.oppsummering.periode.fra-til',
                                            verdier: {
                                                '%FOM%': '02.01.2017',
                                                '%TOM%': '08.01.2017',
                                            },
                                            tekst: 'Fra 02.01.2017 til 08.01.2017',
                                        },
                                        undersporsmal: [],
                                    }],
                                }],

                            }],

                        }],
                    }],
                });
            });

            it('Skal mappe harHattFeriePermisjonEllerUtenlandsopphold når feltet er true og permisjon er true', () => {
                skjemasoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                skjemasoknad.harHattPermisjon = true;
                skjemasoknad.permisjon = [{
                    fom: '02.01.2017',
                    tom: '08.01.2017',
                }];
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));

                expect(verdier.soknad[2]).to.deep.equal({
                    type: feriePermisjonUtenlandsoppholdType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.janei.sporsmal-2',
                        verdier: {
                            '%PERIODE%': '1. – 25. januar 2017',
                        },
                        tekst: 'Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 1. – 25. januar 2017?',
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.ja',
                            tekst: 'Ja',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [{
                            ledetekst: {
                                nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.jeg-har',
                                tekst: 'Jeg har...',
                            },
                            svar: [{
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.hatt-permisjon',
                                    tekst: 'hatt permisjon',
                                },
                                type: 'CHECKBOX',
                                undersporsmal: [{
                                    ledetekst: null,
                                    svar: [{
                                        type: 'DATOSPENN',
                                        ledetekst: {
                                            nokkel: 'sykepengesoknad.oppsummering.periode.fra-til',
                                            verdier: {
                                                '%FOM%': '02.01.2017',
                                                '%TOM%': '08.01.2017',
                                            },
                                            tekst: 'Fra 02.01.2017 til 08.01.2017',
                                        },
                                        undersporsmal: [],
                                    }],
                                }],
                            }],
                        }],
                    }],
                });
            });


            it('Skal mappe harHattFeriePermisjonEllerUtenlandsopphold når feltet er true og utenlandsopphold er true', () => {
                skjemasoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                skjemasoknad.harHattUtenlandsopphold = true;
                skjemasoknad.utenlandsopphold = {
                    soektOmSykepengerIPerioden: true,
                    perioder: [{
                        fom: '02.01.2017',
                        tom: '08.01.2017',
                    }, {
                        fom: '09.01.2017',
                        tom: '11.01.2017',
                    }],
                };
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));

                expect(verdier.soknad[2]).to.deep.equal({
                    type: feriePermisjonUtenlandsoppholdType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.janei.sporsmal-2',
                        verdier: {
                            '%PERIODE%': '1. – 25. januar 2017',
                        },
                        tekst: 'Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 1. – 25. januar 2017?',
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.ja',
                            tekst: 'Ja',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [{
                            ledetekst: {
                                nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.jeg-har',
                                tekst: 'Jeg har...',
                            },
                            svar: [{
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.oppholdt-meg-utenfor-norge',
                                    tekst: 'oppholdt meg utenfor Norge',
                                },
                                type: 'RADIOKNAPPER',
                                undersporsmal: [{
                                    ledetekst: null,
                                    svar: [{
                                        type: 'DATOSPENN',
                                        ledetekst: {
                                            nokkel: 'sykepengesoknad.oppsummering.periode.fra-til',
                                            verdier: {
                                                '%FOM%': '02.01.2017',
                                                '%TOM%': '08.01.2017',
                                            },
                                            tekst: 'Fra 02.01.2017 til 08.01.2017',
                                        },
                                        undersporsmal: [],
                                    }, {
                                        type: 'DATOSPENN',
                                        ledetekst: {
                                            nokkel: 'sykepengesoknad.oppsummering.periode.fra-til',
                                            verdier: {
                                                '%FOM%': '09.01.2017',
                                                '%TOM%': '11.01.2017',
                                            },
                                            tekst: 'Fra 09.01.2017 til 11.01.2017',
                                        },
                                        undersporsmal: [],
                                    }],
                                }, {
                                    ledetekst: {
                                        nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.sokt-om-sykepenger.sporsmal',
                                        tekst: 'Har du søkt om å beholde sykepenger under dette oppholdet utenfor Norge?',
                                    },
                                    svar: [{
                                        ledetekst: {
                                            nokkel: 'sykepengesoknad.ja',
                                            tekst: 'Ja',
                                        },
                                        type: 'RADIOKNAPPER',
                                        undersporsmal: [],
                                    }],
                                }],

                            }],

                        }],
                    }],
                });
            });

            it('Skal mappe harHattFeriePermisjonEllerUtenlandsopphold når feltet er true og utenlandsopphold er true og ferie er true', () => {
                skjemasoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                skjemasoknad.harHattUtenlandsopphold = true;
                skjemasoknad.harHattFerie = true;
                skjemasoknad.utenlandsopphold = {
                    soektOmSykepengerIPerioden: true,
                    perioder: [{
                        fom: '02.01.2017',
                        tom: '08.01.2017',
                    }],
                };
                skjemasoknad.ferie = [{
                    fom: '02.01.2017',
                    tom: '05.01.2017',
                }];
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));

                expect(verdier.soknad[2]).to.deep.equal({
                    type: feriePermisjonUtenlandsoppholdType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.janei.sporsmal-2',
                        verdier: {
                            '%PERIODE%': '1. – 25. januar 2017',
                        },
                        tekst: 'Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 1. – 25. januar 2017?',
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.ja',
                            tekst: 'Ja',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [{
                            ledetekst: {
                                nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.jeg-har',
                                tekst: 'Jeg har...',
                            },
                            svar: [{
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.tatt-ut-ferie',
                                    tekst: 'hatt ferie',
                                },
                                type: 'CHECKBOX',
                                undersporsmal: [{
                                    ledetekst: null,
                                    svar: [{
                                        type: 'DATOSPENN',
                                        ledetekst: {
                                            nokkel: 'sykepengesoknad.oppsummering.periode.fra-til',
                                            verdier: {
                                                '%FOM%': '02.01.2017',
                                                '%TOM%': '05.01.2017',
                                            },
                                            tekst: 'Fra 02.01.2017 til 05.01.2017',
                                        },
                                        undersporsmal: [],
                                    }],
                                }],

                            }, {
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.oppholdt-meg-utenfor-norge',
                                    tekst: 'oppholdt meg utenfor Norge',
                                },
                                type: 'RADIOKNAPPER',
                                undersporsmal: [{
                                    ledetekst: null,
                                    svar: [{
                                        type: 'DATOSPENN',
                                        ledetekst: {
                                            nokkel: 'sykepengesoknad.oppsummering.periode.fra-til',
                                            verdier: {
                                                '%FOM%': '02.01.2017',
                                                '%TOM%': '08.01.2017',
                                            },
                                            tekst: 'Fra 02.01.2017 til 08.01.2017',
                                        },
                                        undersporsmal: [],
                                    }],
                                }, {
                                    ledetekst: {
                                        nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.sokt-om-sykepenger.sporsmal',
                                        tekst: 'Har du søkt om å beholde sykepenger under dette oppholdet utenfor Norge?',
                                    },
                                    svar: [{
                                        ledetekst: {
                                            nokkel: 'sykepengesoknad.ja',
                                            tekst: 'Ja',
                                        },
                                        type: 'RADIOKNAPPER',
                                        undersporsmal: [],
                                    }],
                                }],

                            }],

                        }],
                    }],
                });
            });

            it('Skal mappe harHattFeriePermisjonEllerUtenlandsopphold når man har hatt ferie under utenlandsopphold', () => {
                skjemasoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                skjemasoknad.harHattUtenlandsopphold = true;
                skjemasoknad.harHattFerie = true;
                skjemasoknad.utenlandsopphold = {
                    soektOmSykepengerIPerioden: true,
                    perioder: [{
                        fom: '04.01.2017',
                        tom: '07.01.2017',
                    }],
                };
                skjemasoknad.ferie = [{
                    fom: '02.01.2017',
                    tom: '08.01.2017',
                }];
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));

                expect(verdier.soknad[2]).to.deep.equal({
                    type: feriePermisjonUtenlandsoppholdType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.janei.sporsmal-2',
                        verdier: {
                            '%PERIODE%': '1. – 25. januar 2017',
                        },
                        tekst: 'Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 1. – 25. januar 2017?',
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.ja',
                            tekst: 'Ja',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [{
                            ledetekst: {
                                nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.jeg-har',
                                tekst: 'Jeg har...',
                            },
                            svar: [{
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.tatt-ut-ferie',
                                    tekst: 'hatt ferie',
                                },
                                type: 'CHECKBOX',
                                undersporsmal: [{
                                    ledetekst: null,
                                    svar: [{
                                        type: 'DATOSPENN',
                                        ledetekst: {
                                            nokkel: 'sykepengesoknad.oppsummering.periode.fra-til',
                                            verdier: {
                                                '%FOM%': '02.01.2017',
                                                '%TOM%': '08.01.2017',
                                            },
                                            tekst: 'Fra 02.01.2017 til 08.01.2017',
                                        },
                                        undersporsmal: [],
                                    }],
                                }],

                            }, {
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.ferie-permisjon-utenlandsopphold.oppholdt-meg-utenfor-norge',
                                    tekst: 'oppholdt meg utenfor Norge',
                                },
                                type: 'RADIOKNAPPER',
                                undersporsmal: [{
                                    ledetekst: null,
                                    svar: [{
                                        type: 'DATOSPENN',
                                        ledetekst: {
                                            nokkel: 'sykepengesoknad.oppsummering.periode.fra-til',
                                            verdier: {
                                                '%FOM%': '04.01.2017',
                                                '%TOM%': '07.01.2017',
                                            },
                                            tekst: 'Fra 04.01.2017 til 07.01.2017',
                                        },
                                        undersporsmal: [],
                                    }],
                                }],

                            }],

                        }],
                    }],
                });
            });
        });
    });

    describe('Aktiviteter i sykmeldingsperioden', () => {
        describe('Arbeid', () => {
            let aktivitetIkkeJobbetMerEnnPlanlagt;
            let aktivitetMedArbeidsgradLikNull;

            beforeEach(() => {
                aktivitet1 = Object.assign({}, sykepengesoknad.aktiviteter[0], {
                    jobbetMerEnnPlanlagt: true,
                    avvik: {
                        enhet: 'prosent',
                        arbeidsgrad: '80',
                        arbeidstimerNormalUke: '37,5',
                    },
                });

                aktivitet2 = Object.assign({}, sykepengesoknad.aktiviteter[0], {
                    jobbetMerEnnPlanlagt: true,
                    avvik: {
                        enhet: 'timer',
                        timer: '15',
                        arbeidstimerNormalUke: '37,5',
                    },
                });

                aktivitetIkkeJobbetMerEnnPlanlagt = Object.assign({}, sykepengesoknad.aktiviteter[0], {
                    jobbetMerEnnPlanlagt: false,
                    avvik: {
                        enhet: 'prosent',
                        arbeidsgrad: '80',
                        arbeidstimerNormalUke: '37,5',
                    },
                });

                aktivitetMedArbeidsgradLikNull = {
                    periode: {
                        fom: new Date('2018-02-17T00:00:00.000Z'),
                        tom: new Date('2018-02-18T00:00:00.000Z'),
                    },
                    grad: 100,
                    avvik: {
                        enhet: 'timer',
                        arbeidstimerNormalUke: '37',
                        arbeidsgrad: null,
                        timer: '2',
                    },
                    id: 104640,
                    jobbetMerEnnPlanlagt: true,
                };
            });


            it('Skal mappe arbeidsspørsmål for ugraderte perioder når bruker har jobbet mer enn planlagt og oppgitt dette i prosent', () => {
                skjemasoknad.aktiviteter = [aktivitet1];
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                expect(verdier.soknad[3]).to.deep.equal({
                    type: aktiviteterType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.aktiviteter.ugradert.spoersmal-3',
                        tekst: 'I perioden 1. – 15. januar 2017 var du 100 % sykmeldt fra Olsens Sykkelservice. Jobbet du noe i denne perioden?',
                        verdier: {
                            '%PERIODE%': '1. – 15. januar 2017',
                            '%ARBEIDSGRAD%': 0,
                            '%ARBEIDSGIVER%': 'Olsens Sykkelservice',
                        },
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.ja',
                            tekst: 'Ja',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [{
                            ledetekst: {
                                nokkel: 'sykepengesoknad.angi-tid.normal-arbeidstimer.sporsmal',
                                tekst: 'Hvor mange timer jobber du normalt per uke?',
                            },
                            svar: [{
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.angi-tid.normal-arbeidstimer.label-med-verdi',
                                    tekst: '37,5 timer per uke',
                                    verdier: {
                                        '%ANTALL%': '37,5',
                                    },
                                },
                                type: 'TEKSTSVAR',
                                undersporsmal: [],
                            }],
                        }, {
                            ledetekst: {
                                nokkel: 'sykepengesoknad.aktiviteter.avvik.hvor-mye-har-du-jobbet-totalt',
                                tekst: 'Hvor mye jobbet du totalt i denne perioden hos Olsens Sykkelservice?',
                                verdier: {
                                    '%ARBEIDSGIVER%': 'Olsens Sykkelservice',
                                },
                            },
                            svar: [{
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.angi-tid.velg-enhet.label.prosent-med-verdi',
                                    tekst: '80 prosent per uke',
                                    verdier: {
                                        '%ANTALL%': '80',
                                    },
                                },
                                type: 'TEKSTSVAR',
                                undersporsmal: [],
                            }],
                        }],
                    }],
                });
            });

            it('Skal mappe arbeidsspørsmål for ugraderte perioder når bruker har jobbet mer enn planlagt, oppgitt dette i timer og hatt permisjon i perioden', () => {
                skjemasoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                skjemasoknad.harHattPermisjon = true;
                skjemasoknad.permisjon = [{
                    fom: '02.01.2017',
                    tom: '08.01.2017',
                }];
                skjemasoknad.aktiviteter = [aktivitet2];
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                expect(verdier.soknad[3]).to.deep.equal({
                    type: aktiviteterType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.aktiviteter.ugradert.spoersmal-3',
                        tekst: 'I perioden 1. – 15. januar 2017 var du 100 % sykmeldt fra Olsens Sykkelservice. Jobbet du noe i denne perioden?',
                        verdier: {
                            '%PERIODE%': '1. – 15. januar 2017',
                            '%ARBEIDSGRAD%': 0,
                            '%ARBEIDSGIVER%': 'Olsens Sykkelservice',
                        },
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.ja',
                            tekst: 'Ja',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [{
                            ledetekst: {
                                nokkel: 'sykepengesoknad.angi-tid.normal-arbeidstimer.sporsmal',
                                tekst: 'Hvor mange timer jobber du normalt per uke?',
                            },
                            svar: [{
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.angi-tid.normal-arbeidstimer.label-med-verdi',
                                    tekst: '37,5 timer per uke',
                                    verdier: {
                                        '%ANTALL%': '37,5',
                                    },
                                },
                                type: 'TEKSTSVAR',
                                undersporsmal: [],
                            }],
                        }, {
                            ledetekst: {
                                nokkel: 'sykepengesoknad.aktiviteter.avvik.hvor-mye-har-du-jobbet-totalt',
                                tekst: 'Hvor mye jobbet du totalt i denne perioden hos Olsens Sykkelservice?',
                                verdier: {
                                    '%ARBEIDSGIVER%': 'Olsens Sykkelservice',
                                },
                            },
                            svar: [{
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.angi-tid.velg-enhet.label.timer-med-verdi',
                                    tekst: '15 timer totalt',
                                    verdier: {
                                        '%ANTALL%': '15',
                                    },
                                },
                                type: 'TEKSTSVAR',
                                tilleggstekst: {
                                    ledetekst: {
                                        tekst: 'Vår foreløpige beregning er at du jobbet <strong>40 %</strong> av stillingen din.',
                                        nokkel: 'sykepengesoknad.angi-tid.dette-tilsvarer',
                                        verdier: {
                                            '%STILLINGSPROSENT%': '40',
                                        },
                                    },
                                    type: 'HTML',
                                },
                                undersporsmal: [],
                            }],
                        }],
                    }],
                });
            });

            it('Skal mappe arbeidsspørsmål for ugraderte perioder når bruker har jobbet mer enn planlagt og oppgitt dette i timer', () => {
                skjemasoknad.aktiviteter = [aktivitet2];
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                expect(verdier.soknad[3]).to.deep.equal({
                    type: aktiviteterType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.aktiviteter.ugradert.spoersmal-3',
                        tekst: 'I perioden 1. – 15. januar 2017 var du 100 % sykmeldt fra Olsens Sykkelservice. Jobbet du noe i denne perioden?',
                        verdier: {
                            '%PERIODE%': '1. – 15. januar 2017',
                            '%ARBEIDSGRAD%': 0,
                            '%ARBEIDSGIVER%': 'Olsens Sykkelservice',
                        },
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.ja',
                            tekst: 'Ja',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [{
                            ledetekst: {
                                nokkel: 'sykepengesoknad.angi-tid.normal-arbeidstimer.sporsmal',
                                tekst: 'Hvor mange timer jobber du normalt per uke?',
                            },
                            svar: [{
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.angi-tid.normal-arbeidstimer.label-med-verdi',
                                    tekst: '37,5 timer per uke',
                                    verdier: {
                                        '%ANTALL%': '37,5',
                                    },
                                },
                                type: 'TEKSTSVAR',
                                undersporsmal: [],
                            }],
                        }, {
                            ledetekst: {
                                nokkel: 'sykepengesoknad.aktiviteter.avvik.hvor-mye-har-du-jobbet-totalt',
                                tekst: 'Hvor mye jobbet du totalt i denne perioden hos Olsens Sykkelservice?',
                                verdier: {
                                    '%ARBEIDSGIVER%': 'Olsens Sykkelservice',
                                },
                            },
                            svar: [{
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.angi-tid.velg-enhet.label.timer-med-verdi',
                                    tekst: '15 timer totalt',
                                    verdier: {
                                        '%ANTALL%': '15',
                                    },
                                },
                                type: 'TEKSTSVAR',
                                tilleggstekst: {
                                    ledetekst: {
                                        tekst: 'Vår foreløpige beregning er at du jobbet <strong>20 %</strong> av stillingen din.',
                                        nokkel: 'sykepengesoknad.angi-tid.dette-tilsvarer',
                                        verdier: {
                                            '%STILLINGSPROSENT%': '20',
                                        },
                                    },
                                    type: 'HTML',
                                },
                                undersporsmal: [],
                            }],
                        }],
                    }],
                });
            });

            it('Skal mappe arbeidsspørsmål for ugraderte perioder når bruker ikke har jobbet mer enn planlagt', () => {
                skjemasoknad.aktiviteter = [aktivitetIkkeJobbetMerEnnPlanlagt];
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                expect(verdier.soknad[3]).to.deep.equal({
                    type: aktiviteterType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.aktiviteter.ugradert.spoersmal-3',
                        tekst: 'I perioden 1. – 15. januar 2017 var du 100 % sykmeldt fra Olsens Sykkelservice. Jobbet du noe i denne perioden?',
                        verdier: {
                            '%PERIODE%': '1. – 15. januar 2017',
                            '%ARBEIDSGRAD%': 0,
                            '%ARBEIDSGIVER%': 'Olsens Sykkelservice',
                        },
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.nei',
                            tekst: 'Nei',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [],
                    }],
                });
            });

            it('Skal ikke lage tilleggstekst med beregnet arbeidsgrad når arbeidsgrad er null', () => {
                skjemasoknad.aktiviteter = [aktivitetMedArbeidsgradLikNull];
                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                expect(verdier.soknad[3].svar[0].undersporsmal[1].svar[0].tilleggstekst).to.equal(undefined);
            });

            it('Filterer bort aktiviteter om arbeid gjenopptatt spiller inn', () => {
                // Aktiviteter: 01.01.17-15.01.17 og 16.01.17-25.01.17
                skjemasoknad.harGjenopptattArbeidFulltUt = true;
                skjemasoknad.gjenopptattArbeidFulltUtDato = '14.01.2017';

                const verdier = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));

                const aktivitetssporsmaal = verdier.soknad.filter((sporsmaal) => { return sporsmaal.type === aktiviteterType; });
                expect(aktivitetssporsmaal.length).to.equal(1);
                expect(aktivitetssporsmaal[0]).to.deep.equal({
                    type: aktiviteterType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.aktiviteter.ugradert.spoersmal-3',
                        tekst: 'I perioden 1. – 13. januar 2017 var du 100 % sykmeldt fra Olsens Sykkelservice. Jobbet du noe i denne perioden?',
                        verdier: {
                            '%PERIODE%': '1. – 13. januar 2017',
                            '%ARBEIDSGRAD%': 0,
                            '%ARBEIDSGIVER%': 'Olsens Sykkelservice',
                        },
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.nei',
                            tekst: 'Nei',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [],
                    }],
                });
            });
        });
    });

    describe('Andre inntektskilder', () => {
        const erDuSykmeldt = (bool) => {
            const nokkel = bool ? 'sykepengesoknad.ja' : 'sykepengesoknad.nei';
            const tekst = bool ? 'Ja' : 'Nei';
            return [{
                ledetekst: {
                    nokkel: 'sykepengesoknad.andre-inntektskilder.er-du-sykmeldt-fra-dette.sporsmal',
                    tekst: 'Er du sykmeldt fra dette?',
                },
                svar: [{
                    ledetekst: {
                        nokkel,
                        tekst,
                    },
                    type: 'RADIOKNAPPER',
                    undersporsmal: [],
                }],
            }];
        };

        describe('Når bruker ikke har andre inntektskilder', () => {
            beforeEach(() => {
                skjemasoknad.harAndreInntektskilder = false;
            });

            it('Skal mappe', () => {
                const resultat = mapSkjemasoknadToOppsummeringSoknad(skjemasoknad, sykepengesoknad);
                expect(resultat.soknad[5]).to.deep.equal({
                    type: inntektskilderType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.andre-inntektskilder.janei.sporsmal',
                        tekst: 'Har du andre inntektskilder, eller jobber du for andre enn Olsens Sykkelservice?',
                        verdier: {
                            '%ARBEIDSGIVER%': 'Olsens Sykkelservice',
                        },
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.nei',
                            tekst: 'Nei',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [],
                    }],
                });
            });
        });

        beforeEach(() => {
            deepFreeze(inntektskildetyper);

            const andreInntektskilder = [].concat(inntektskildetyper);

            andreInntektskilder[0] = Object.assign({}, inntektskildetyper[0], {
                avkrysset: true,
                sykmeldt: true,
            });

            andreInntektskilder[1] = Object.assign({}, inntektskildetyper[1], {
                avkrysset: false,
            });

            andreInntektskilder[2] = Object.assign({}, inntektskildetyper[2], {
                avkrysset: false,
                sykmeldt: false,
            });

            andreInntektskilder[3] = Object.assign({}, inntektskildetyper[3], {
                avkrysset: true,
                sykmeldt: false,
            });

            andreInntektskilder[4] = Object.assign({}, inntektskildetyper[4], {
                avkrysset: false,
            });

            andreInntektskilder[andreInntektskilder.length - 1] = Object.assign({}, inntektskildetyper[5], {
                avkrysset: true,
            }); // ANNET

            skjemasoknad.harAndreInntektskilder = true;
            skjemasoknad.andreInntektskilder = andreInntektskilder;
        });

        it('Skal konvertere andreInntektskilder hvis det finnes inntektskilder', () => {
            const soknad = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));

            expect(soknad.soknad[5]).to.deep.equal({
                type: inntektskilderType,
                ledetekst: {
                    nokkel: 'sykepengesoknad.andre-inntektskilder.janei.sporsmal',
                    tekst: 'Har du andre inntektskilder, eller jobber du for andre enn Olsens Sykkelservice?',
                    verdier: {
                        '%ARBEIDSGIVER%': 'Olsens Sykkelservice',
                    },
                },
                svar: [{
                    ledetekst: {
                        nokkel: 'sykepengesoknad.ja',
                        tekst: 'Ja',
                    },
                    type: 'RADIOKNAPPER',
                    undersporsmal: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.andre-inntektskilder.hvilke-inntektskilder.sporsmal',
                            tekst: 'Hvilke andre inntektskilder har du?',
                        },
                        svar: [{
                            ledetekst: {
                                nokkel: 'sykepengesoknad.andre-inntektskilder.ANDRE_ARBEIDSFORHOLD.label',
                                tekst: 'Andre arbeidsforhold',
                            },
                            type: 'CHECKBOX',
                            undersporsmal: erDuSykmeldt(true),
                        }, {
                            ledetekst: {
                                nokkel: 'sykepengesoknad.andre-inntektskilder.JORDBRUKER_FISKER_REINDRIFTSUTOEVER.label',
                                tekst: 'Jordbruker, fisker, reindriftsutøver',
                            },
                            type: 'CHECKBOX',
                            undersporsmal: erDuSykmeldt(false),
                        }, {
                            ledetekst: {
                                nokkel: 'sykepengesoknad.andre-inntektskilder.ANNET.label',
                                tekst: 'Annet',
                            },
                            type: 'CHECKBOX',
                            undersporsmal: [],
                        }],
                    }],
                }],
            });
        });
    });

    describe('utdanning', () => {
        describe('Når bruker ikke har vært i utdanning', () => {
            beforeEach(() => {
                skjemasoknad.utdanning = { underUtdanningISykmeldingsperioden: false };
            });

            it('mapper ikke utdanning om vi ikke har noen aktiviteter', () => {
                skjemasoknad.harGjenopptattArbeidFulltUt = true;
                skjemasoknad.gjenopptattArbeidFulltUtDato = '01.01.2017';

                const soknad = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                const _sporsmalstyper = soknad.soknad.map((sporsmaal) => { return sporsmaal.type; });

                expect(_sporsmalstyper).to.be.an('array').that.does.not.include('UTDANNING');
            });

            it('Skal mappe utdanning', () => {
                const soknad = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                expect(soknad.soknad[6]).to.deep.equal({
                    type: utdanningType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.utdanning.ja-nei.sporsmal-2',
                        verdier: {
                            '%PERIODE%': '1. – 25. januar 2017',
                        },
                        tekst: 'Har du vært under utdanning i løpet av perioden 1. – 25. januar 2017?',
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.nei',
                            tekst: 'Nei',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [],
                    }],
                });
            });

            it('Skal mappe utdanning når søknaden er oppdelt', () => {
                sykepengesoknad.tom = new Date('2017-01-12');
                const soknad = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                expect(soknad.soknad[6]).to.deep.equal({
                    type: utdanningType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.utdanning.ja-nei.sporsmal-2',
                        verdier: {
                            '%PERIODE%': '1. – 12. januar 2017',
                        },
                        tekst: 'Har du vært under utdanning i løpet av perioden 1. – 12. januar 2017?',
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.nei',
                            tekst: 'Nei',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [],
                    }],
                });
            });
        });

        describe('Når bruker har vært i utdanning', () => {
            beforeEach(() => {
                skjemasoknad.utdanning = {
                    underUtdanningISykmeldingsperioden: true,
                    utdanningStartdato: '12.01.2017',
                    erUtdanningFulltidsstudium: false,
                };
            });

            it('Skal mappe utdanning', () => {
                const soknad = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
                expect(soknad.soknad[6]).to.deep.equal({
                    type: utdanningType,
                    ledetekst: {
                        nokkel: 'sykepengesoknad.utdanning.ja-nei.sporsmal-2',
                        verdier: {
                            '%PERIODE%': '1. – 25. januar 2017',
                        },
                        tekst: 'Har du vært under utdanning i løpet av perioden 1. – 25. januar 2017?',
                    },
                    svar: [{
                        ledetekst: {
                            nokkel: 'sykepengesoknad.ja',
                            tekst: 'Ja',
                        },
                        type: 'RADIOKNAPPER',
                        undersporsmal: [{
                            ledetekst: {
                                nokkel: 'sykepengesoknad.utdanning.startdato.sporsmal',
                                tekst: 'Når startet du på utdanningen?',
                            },
                            svar: [{
                                type: 'TEKSTSVAR',
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.dato',
                                    tekst: '12.01.2017',
                                    verdier: {
                                        '%DATO%': '12.01.2017',
                                    },
                                },
                                undersporsmal: [],
                            }],
                        }, {
                            ledetekst: {
                                nokkel: 'sykepengesoknad.utdanning.fulltidsstudium.sporsmal',
                                tekst: 'Er utdanningen et fulltidsstudium?',
                            },
                            svar: [{
                                ledetekst: {
                                    nokkel: 'sykepengesoknad.nei',
                                    tekst: 'Nei',
                                },
                                type: 'RADIOKNAPPER',
                                undersporsmal: [],
                            }],
                        },
                        ],
                    }],
                });
            });
        });
    });

    describe('Forskutterer arbeidsgiver', () => {
        let getForskuttererSporsmal;

        beforeEach(() => {
            getForskuttererSporsmal = (soknad) => {
                return soknad.soknad.filter((spm) => {
                    return spm.type === arbeidsgiverForskuttererType;
                })[0];
            };
        });

        it('Skal mappe om JA', () => {
            skjemasoknad.arbeidsgiverForskutterer = 'JA';
            const soknad = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
            const forskuttererSpm = getForskuttererSporsmal(soknad);
            expect(forskuttererSpm).to.deep.equal({
                type: arbeidsgiverForskuttererType,
                ledetekst: {
                    nokkel: 'sykepengesoknad.forskutterer-arbeidsgiver.sporsmal',
                    tekst: 'Betaler arbeidsgiveren lønnen din når du er syk?',
                },
                svar: [{
                    ledetekst: {
                        tekst: 'Ja',
                        nokkel: 'sykepengesoknad.forskutterer-arbeidsgiver.svar.JA',
                    },
                    type: 'RADIOKNAPPER',
                    undersporsmal: [],
                }],
            });
        });

        it('Skal mappe om NEI', () => {
            skjemasoknad.arbeidsgiverForskutterer = 'NEI';
            const soknad = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
            const forskuttererSpm = getForskuttererSporsmal(soknad);
            expect(forskuttererSpm).to.deep.equal({
                type: arbeidsgiverForskuttererType,
                ledetekst: {
                    nokkel: 'sykepengesoknad.forskutterer-arbeidsgiver.sporsmal',
                    tekst: 'Betaler arbeidsgiveren lønnen din når du er syk?',
                },
                svar: [{
                    ledetekst: {
                        tekst: 'Nei',
                        nokkel: 'sykepengesoknad.forskutterer-arbeidsgiver.svar.NEI',
                    },
                    type: 'RADIOKNAPPER',
                    undersporsmal: [],
                }],
            });
        });

        it('Skal mappe om VET_IKKE', () => {
            skjemasoknad.arbeidsgiverForskutterer = 'VET_IKKE';
            const soknad = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
            const forskuttererSpm = getForskuttererSporsmal(soknad);
            expect(forskuttererSpm).to.deep.equal({
                type: arbeidsgiverForskuttererType,
                ledetekst: {
                    nokkel: 'sykepengesoknad.forskutterer-arbeidsgiver.sporsmal',
                    tekst: 'Betaler arbeidsgiveren lønnen din når du er syk?',
                },
                svar: [{
                    ledetekst: {
                        tekst: 'Vet ikke',
                        nokkel: 'sykepengesoknad.forskutterer-arbeidsgiver.svar.VET_IKKE',
                    },
                    type: 'RADIOKNAPPER',
                    undersporsmal: [],
                }],
            });
        });

        it('Skal mappe om når feltet ikke finnes', () => {
            const soknad = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
            const forskuttererSpm = getForskuttererSporsmal(soknad);
            expect(forskuttererSpm).to.equal(undefined);
        });

        it('Skal mappe om når feltet er null', () => {
            skjemasoknad.arbeidsgiverForskutterer = null;
            const soknad = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
            const forskuttererSpm = getForskuttererSporsmal(soknad);
            expect(forskuttererSpm).to.equal(undefined);
        });

        it('Skal mappe om når feltet er undefined', () => {
            skjemasoknad.arbeidsgiverForskutterer = undefined;
            const soknad = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
            const forskuttererSpm = getForskuttererSporsmal(soknad);
            expect(forskuttererSpm).to.equal(undefined);
        });
    });

    describe('Ansvarserklæring', () => {
        it('Skal mappe om til en sykepengesoknadoppsummeringtilleggstekst', () => {
            const soknad = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
            expect(soknad.vaerKlarOverAt).to.deep.equal({
                ledetekst: {
                    tekst: '<p>Vær klar over dette!</p>',
                    nokkel: 'sykepengesoknad.oppsummering.vaer-klar-over-at',
                },
                type: 'HTML',
            });
        });
    });

    describe('bekreftetKorrektInformasjon', () => {
        it('Skal mappe om til et sporsmal', () => {
            const soknad = mapSkjemasoknadToOppsummeringSoknad(deepFreeze(skjemasoknad), deepFreeze(sykepengesoknad));
            expect(soknad.bekreftetKorrektInformasjon).to.deep.equal({
                ledetekst: null,
                svar: [{
                    ledetekst: {
                        tekst: 'Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.',
                        nokkel: 'sykepengesoknad.oppsummering.bekreft-korrekt-informasjon.label',
                    },
                    type: 'CHECKBOX',
                    undersporsmal: [],
                }],
            });
        });
    });
})
;
