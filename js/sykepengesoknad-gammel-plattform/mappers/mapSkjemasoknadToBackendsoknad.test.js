import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import deepFreeze from 'deep-freeze';
import { inntektskildetyper } from '../aktiviteter-i-sykmeldingsperioden/AndreInntektskilder';
import { getSoknad } from '../../../test/mock/mockSykepengesoknader';
import mapSkjemasoknadToBackendsoknad from './mapSkjemasoknadToBackendsoknad';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('mapSkjemasoknadToBackendsoknad', () => {
    let sykepengesoknad;

    beforeEach(() => {
        sykepengesoknad = getSoknad();
        sykepengesoknad.aktiviteter[0] = Object.assign({}, sykepengesoknad.aktiviteter[0], {
            jobbetMerEnnPlanlagt: true,
            avvik: {
                enhet: 'prosent',
                arbeidsgrad: '80',
                arbeidstimerNormalUke: '37,5',
            },
        });
        sykepengesoknad.permisjon = [{
            fom: '12.01.2017',
            tom: '18.01.2017',
        }];
        sykepengesoknad.ferie = [{
            fom: '12.02.2017',
            tom: '18.02.2017',
        }];
        sykepengesoknad.utenlandsopphold = {
            perioder: [{
                fom: '12.03.2017',
                tom: '18.03.2017',
            }],
        };

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
            avkrysset: false,
        });

        andreInntektskilder[4] = Object.assign({}, inntektskildetyper[4], {
            avkrysset: false,
        });

        sykepengesoknad.andreInntektskilder = andreInntektskilder;

        sykepengesoknad.utdanning = {};

        sykepengesoknad.gjenopptattArbeidFulltUtDato = '20.01.2017';
        sykepengesoknad.egenmeldingsperioder = [{
            fom: '12.01.2017',
            tom: '15.01.2017',
        }];
        sykepengesoknad = Object.assign({}, sykepengesoknad, {
            bruktEgenmeldingsdagerFoerLegemeldtFravaer: true,
            harGjenopptattArbeidFulltUt: true,
            harHattFeriePermisjonEllerUtenlandsopphold: true,
            harHattFerie: true,
            harHattPermisjon: true,
            harHattUtenlandsopphold: true,
            utenlandsoppholdSoktOmSykepenger: true,
            harAndreInntektskilder: true,
            _erOppdelt: true,
        });
    });

    describe('egenmeldingsperioder', () => {
        it('Skal konvertere egenmeldingsperioder hvis bruktEgenmeldingsdagerFoerLegemeldtFravaer = true', () => {
            sykepengesoknad.bruktEgenmeldingsdagerFoerLegemeldtFravaer = true;
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
            expect(soknad.egenmeldingsperioder).to.deep.equal([{
                fom: new Date('2017-01-12'),
                tom: new Date('2017-01-15'),
            }]);
        });
        it('Skal sette egenmeldingsperioder til null hvis bruktEgenmeldingsdagerFoerLegemeldtFravaer = false', () => {
            sykepengesoknad.bruktEgenmeldingsdagerFoerLegemeldtFravaer = false;
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
            expect(soknad.egenmeldingsperioder).to.deep.equal([]);
        });
    });

    describe('gjenopptattArbeidFulltUtDato', () => {
        it('Skal konvertere gjenopptattArbeidFulltUtDato hvis harGjenopptattArbeidFulltUt = true', () => {
            sykepengesoknad.harGjenopptattArbeidFulltUt = true;
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
            expect(soknad.gjenopptattArbeidFulltUtDato.getTime()).to.deep.equal(new Date('2017-01-20').getTime());
        });

        it('Skal sette gjenopptattArbeidFulltUtDato til null hvis harGjenopptattArbeidFulltUt = false', () => {
            sykepengesoknad.harGjenopptattArbeidFulltUt = false;
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
            expect(soknad.gjenopptattArbeidFulltUtDato).to.deep.equal(null);
        });
    });

    describe('Ferie, permisjon eller utenlandsopphold', () => {
        it('Skal sette ferie, permisjon og utenlandsopphold til tom dersom harHattFeriePermisjonEllerUtenlandsopphold er false', () => {
            sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = false;
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
            expect(soknad.ferie).to.deep.equal([]);
            expect(soknad.utenlandsopphold).to.equal(null);
            expect(soknad.permisjon).to.deep.equal([]);
        });

        describe('Ferie', () => {
            it('Skal parse datofelter i ferie', () => {
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                sykepengesoknad.harHattFerie = true;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.ferie[0].fom.getTime()).to.deep.equal(new Date('2017-02-12').getTime());
                expect(soknad.ferie[0].tom.getTime()).to.deep.equal(new Date('2017-02-18').getTime());
            });

            it('Skal ikke parse datofelter i ferie dersom harHattFerie = false', () => {
                sykepengesoknad.harHattFerie = false;
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.ferie).to.deep.equal([]);
            });

            it('Skal ikke parse datofelter i ferie dersom harHattFeriePermisjonEllerUtenlandsopphold = false', () => {
                sykepengesoknad.harHattFerie = true;
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = false;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.ferie).to.deep.equal([]);
            });

            it('Skal ikke parse datofelter i ferie dersom harHattFerie = false && harHattFeriePermisjonEllerUtenlandsopphold = false', () => {
                sykepengesoknad.harHattFerie = false;
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = false;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.ferie).to.deep.equal([]);
            });
        });

        describe('Permisjon', () => {
            it('Skal parse datofelter i permisjon', () => {
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                sykepengesoknad.harHattPermisjon = true;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.permisjon[0].fom.getTime()).to.deep.equal(new Date('2017-01-12').getTime());
                expect(soknad.permisjon[0].tom.getTime()).to.deep.equal(new Date('2017-01-18').getTime());
            });

            it('Skal ikke parse datofelter i permisjon dersom harHattPermisjon = false', () => {
                sykepengesoknad.harHattPermisjon = false;
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.permisjon).to.deep.equal([]);
            });

            it('Skal ikke parse datofelter i permisjon dersom harHattFeriePermisjonEllerUtenlandsopphold = false', () => {
                sykepengesoknad.harHattPermisjon = true;
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = false;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.permisjon).to.deep.equal([]);
            });

            it('Skal ikke parse datofelter i permisjon dersom harHattPermisjon = false && harHattFeriePermisjonEllerUtenlandsopphold = false', () => {
                sykepengesoknad.harHattPermisjon = false;
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = false;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.permisjon).to.deep.equal([]);
            });
        });

        describe('Utenlandsopphold', () => {
            it('Skal parse datofelter i utenlandsopphold', () => {
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                sykepengesoknad.harHattUtenlandsopphold = true;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.utenlandsopphold.perioder[0].fom.getTime()).to.deep.equal(new Date('2017-03-12').getTime());
                expect(soknad.utenlandsopphold.perioder[0].tom.getTime()).to.deep.equal(new Date('2017-03-18').getTime());
            });

            it('Skal parse soektOmSykepengerIPerioden når soektOmSykepengerIPerioden = true', () => {
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                sykepengesoknad.harHattUtenlandsopphold = true;
                sykepengesoknad.utenlandsopphold.soektOmSykepengerIPerioden = true;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.utenlandsopphold.soektOmSykepengerIPerioden).to.equal(true);
            });

            it('Skal ikke parse soektOmSykepengerIPerioden når dette spørsmålet ikke er stilt pga oppholdet er i en helg, selv om soektOmSykepengerIPerioden = true', () => {
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                sykepengesoknad.harHattUtenlandsopphold = true;
                sykepengesoknad.utenlandsopphold.soektOmSykepengerIPerioden = true;
                sykepengesoknad.utenlandsopphold.perioder = [{
                    fom: '31.03.2018',
                    tom: '01.04.2018',
                }];
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.utenlandsopphold.soektOmSykepengerIPerioden).to.equal(undefined);
            });

            it('Skal parse soektOmSykepengerIPerioden når soektOmSykepengerIPerioden = false', () => {
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                sykepengesoknad.harHattUtenlandsopphold = true;
                sykepengesoknad.utenlandsopphold.soektOmSykepengerIPerioden = false;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.utenlandsopphold.soektOmSykepengerIPerioden).to.equal(false);
            });

            it('Skal ikke parse datofelter i utenlandsopphold dersom harHattUtenlandsopphold = false', () => {
                sykepengesoknad.harHattUtenlandsopphold = false;
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = true;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.utenlandsopphold).to.equal(null);
            });

            it('Skal ikke parse datofelter i utenlandsopphold dersom harHattFeriePermisjonEllerUtenlandsopphold = false', () => {
                sykepengesoknad.harHattUtenlandsopphold = true;
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = false;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.utenlandsopphold).to.equal(null);
            });

            it('Skal ikke parse datofelter i utenlandsopphold dersom harHattUtenlandsopphold = false && harHattFeriePermisjonEllerUtenlandsopphold = false', () => {
                sykepengesoknad.harHattUtenlandsopphold = false;
                sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = false;
                const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
                expect(soknad.utenlandsopphold).to.equal(null);
            });
        });
    });

    describe('andreInntektskilder', () => {
        it('Skal konvertere andreInntektskilder hvis det finnes inntektskilder', () => {
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
            expect(soknad.andreInntektskilder).to.deep.equal([{
                annenInntektskildeType: 'ANDRE_ARBEIDSFORHOLD',
                sykmeldt: true,
            }]);
        });

        it('Skal ikke konvertere andreInntektskilder hvis andreInntektskilder === default', () => {
            const _sykepengesoknad = Object.assign({}, sykepengesoknad, {
                andreInntektskilder: inntektskildetyper,
            });
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(_sykepengesoknad));
            expect(soknad.andreInntektskilder).to.deep.equal([]);
        });
    });

    describe('Aktiviteter', () => {
        it('Skal sette avvik til null hvis jobbetMerEnnPlanlagt === false', () => {
            sykepengesoknad.aktiviteter[0].jobbetMerEnnPlanlagt = false;
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
            expect(soknad.aktiviteter[0].avvik).to.equal(null);
        });

        it('Skal ikke sette avvik til null, men fjerne enhet, hvis jobbetMerEnnPlanlagt === true og enhet === prosent', () => {
            sykepengesoknad.aktiviteter[0].avvik = {
                enhet: 'prosent',
                arbeidsgrad: '80',
                arbeidstimerNormalUke: '37,5',
            };
            sykepengesoknad.aktiviteter[0].jobbetMerEnnPlanlagt = true;
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
            expect(soknad.aktiviteter[0].avvik).to.deep.equal({
                arbeidsgrad: 80,
                arbeidstimerNormalUke: 37.5,
            });
        });

        it('Skal beregne arbeidsgrad hvis jobbetMerEnnPlanlagt === true og enhet === timer', () => {
            sykepengesoknad.aktiviteter[0].avvik = {
                periode: {
                    fom: new Date('2017-01-20'),
                    tom: new Date('2017-01-30'),
                },
                enhet: 'timer',
                timer: '55',
                arbeidstimerNormalUke: '37,5',
            };
            sykepengesoknad.harHattFeriePermisjonEllerUtenlandsopphold = false;
            sykepengesoknad.aktiviteter[0].jobbetMerEnnPlanlagt = true;
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
            expect(soknad.aktiviteter[0].avvik).to.deep.equal({
                timer: 55,
                arbeidstimerNormalUke: 37.5,
                beregnetArbeidsgrad: 73,
            });
        });

        it('Skal fjerne jobbetMerEnnPlanlagt', () => {
            sykepengesoknad.aktiviteter[0].jobbetMerEnnPlanlagt = true;
            sykepengesoknad.aktiviteter[1].jobbetMerEnnPlanlagt = false;
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
            expect(Object.prototype.hasOwnProperty.call(soknad.aktiviteter[0], 'jobbetMerEnnPlanlagt')).to.equal(false);
            expect(Object.prototype.hasOwnProperty.call(soknad.aktiviteter[1], 'jobbetMerEnnPlanlagt')).to.equal(false);
        });

        it('Skal beholde aktivitetens ID', () => {
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
            expect(soknad.aktiviteter[0].id).to.equal(sykepengesoknad.aktiviteter[0].id);
            expect(soknad.aktiviteter[1].id).to.equal(sykepengesoknad.aktiviteter[1].id);
        });
    });

    describe('utdanning', () => {
        beforeEach(() => {
            sykepengesoknad.utdanning = {
                underUtdanningISykmeldingsperioden: true,
                utdanningStartdato: '12.01.2017',
                erUtdanningFulltidsstudium: false,
            };
        });

        it('Skal ikke fjerne utdanningsdata hvis underUtdanningISykmeldingsperioden er checked', () => {
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
            expect(soknad.utdanning.underUtdanningISykmeldingsperioden).to.equal(undefined);
            expect(soknad.utdanning.utdanningStartdato.getTime()).to.equal(new Date('2017-01-12').getTime());
            expect(soknad.utdanning.erUtdanningFulltidsstudium).to.equal(false);
        });

        it('Skal fjerne utdanningsdata hvis underUtdanningISykmeldingsperioden er false', () => {
            sykepengesoknad.utdanning.underUtdanningISykmeldingsperioden = false;
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
            expect(soknad.utdanning).to.equal(null);
        });
    });

    describe('Felter som bare finnes i front-end og skal fjernes', () => {
        let soknad;

        beforeEach(() => {
            soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad));
        });

        it('Skal fjerne bruktEgenmeldingsdagerFoerLegemeldtFravaer', () => {
            expect(soknad).not.to.have.property('bruktEgenmeldingsdagerFoerLegemeldtFravaer');
        });

        it('Skal fjerne harGjenopptattArbeidFulltUt', () => {
            expect(soknad).not.to.have.property('harGjenopptattArbeidFulltUt');
        });

        it('Skal fjerne harHattFeriePermisjonEllerUtenlandsopphold', () => {
            expect(soknad).not.to.have.property('harHattFeriePermisjonEllerUtenlandsopphold');
        });

        it('Skal fjerne harHattFerie', () => {
            expect(soknad).not.to.have.property('harHattFerie');
        });

        it('Skal fjerne harHattPermisjon', () => {
            expect(soknad).not.to.have.property('harHattPermisjon');
        });

        it('Skal fjerne harHattUtenlandsopphold', () => {
            expect(soknad).not.to.have.property('harHattUtenlandsopphold');
        });

        it('Skal fjerne utenlandsoppholdSoktOmSykepenger', () => {
            expect(soknad).not.to.have.property('utenlandsoppholdSoktOmSykepenger');
        });

        it('Skal fjerne harAndreInntektskilder', () => {
            expect(soknad).not.to.have.property('harAndreInntektskilder');
        });

        it('Skal fjerne _erOppdelt', () => {
            expect(soknad).not.to.have.property('_erOppdelt');
        });
    });

    describe('arbeidsgiverForskutterer', () => {
        it('Returnerer arbeidsgiverForskutterer hvis visForskutteringssporsmal === true', () => {
            sykepengesoknad.arbeidsgiverForskutterer = 'VET_IKKE';
            const soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(sykepengesoknad), {
                visForskutteringssporsmal: true,
            });
            expect(soknad.arbeidsgiverForskutterer).to.equal('VET_IKKE');
        });
    });

    describe('Mapper mellom tall og tekst i avvik', () => {
        const soknad = Object.assign({}, getSoknad(), {
            utdanning: {
                underUtdanningISykmeldingsperioden: false,
            },
        });

        it('mapper avvik med timer', () => {
            const aktiviteter = [
                {
                    periode: {
                        fom: new Date('2016-07-25T00:00:00.000Z'),
                        tom: new Date('2016-07-30T00:00:00.000Z'),
                    },
                    grad: 100,
                    avvik: {
                        enhet: 'timer',
                        arbeidsgrad: null,
                        timer: '11',
                        arbeidstimerNormalUke: '12,5',
                        beregnetArbeidsgrad: '12',
                    },
                    jobbetMerEnnPlanlagt: true,
                },
            ];

            const _soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(Object.assign({}, soknad, { aktiviteter })));
            expect(_soknad.aktiviteter[0].avvik).to.deep.equal({
                timer: 11,
                arbeidstimerNormalUke: 12.5,
                beregnetArbeidsgrad: 88,
            });
        });

        it('mapper avvik med prosent', () => {
            const aktiviteter = [
                {
                    periode: {
                        fom: '2016-07-15T00:00:00.000Z',
                        tom: '2016-07-20T00:00:00.000Z',
                    },
                    grad: 100,
                    avvik: {
                        enhet: 'prosent',
                        arbeidsgrad: '40',
                        arbeidstimerNormalUke: '12,5',
                    },
                    jobbetMerEnnPlanlagt: true,
                },
            ];
            const _soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(Object.assign({}, soknad, { aktiviteter })));
            expect(_soknad.aktiviteter[0].avvik).to.deep.equal({
                arbeidsgrad: 40,
                arbeidstimerNormalUke: 12.5,
            });
        });

        it('kutter aktivitet og beregner riktig arbeidsgrad ved gjenopptattdato', () => {
            const aktiviteter = [
                {
                    periode: {
                        fom: new Date('2018-10-01'),
                        tom: new Date('2018-10-10'),
                    },
                    grad: 100,
                    avvik: {
                        enhet: 'timer',
                        timer: '5',
                        arbeidstimerNormalUke: '40',
                    },
                    jobbetMerEnnPlanlagt: true,
                },
            ];

            const _soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(Object.assign({}, soknad, {
                aktiviteter,
                harGjenopptattArbeidFulltUt: true,
                gjenopptattArbeidFulltUtDato: '09.10.2018',
            })));

            expect(_soknad.aktiviteter[0].avvik).to.deep.equal({
                beregnetArbeidsgrad: 10,
                arbeidstimerNormalUke: 40,
                timer: 5,
            });
        });

        it('kutter andre inntektskilder om bruker trykker ja, og så nei', () => {
            const _soknad = mapSkjemasoknadToBackendsoknad(deepFreeze(Object.assign({}, soknad, {
                harAndreInntektskilder: false,
                andreInntektskilder: [
                    { annenInntektskildeType: 'ANDRE_ARBEIDSFORHOLD', avkrysset: true, sykmeldt: true },
                    { annenInntektskildeType: 'SELVSTENDIG_NAERINGSDRIVENDE' },
                    { annenInntektskildeType: 'SELVSTENDIG_NAERINGSDRIVENDE_DAGMAMMA' },
                    { annenInntektskildeType: 'JORDBRUKER_FISKER_REINDRIFTSUTOEVER' },
                    { annenInntektskildeType: 'FRILANSER' },
                    { annenInntektskildeType: 'ANNET' },
                ],
            })));

            expect(_soknad.andreInntektskilder).to.deep.equal([]);
        });
    });
});
