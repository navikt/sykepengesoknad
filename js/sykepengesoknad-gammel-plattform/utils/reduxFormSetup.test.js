import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import deepFreeze from 'deep-freeze';
import { inntektskildetyper } from '@navikt/digisyfo-npm';
import { mapAktiviteter } from './sykepengesoknadUtils';
import { mapStateToPropsMedInitialValues, mapStateToProps, mapToInitialValues, andreInntektskilderDefault } from './reduxFormSetup';
import { getParsetSoknad, getSoknad } from '../../../test/mock/mockSykepengesoknader';
import { getSoknadSkjemanavn } from '../../enums/skjemanavn';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('reduxFormSetup', () => {
    let state;
    let ownProps;

    beforeEach(() => {
        state = {
            sykepengesoknader: {
                data: [],
            },
        };
        ownProps = {};
    });

    describe('mapStateToPropsMedInitialValues', () => {
        it('Skal mappe til initielle verdier hvis det er en NY søknad', () => {
            ownProps.sykepengesoknad = getSoknad({
                status: 'NY',
            });
            const props = mapStateToPropsMedInitialValues(state, ownProps);
            expect(props.initialValues.harHattFerie).to.equal(undefined);
        });

        it("Skal mappe til skjemasøknad hvis søknaden har status === 'UTKAST_TIL_KORRIGERING'", () => {
            ownProps.sykepengesoknad = getSoknad({
                status: 'UTKAST_TIL_KORRIGERING',
            });
            const props = mapStateToPropsMedInitialValues(state, ownProps);
            expect(props.initialValues.harHattFerie).to.equal(false);
        });

        it('Skal mappe aktiviteter', () => {
            ownProps.sykepengesoknad = deepFreeze(getSoknad({
                fom: new Date('2016-07-18'),
                tom: new Date('2016-07-24'),
                aktiviteter: [
                    {
                        periode: {
                            fom: new Date('2016-07-15'),
                            tom: new Date('2016-07-20'),
                        },
                        grad: 100,
                        avvik: null,
                    },
                    {
                        periode: {
                            fom: new Date('2016-07-21'),
                            tom: new Date('2016-07-25'),
                        },
                        grad: 60,
                        avvik: null,
                    },
                    {
                        periode: {
                            fom: new Date('2016-07-26'),
                            tom: new Date('2016-07-30'),
                        },
                        grad: 60,
                        avvik: null,
                    },
                ],
            }));
            const props = mapStateToPropsMedInitialValues(state, ownProps);
            const mappetSoknad = mapAktiviteter(ownProps.sykepengesoknad);
            expect(props.sykepengesoknad).to.deep.equal(mappetSoknad);
        });

        it('Skal returnere sykepengesoknad.id som key og et unikt skjemanavn', () => {
            // Dette er for å tvinge re-rendring ved navigering mellom søknader
            const id = 'min-fine-id';
            ownProps.sykepengesoknad = getParsetSoknad({
                id,
            });
            const props = mapStateToPropsMedInitialValues(state, ownProps);
            expect(props.key).to.equal(id);
            expect(props.form).to.equal(getSoknadSkjemanavn('min-fine-id'));
        });
    });

    describe('mapStateToProps', () => {
        it('Skal mappe aktiviteter', () => {
            ownProps.sykepengesoknad = deepFreeze(getSoknad({
                fom: new Date('2016-07-18'),
                tom: new Date('2016-07-24'),
                aktiviteter: [
                    {
                        periode: {
                            fom: new Date('2016-07-15'),
                            tom: new Date('2016-07-20'),
                        },
                        grad: 100,
                        avvik: null,
                    },
                    {
                        periode: {
                            fom: new Date('2016-07-21'),
                            tom: new Date('2016-07-25'),
                        },
                        grad: 60,
                        avvik: null,
                    },
                    {
                        periode: {
                            fom: new Date('2016-07-26'),
                            tom: new Date('2016-07-30'),
                        },
                        grad: 60,
                        avvik: null,
                    },
                ],
            }));
            const props = mapStateToProps(state, ownProps);
            const mappetSoknad = mapAktiviteter(ownProps.sykepengesoknad);
            expect(props.sykepengesoknad).to.deep.equal(mappetSoknad);
        });

        it('Skal returnere sykepengesoknad.id som key og et unikt skjemanavn', () => {
            // Dette er for å tvinge re-rendring ved navigering mellom søknader
            const id = 'min-fine-id';
            ownProps.sykepengesoknad = getParsetSoknad({
                id,
            });
            const props = mapStateToProps(state, ownProps);
            expect(props.key).to.equal(id);
            expect(props.form).to.equal(getSoknadSkjemanavn('min-fine-id'));
        });
    });

    describe('mapToInitialValues', () => {
        let values;
        let arbeidsgiver;

        beforeEach(() => {
            arbeidsgiver = {
                navn: 'Odda Camping',
                orgnummer: '876',
            };
            values = {
                arbeidsgiver,
                andreInntektskilder: [],
                fom: new Date('2016-07-18'),
                tom: new Date('2016-07-24'),
                aktiviteter: [
                    {
                        periode: {
                            fom: new Date('2016-07-15'),
                            tom: new Date('2016-07-20'),
                        },
                        grad: 100,
                        avvik: null,
                    },
                    {
                        periode: {
                            fom: new Date('2016-07-21'),
                            tom: new Date('2016-07-25'),
                        },
                        grad: 60,
                        avvik: null,
                    },
                    {
                        periode: {
                            fom: new Date('2016-07-26'),
                            tom: new Date('2016-07-30'),
                        },
                        grad: 60,
                        avvik: null,
                    },
                ],
            };
        });

        it('Skal sette avvik på aktiviteter', () => {
            const res = mapToInitialValues(deepFreeze(values));
            expect(res.aktiviteter[0].avvik).to.deep.equal({});
            expect(res.aktiviteter[1].avvik).to.deep.equal({});
        });

        it('Skal sette utdanning til tomt objekt', () => {
            const res = mapToInitialValues(deepFreeze(values));
            expect(res.utdanning).to.deep.equal({});
        });

        it('Skal sette andreInntektskilder til defaultverdier', () => {
            const res = mapToInitialValues(deepFreeze(values));
            expect(res.andreInntektskilder).to.deep.equal(andreInntektskilderDefault);
        });

        it('Skal sette utenlandsopphold til objekt med perioder', () => {
            const res = mapToInitialValues(deepFreeze(values));
            expect(res.utenlandsopphold).to.deep.equal({
                perioder: [],
            });
        });

        it('Skal hente ut aktiviteter basert på fom/tom', () => {
            const res = mapToInitialValues(deepFreeze(values));
            expect(res.aktiviteter.length).to.equal(2);
            expect(res.aktiviteter).to.deep.equal([
                {
                    periode: {
                        fom: new Date('2016-07-18'),
                        tom: new Date('2016-07-20'),
                    },
                    grad: 100,
                    avvik: {},
                },
                {
                    periode: {
                        fom: new Date('2016-07-21'),
                        tom: new Date('2016-07-24'),
                    },
                    grad: 60,
                    avvik: {},
                },
            ]);
        });

        describe('Forhåndsutfylling av utdanning', () => {
            const identdato1 = new Date('1984-08-02');
            const identdato3 = new Date('1985-01-01');
            let korrigerendeSoknad;
            let sykepengesoknader;

            beforeEach(() => {
                korrigerendeSoknad = getParsetSoknad({
                    id: 'soknadPt-id-korrigerer',
                    sykmeldingId: 'lang-sykmelding-id',
                    identdato: identdato1,
                    korrigerer: 'soknadPt-id-2',
                    status: 'UTKAST_TIL_KORRIGERING',
                    sendtTilArbeidsgiverDato: new Date('2018-01-15'),
                    egenmeldingsperioder: [],
                    arbeidsgiver,
                });

                sykepengesoknader = [{
                    id: 'soknadPt-id',
                    sykmeldingId: 'sykmelding-id-0',
                    identdato: identdato3,
                    egenmeldingsperioder: [],
                    status: 'NY',
                    arbeidsgiver,
                }, {
                    id: 'soknadPt-id-3',
                    sykmeldingId: 'lang-sykmelding-id',
                    identdato: identdato1,
                    egenmeldingsperioder: [],
                    status: 'NY',
                    arbeidsgiver,
                }, {
                    id: 'soknadPt-id-2',
                    sykmeldingId: 'lang-sykmelding-id',
                    identdato: identdato1,
                    sendtTilArbeidsgiverDato: new Date('2018-01-12'),
                    egenmeldingsperioder: [],
                    andreInntektskilder: [],
                    ferie: [],
                    permisjon: [],
                    utenlandsopphold: null,
                    status: 'SENDT',
                    utdanning: null,
                    arbeidsgiver,
                }, korrigerendeSoknad].map(getParsetSoknad);
            });

            it('Skal ikke forhåndsutfylle utdanning dersom det ikke finnes samme søknader med samme identdato', () => {
                values.identdato = new Date('2018-01-13');
                const res = mapToInitialValues(deepFreeze(values), deepFreeze(sykepengesoknader));
                expect(res.utdanning).to.deep.equal({});
                expect(res._erUtdanningPreutfylt).not.to.equal(true);
            });

            it('Skal ikke forhåndsutfylle når det ikke er oppgitt utdanning i forrige sendte søknad', () => {
                values.id = 'soknadPt-id-3';
                values.identdato = identdato1;
                const res = mapToInitialValues(deepFreeze(values), deepFreeze(sykepengesoknader));
                expect(res.utdanning).to.deep.equal({});
                expect(res._erUtdanningPreutfylt).to.equal(false);
            });

            it('Skal forhåndsutfylle når det er oppgitt utdanning i forrige sendte søknad', () => {
                values.id = 'soknadPt-id-3';
                values.identdato = identdato1;
                sykepengesoknader[2].utdanning = {
                    utdanningStartdato: new Date('2017-04-02'),
                    erUtdanningFulltidsstudium: false,
                };
                const res = mapToInitialValues(deepFreeze(values), deepFreeze(sykepengesoknader));
                expect(res.utdanning).to.deep.equal({
                    utdanningStartdato: '02.04.2017',
                    erUtdanningFulltidsstudium: false,
                    underUtdanningISykmeldingsperioden: true,
                });
                expect(res._erUtdanningPreutfylt).to.equal(true);
            });
        });

        describe('Forhåndsutfylling av inntektskilder', () => {
            const identdato1 = new Date('1984-08-02');
            const identdato3 = new Date('1985-01-01');
            let korrigerendeSoknad;
            let sykepengesoknader;

            beforeEach(() => {
                korrigerendeSoknad = getParsetSoknad({
                    id: 'soknadPt-id-korrigerer',
                    sykmeldingId: 'lang-sykmelding-id',
                    identdato: identdato1,
                    korrigerer: 'soknadPt-id-2',
                    status: 'UTKAST_TIL_KORRIGERING',
                    sendtTilArbeidsgiverDato: new Date('2018-01-15'),
                    egenmeldingsperioder: [],
                    arbeidsgiver,
                });

                sykepengesoknader = [{
                    id: 'soknadPt-id',
                    sykmeldingId: 'sykmelding-id-0',
                    identdato: identdato3,
                    egenmeldingsperioder: [],
                    status: 'NY',
                    arbeidsgiver,
                }, {
                    id: 'soknadPt-id-3',
                    sykmeldingId: 'lang-sykmelding-id',
                    identdato: identdato1,
                    egenmeldingsperioder: [],
                    status: 'NY',
                    arbeidsgiver,
                }, {
                    id: 'soknadPt-id-2',
                    sykmeldingId: 'lang-sykmelding-id',
                    identdato: identdato1,
                    sendtTilArbeidsgiverDato: new Date('2018-01-12'),
                    egenmeldingsperioder: [],
                    status: 'SENDT',
                    andreInntektskilder: [],
                    arbeidsgiver,
                }, korrigerendeSoknad].map(getParsetSoknad);
            });

            it('Skal ikke forhåndsutfylle utdanning dersom det ikke finnes samme søknader med samme identdato', () => {
                values.identdato = new Date('2018-01-13');
                const res = mapToInitialValues(deepFreeze(values), deepFreeze(sykepengesoknader));
                expect(res.andreInntektskilder).to.deep.equal(andreInntektskilderDefault);
                expect(res._erInntektskilderPreutfylt).not.to.equal(true);
            });

            it('Skal forhåndsutfylle når det ikke er oppgitt inntektskilder i forrige sendte søknad', () => {
                values.id = 'soknadPt-id-3';
                values.identdato = identdato1;
                const res = mapToInitialValues(deepFreeze(values), deepFreeze(sykepengesoknader));
                expect(res.andreInntektskilder).to.deep.equal(andreInntektskilderDefault);
                expect(res.harAndreInntektskilder).to.deep.equal(false);
                expect(res._erInntektskilderPreutfylt).to.equal(true);
            });

            it('Skal forhåndsutfylle når det er oppgitt inntektskilder i forrige sendte søknad', () => {
                values.id = 'soknadPt-id-3';
                values.identdato = identdato1;
                sykepengesoknader[2].andreInntektskilder = [{
                    sykmeldt: false,
                    annenInntektskildeType: inntektskildetyper.FRILANSER,
                }];
                const res = mapToInitialValues(deepFreeze(values), deepFreeze(sykepengesoknader));
                expect(res.harAndreInntektskilder).to.equal(true);
                expect(res.andreInntektskilder).to.deep.include({
                    annenInntektskildeType: inntektskildetyper.FRILANSER,
                    avkrysset: true,
                    sykmeldt: false,
                });
                expect(res._erInntektskilderPreutfylt).to.equal(true);
            });
        });

        describe('Forhåndsutfylling av egenmeldingsperioder', () => {
            const identdato1 = new Date('1984-08-02');
            const identdato3 = new Date('1985-01-01');
            let sykepengesoknader;
            let korrigerendeSoknad = {
                id: 'soknadPt-id-korrigerer',
                sykmeldingId: 'lang-sykmelding-id',
                identdato: identdato1,
                korrigerer: 'soknadPt-id-2',
                status: 'UTKAST_TIL_KORRIGERING',
                sendtTilArbeidsgiverDato: new Date('2018-01-15'),
                egenmeldingsperioder: [],
                arbeidsgiver,
            };

            beforeEach(() => {
                korrigerendeSoknad = {
                    id: 'soknadPt-id-korrigerer',
                    sykmeldingId: 'lang-sykmelding-id',
                    identdato: identdato1,
                    korrigerer: 'soknadPt-id-2',
                    status: 'UTKAST_TIL_KORRIGERING',
                    sendtTilArbeidsgiverDato: new Date('2018-01-15'),
                    egenmeldingsperioder: [],
                    arbeidsgiver,
                };

                sykepengesoknader = [{
                    id: 'soknadPt-id',
                    sykmeldingId: 'sykmelding-id-0',
                    identdato: identdato3,
                    egenmeldingsperioder: [],
                    status: 'NY',
                    arbeidsgiver,
                }, {
                    id: 'soknadPt-id-3',
                    sykmeldingId: 'lang-sykmelding-id',
                    identdato: identdato1,
                    egenmeldingsperioder: [],
                    status: 'NY',
                    arbeidsgiver,
                }, {
                    id: 'soknadPt-id-2',
                    sykmeldingId: 'lang-sykmelding-id',
                    identdato: identdato1,
                    sendtTilArbeidsgiverDato: new Date('2018-01-12'),
                    egenmeldingsperioder: [],
                    andreInntektskilder: [],
                    status: 'SENDT',
                    arbeidsgiver,
                }, korrigerendeSoknad].map((s) => {
                    return {
                        ...s,
                        ferie: [],
                        aktiviteter: [],
                        permisjon: [],
                        utenlandsopphold: {
                            perioder: [],
                        },
                    };
                });
            });

            it('Skal ikke forhåndsutfylle dersom det ikke finnes samme søknader med samme identdato', () => {
                values.identdato = new Date('2018-01-13');
                const res = mapToInitialValues(deepFreeze(values), deepFreeze(sykepengesoknader));
                expect(res.bruktEgenmeldingsdagerFoerLegemeldtFravaer).to.equal(undefined);
                expect(res._erEgenmeldingsperioderPreutfylt).not.to.equal(true);
            });

            describe('Dersom det finnes andre søknader som er SENDT og har samme identdato', () => {
                it('Skal forhåndsutfylle når det ikke er oppgitt egenmeldingsperioder i forrige sendte søknad', () => {
                    values.id = 'soknadPt-id-3';
                    values.identdato = identdato1;
                    const res = mapToInitialValues(deepFreeze(values), deepFreeze(sykepengesoknader));
                    expect(res.bruktEgenmeldingsdagerFoerLegemeldtFravaer).to.equal(false);
                    expect(res._erEgenmeldingsperioderPreutfylt).to.equal(true);
                });

                describe('Dersom det finnes en tidligere sendt søknad', () => {
                    beforeEach(() => {
                        sykepengesoknader.push(getParsetSoknad({
                            id: 'soknadPt-id-1',
                            sykmeldingId: 'lang-sykmelding-id',
                            identdato: identdato1,
                            status: 'SENDT',
                            arbeidsgiver,
                            sendtTilArbeidsgiverDato: new Date('2018-01-10'),
                            andreInntektskilder: [],
                            egenmeldingsperioder: [{
                                fom: new Date('2018-01-21'),
                                tom: new Date('2018-01-24'),
                            }, {
                                fom: new Date('2018-01-12'),
                                tom: new Date('2018-01-15'),
                            }],
                        }));
                    });

                    it('Skal ikke endre forhåndsutfylling dersom søknaden korrigerer en annen søknad', () => {
                        values = {
                            ...values,
                            ...korrigerendeSoknad,
                        };

                        const res = mapToInitialValues(deepFreeze(values), deepFreeze(sykepengesoknader));
                        expect(res.egenmeldingsperioder).to.deep.equal([]);
                        expect(res._erEgenmeldingsperioderPreutfylt).not.to.equal(true);
                    });

                    it('Skal forhåndsutfylle bruktEgenmeldingsdagerFoerLegemeldtFravaer når det er oppgitt egenmeldingsperioder i forrige søknad', () => {
                        values.id = 'soknadPt-id-3';
                        values.identdato = identdato1;
                        const res = mapToInitialValues(deepFreeze(values), deepFreeze(sykepengesoknader));
                        expect(res.bruktEgenmeldingsdagerFoerLegemeldtFravaer).to.equal(true);
                        expect(res.egenmeldingsperioder).to.deep.equal([{
                            fom: '12.01.2018',
                            tom: '15.01.2018',
                        }, {
                            fom: '21.01.2018',
                            tom: '24.01.2018',
                        }]);
                        expect(res._erEgenmeldingsperioderPreutfylt).to.equal(true);
                    });

                    it('Skal forhåndsutfylle bruktEgenmeldingsdagerFoerLegemeldtFravaer med info fra forrige søknad for denne arbeidsgiveren', () => {
                        const soknad = sykepengesoknader.pop();
                        sykepengesoknader.push({
                            id: 'soknadPt-id-annen-arbeidsgiver',
                            sykmeldingId: 'lang-sykmelding-id',
                            identdato: identdato1,
                            arbeidsgiver: {
                                navn: 'Oslo Bad og Rør',
                                orgnummer: '12345678',
                            },
                            status: 'SENDT',
                            sendtTilArbeidsgiverDato: new Date('2018-01-10'),
                            egenmeldingsperioder: [{
                                fom: new Date('2018-01-22'),
                                tom: new Date('2018-01-24'),
                            }, {
                                fom: new Date('2018-01-12'),
                                tom: new Date('2018-01-14'),
                            }],
                        });
                        sykepengesoknader.push(soknad);
                        values.id = 'soknadPt-id-3';
                        values.identdato = identdato1;
                        const res = mapToInitialValues(deepFreeze(values), deepFreeze(sykepengesoknader));
                        expect(res.bruktEgenmeldingsdagerFoerLegemeldtFravaer).to.equal(true);
                        expect(res.egenmeldingsperioder).to.deep.equal([{
                            fom: '12.01.2018',
                            tom: '15.01.2018',
                        }, {
                            fom: '21.01.2018',
                            tom: '24.01.2018',
                        }]);
                        expect(res._erEgenmeldingsperioderPreutfylt).to.equal(true);
                    });
                });
            });
        });
    });
});
