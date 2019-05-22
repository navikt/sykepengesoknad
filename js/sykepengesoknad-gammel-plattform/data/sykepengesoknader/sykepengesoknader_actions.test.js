import chai from 'chai';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import * as actions from './sykepengesoknader_actions';
import * as actiontyper from '../../../actions/actiontyper';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('sykepengesoknader_actions', () => {
    let clock;

    beforeEach(() => {
        window = window || {};
        window.APP_SETTINGS = {
            REST_ROOT: 'http://tjenester.nav.no/syforest',
        };
        clock = sinon.useFakeTimers(1484524800000); // 16. januar 2017
    });

    afterEach(() => {
        clock.restore();
    });

    describe('henter', () => {
        it('Skal ha en henterSykepengesoknader()-funksjon som returnerer riktig action', () => {
            expect(actions.henterSykepengesoknader()).to.deep.equal({
                type: actiontyper.HENTER_SYKEPENGESOKNADER,
            });
        });

        it('Skal ha en sykepengesoknaderHentet()-funksjon som returnerer riktig action', () => {
            expect(actions.sykepengesoknaderHentet([{ id: 12345 }])).to.deep.equal({
                type: actiontyper.SYKEPENGESOKNADER_HENTET,
                sykepengesoknader: [{
                    id: 12345,
                }],
            });
        });

        it('Skal ha en hentSykepengesoknaderFeilet()-funksjon som returnerer riktig action', () => {
            expect(actions.hentSykepengesoknaderFeilet()).to.deep.equal({
                type: actiontyper.HENT_SYKEPENGESOKNADER_FEILET,
            });
        });

        it('Skal ha en hentSykepengesoknader()-funksjon som returnerer riktig action', () => {
            expect(actions.hentSykepengesoknader()).to.deep.equal({
                type: actiontyper.HENT_SYKEPENGESOKNADER_FORESPURT,
            });
        });
    });

    describe('innsending', () => {
        it('skal ha en sendSykepengesoknad()-funksjon som returnerer riktig action', () => {
            expect(actions.sendSykepengesoknad({ id: '1' })).to.deep.equal({
                type: actiontyper.SEND_SYKEPENGESOKNAD_FORESPURT,
                sykepengesoknad: { id: '1' },
            });
        });

        it('skal ha en senderSykepengesoknad()-funksjon som returnerer riktig action', () => {
            expect(actions.senderSykepengesoknad()).to.deep.equal({
                type: actiontyper.SENDER_SYKEPENGESOKNAD,
            });
        });

        it('skal ha en sendSykepengesoknadFeilet()-funksjon som returnerer riktig action', () => {
            expect(actions.sendSykepengesoknadFeilet()).to.deep.equal({
                type: actiontyper.SEND_SYKEPENGESOKNAD_FEILET,
            });
        });

        it('skal ha en sykepengesoknadSendt()-funksjon som returnerer riktig action', () => {
            expect(actions.sykepengesoknadSendt('1', {
                id: '1',
                felt: 'felt',
            })).to.deep.equal({
                type: actiontyper.SYKEPENGESOKNAD_SENDT,
                sykepengesoknadsId: '1',
                sykepengesoknad: {
                    id: '1',
                    felt: 'felt',
                },
            });
        });

        it('skal ha en sendSykepengesoknadTilArbeidsgiver()-funksjon som returnerer riktig action', () => {
            expect(actions.sendSykepengesoknadTilArbeidsgiver('1')).to.deep.equal({
                type: actiontyper.SEND_SYKEPENGESOKNAD_TIL_ARBEIDSGIVER_FORESPURT,
                sykepengesoknadsId: '1',
            });
        });

        it('skal ha en sendSykepengesoknadTilNAV()-funksjon som returnerer riktig action', () => {
            expect(actions.sendSykepengesoknadTilNAV('1')).to.deep.equal({
                type: actiontyper.SEND_SYKEPENGESOKNAD_TIL_NAV_FORESPURT,
                sykepengesoknadsId: '1',
            });
        });

        it('skal ha en sykepengesoknadSendtTilNAV()-funksjon som returnerer riktig action', () => {
            expect(actions.sykepengesoknadSendtTilNAV('1', { id: '1' })).to.deep.equal({
                type: actiontyper.SYKEPENGESOKNAD_SENDT_TIL_NAV,
                sykepengesoknadsId: '1',
                sykepengesoknad: { id: '1' },
            });
        });

        it('skal ha en sykepengesoknadSendtTilArbeidsgiver()-funksjon som returnerer riktig action', () => {
            expect(actions.sykepengesoknadSendtTilArbeidsgiver('1', { id: '1' })).to.deep.equal({
                type: actiontyper.SYKEPENGESOKNAD_SENDT_TIL_ARBEIDSGIVER,
                sykepengesoknadsId: '1',
                sykepengesoknad: { id: '1' },
            });
        });

        it('skal ha en sykepengesoknadSendt()-funksjon som returnerer riktig action', () => {
            expect(actions.sykepengesoknadSendt('1', {
                id: '1',
                felt: 'felt',
            })).to.deep.equal({
                type: actiontyper.SYKEPENGESOKNAD_SENDT,
                sykepengesoknadsId: '1',
                sykepengesoknad: {
                    id: '1',
                    felt: 'felt',
                },
            });
        });
    });

    describe('Endring', () => {
        it('Skal ha nødvendige actiontyper', () => {
            expect(actiontyper.START_ENDRING_SYKEPENGESOKNAD_FORESPURT).to.equal('START_ENDRING_SYKEPENGESOKNAD_FORESPURT');
            expect(actiontyper.ENDRING_SYKEPENGESOKNAD_STARTET).to.equal('ENDRING_SYKEPENGESOKNAD_STARTET');
            expect(actiontyper.START_ENDRING_FEILET).to.equal('START_ENDRING_FEILET');
        });

        it('Skal ha en startEndringFeilet()-funksjon som returnerer riktig action', () => {
            expect(actions.startEndringFeilet()).to.deep.equal({
                type: actiontyper.START_ENDRING_FEILET,
            });
        });

        it('Skal ha en startEndringForespurt()-funksjon som returnerer riktig action', () => {
            expect(actions.startEndringForespurt('55')).to.deep.equal({
                type: actiontyper.START_ENDRING_SYKEPENGESOKNAD_FORESPURT,
                sykepengesoknadsId: '55',
            });
        });

        it('Skal ha en endringStartet()-funksjon som returnerer riktig action', () => {
            expect(actions.endringStartet({ id: '44' })).to.deep.equal({
                type: actiontyper.ENDRING_SYKEPENGESOKNAD_STARTET,
                sykepengesoknad: {
                    id: '44',
                },
            });
        });
    });

    describe('Berikelse', () => {
        it('skal ha nødvendige actiontyper', () => {
            expect(actiontyper.SYKEPENGESOKNAD_BERIKELSE_FORESPURT).to.equal('SYKEPENGESOKNAD_BERIKELSE_FORESPURT');
            expect(actiontyper.HENTER_SYKEPENGESOKNAD_BERIKELSE).to.equal('HENTER_SYKEPENGESOKNAD_BERIKELSE');
            expect(actiontyper.SYKEPENGESOKNAD_BERIKELSE_HENTET).to.equal('SYKEPENGESOKNAD_BERIKELSE_HENTET');
            expect(actiontyper.SYKEPENGESOKNAD_BERIKELSE_FEILET).to.equal('SYKEPENGESOKNAD_BERIKELSE_FEILET');
        });

        it('skal ha en hentBerikelse()-funksjon som returnerer riktig action', () => {
            expect(actions.hentBerikelse('55')).to.deep.equal({
                type: actiontyper.SYKEPENGESOKNAD_BERIKELSE_FORESPURT,
                sykepengesoknadsId: '55',
            });
        });

        it('SKal ha en henterBerikelse()-funksjon', () => {
            const t = actions.henterBerikelse();
            expect(t).to.deep.equal({
                type: actiontyper.HENTER_SYKEPENGESOKNAD_BERIKELSE,
            });
        });

        it('skal ha en berikelseHentet()-funksjon som returnerer riktig action', () => {
            expect(actions.berikelseHentet({ forrigeSykeforloepTom: '2017-07-15' }, '44')).to.deep.equal({
                type: actiontyper.SYKEPENGESOKNAD_BERIKELSE_HENTET,
                data: {
                    forrigeSykeforloepTom: '2017-07-15',
                },
                sykepengesoknadsId: '44',
            });
        });

        it('skal ha en hentBerikelseFeilet()-funksjon som returnerer riktig action', () => {
            expect(actions.hentBerikelseFeilet()).to.deep.equal({
                type: actiontyper.SYKEPENGESOKNAD_BERIKELSE_FEILET,
            });
        });
    });

    describe('Avbryte søknad', () => {
        it('Skal ha nødvendige actiontyper', () => {
            expect(actiontyper.AVBRYT_SYKEPENGESOKNAD_FORESPURT).to.equal('AVBRYT_SYKEPENGESOKNAD_FORESPURT');
            expect(actiontyper.AVBRYTER_SYKEPENGESOKNAD).to.equal('AVBRYTER_SYKEPENGESOKNAD');
            expect(actiontyper.SYKEPENGESOKNAD_AVBRUTT).to.equal('SYKEPENGESOKNAD_AVBRUTT');
            expect(actiontyper.AVBRYT_SYKEPENGESOKNAD_FEILET).to.equal('AVBRYT_SYKEPENGESOKNAD_FEILET');
        });

        it('Skal ha en avbrytSoknad()-funksjon som returnerer riktig action', () => {
            expect(actions.avbrytSoknad({ id: 'id' })).to.deep.equal({
                type: actiontyper.AVBRYT_SYKEPENGESOKNAD_FORESPURT,
                sykepengesoknad: { id: 'id' },
            });
        });

        it('Skal ha en avbryterSoknad()-funksjon som returnerer riktig action', () => {
            expect(actions.avbryterSoknad()).to.deep.equal({
                type: actiontyper.AVBRYTER_SYKEPENGESOKNAD,
            });
        });

        it('Skal ha en soknadAvbrutt()-funksjon som returnerer rikig action', () => {
            expect(actions.soknadAvbrutt('55')).to.deep.equal({
                type: actiontyper.SYKEPENGESOKNAD_AVBRUTT,
                sykepengesoknadsId: '55',
            });
        });

        it('Skal ha en avbrytSoknadFeilet()-funksjon som returnerer riktig action', () => {
            expect(actions.avbrytSoknadFeilet()).to.deep.equal({
                type: actiontyper.AVBRYT_SYKEPENGESOKNAD_FEILET,
            });
        });
    });

    describe('Gjenåpne avbrutt søknad', () => {
        it('Skal ha nødvendige actiontyper', () => {
            expect(actiontyper.GJENAPNE_SYKEPENGESOKNAD_FORESPURT).to.equal('GJENAPNE_SYKEPENGESOKNAD_FORESPURT');
            expect(actiontyper.GJENAPNER_SYKEPENGESOKNAD).to.equal('GJENAPNER_SYKEPENGESOKNAD');
            expect(actiontyper.SYKEPENGESOKNAD_GJENAPNET).to.equal('SYKEPENGESOKNAD_GJENAPNET');
            expect(actiontyper.GJENAPNE_SYKEPENGESOKNAD_FEILET).to.equal('GJENAPNE_SYKEPENGESOKNAD_FEILET');
        });

        it('Skal ha en gjenapneSoknad({})-funksjon som returnerer riktig action', () => {
            expect(actions.gjenapneSoknad({ id: '123' })).to.deep.equal({
                type: actiontyper.GJENAPNE_SYKEPENGESOKNAD_FORESPURT,
                sykepengesoknad: { id: '123' },
            });
        });

        it('Skal ha en gjenapnerSoknad()-funksjon som returnerer riktig action', () => {
            expect(actions.gjenapnerSoknad()).to.deep.equal({
                type: actiontyper.GJENAPNER_SYKEPENGESOKNAD,
            });
        });

        it("Skal ha en soknadGjenapnet('123')-funksjon som returnerer riktig action", () => {
            expect(actions.soknadGjenapnet('123')).to.deep.equal({
                type: actiontyper.SYKEPENGESOKNAD_GJENAPNET,
                sykepengesoknadsId: '123',
            });
        });

        it('Skal ha en gjenapneSoknadFeilet()-funksjon som returnerer riktig action', () => {
            expect(actions.gjenapneSoknadFeilet()).to.deep.equal({
                type: actiontyper.GJENAPNE_SYKEPENGESOKNAD_FEILET,
            });
        });
    });
});
