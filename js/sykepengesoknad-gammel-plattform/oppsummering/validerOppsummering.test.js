import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import validate from './validerOppsummering';
import { getSoknad } from '../../../test/mock/mockSykepengesoknader';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('SykepengesoknadArbeidstakerOppsummeringSkjema', () => {
    let sendTilFoerDuBegynner;
    let gyldigeVerdier;
    let sykepengesoknad;

    beforeEach(() => {
        sendTilFoerDuBegynner = sinon.spy();
        sykepengesoknad = getSoknad({
            id: '813ada8c-b7e6-496c-b33c-c7547ef10caf',
            status: 'LAGRET',
            opprettetDato: '2017-02-01',
            arbeidsgiver: {
                navn: 'BYGGMESTER BLOM AS',
                orgnummer: '123456789',
                naermesteLeder: null,
            },
            identdato: '2017-02-15',
            ansvarBekreftet: true,
            bekreftetKorrektInformasjon: true,
            arbeidsgiverUtbetalerLoenn: false,
            egenmeldingsperioder: [{
                fom: '2017-02-01',
                tom: '2017-02-01',
            }],
            gjenopptattArbeidFulltUtDato: null,
            ferie: [],
            permisjon: [],
            utenlandsopphold: null,
            aktiviteter: [{
                periode: {
                    fom: '2016-07-15',
                    tom: '2016-07-20',
                },
                grad: 100,
                avvik: null,
            }, {
                periode: {
                    fom: '2016-07-15',
                    tom: '2016-07-20',
                },
                grad: 60,
                avvik: null,
            }, {
                periode: {
                    fom: '2016-07-15',
                    tom: '2016-07-20',
                },
                grad: 60,
                avvik: null,
            }],
            andreInntektskilder: [],
            utdanning: null,
        });
        gyldigeVerdier = {
            id: '813ada8c-b7e6-496c-b33c-c7547ef10caf',
            status: 'LAGRET',
            opprettetDato: '2017-02-01T00:00:00.000Z',
            arbeidsgiver: {
                navn: 'BYGGMESTER BLOM AS',
                orgnummer: '123456789',
                naermesteLeder: null,
            },
            identdato: '2017-02-15T00:00:00.000Z',
            ansvarBekreftet: true,
            bekreftetKorrektInformasjon: true,
            arbeidsgiverUtbetalerLoenn: false,
            egenmeldingsperioder: [{
                fom: '2017-02-01T00:00:00.000Z',
                tom: '2017-02-01T00:00:00.000Z',
            }],
            gjenopptattArbeidFulltUtDato: null,
            ferie: [],
            permisjon: [],
            utenlandsopphold: {
                perioder: [],
            },
            aktiviteter: [{
                periode: {
                    fom: '2016-07-15T00:00:00.000Z',
                    tom: '2016-07-20T00:00:00.000Z',
                },
                grad: 100,
                avvik: {},
                jobbetMerEnnPlanlagt: false,
            }, {
                periode: {
                    fom: '2016-07-15T00:00:00.000Z',
                    tom: '2016-07-20T00:00:00.000Z',
                },
                grad: 60,
                avvik: {},
                jobbetMerEnnPlanlagt: false,
            },
            {
                periode: {
                    fom: '2016-07-15T00:00:00.000Z',
                    tom: '2016-07-20T00:00:00.000Z',
                },
                grad: 60,
                avvik: {},
                jobbetMerEnnPlanlagt: false,
            },
            ],
            andreInntektskilder: {},
            utdanning: {
                underUtdanningISykmeldingsperioden: false,
            },
            bruktEgenmeldingsdagerFoerLegemeldtFravaer: false,
            harGjenopptattArbeidFulltUt: false,
            harHattFeriePermisjonEllerUtenlandsopphold: false,
            harAndreInntektskilder: false,
        };
    });

    describe('Validate', () => {
        it('Skal kalle på sendTilFoerDuBegynner hvis noe på steg 1 er ugyldig', () => {
            const ugyldigeVerdier = Object.assign({}, gyldigeVerdier, {
                ansvarBekreftet: false,
            });
            validate(ugyldigeVerdier, {
                sendTilFoerDuBegynner,
                sykepengesoknad,
            });
            expect(sendTilFoerDuBegynner.calledWith(sykepengesoknad)).to.equal(true);
        });

        it('Skal kalle på sendTilFoerDuBegynner hvis noe på steg 2 er ugyldig', () => {
            delete gyldigeVerdier.harGjenopptattArbeidFulltUt;
            validate(gyldigeVerdier, {
                sendTilFoerDuBegynner,
                sykepengesoknad,
            });
            expect(sendTilFoerDuBegynner.calledWith(sykepengesoknad)).to.equal(true);
        });

        it('Skal kalle på sendTilFoerDuBegynner hvis noe på steg 3 er ugyldig', () => {
            delete gyldigeVerdier.harAndreInntektskilder;
            validate(gyldigeVerdier, {
                sendTilFoerDuBegynner,
                sykepengesoknad,
            });
            expect(sendTilFoerDuBegynner.calledWith(sykepengesoknad)).to.equal(true);
        });

        it('Skal ikke kalle på sendTilFoerDuBegynner alt er gyldig', () => {
            validate(gyldigeVerdier, {
                sendTilFoerDuBegynner,
                sykepengesoknad,
            });
            expect(sendTilFoerDuBegynner.called).to.equal(false);
        });

        it('Skal ikke kreve at arbeidsgiverForskutterer er satt hvis visForskutteringssporsmal er false', () => {
            const res = validate(gyldigeVerdier, {
                sendTilFoerDuBegynner,
                visForskutteringssporsmal: false,
                sykepengesoknad,
            });
            expect(res).to.deep.equal({});
        });

        it('Skal kreve at arbeidsgiverForskutterer er satt hvis visForskutteringssporsmal er true', () => {
            const res = validate(gyldigeVerdier, {
                sendTilFoerDuBegynner,
                visForskutteringssporsmal: true,
                sykepengesoknad,
            });
            expect(res).to.deep.equal({
                arbeidsgiverForskutterer: 'Vennligst svar på om arbeidsgiveren din betaler lønnen når du er syk',
            });
        });

        it('Skal ikke klage hvis arbeidsgiverForskutterer er satt hvis visForskutteringssporsmal er true', () => {
            const res = validate(Object.assign({}, gyldigeVerdier, {
                arbeidsgiverForskutterer: 'JA',
            }), {
                sendTilFoerDuBegynner,
                visForskutteringssporsmal: true,
                sykepengesoknad,
            });
            expect(res).to.deep.equal({});
        });
    });
});
