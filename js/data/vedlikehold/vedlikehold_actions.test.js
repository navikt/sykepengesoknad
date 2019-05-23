import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import * as actiontyper from '../actiontyper';
import * as actions from './vedlikehold_actions';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('vedlikehold_actions', () => {
    beforeEach(() => {
        window.APP_SETTINGS = {
            REST_ROOT: 'http://tjenester.nav.no/syforest',
        };
    });

    describe('henter', () => {
        it('Skal ha en henterVedlikehold()-funksjon som returnerer riktig action', () => {
            expect(actions.henterVedlikehold()).to.deep.equal({
                type: actiontyper.HENTER_VEDLIKEHOLD,
            });
        });

        it('Skal ha en vedlikeholdHentet()-funksjon som returnerer riktig action', () => {
            expect(actions.vedlikeholdHentet(true)).to.deep.equal({
                type: actiontyper.VEDLIKEHOLD_HENTET,
                data: {
                    vedlikehold: true,
                },
            });
        });

        it('Skal ha en hentVedlikeholdFeilet()-funksjon som returnerer riktig action', () => {
            expect(actions.hentVedlikeholdFeilet()).to.deep.equal({
                type: actiontyper.HENT_VEDLIKEHOLD_FEILET,
            });
        });

        it('Skal ha en hentVedlikehold()-funksjon som returnerer riktig action', () => {
            expect(actions.hentVedlikehold()).to.deep.equal({
                type: actiontyper.HENT_VEDLIKEHOLD_FORESPURT,
            });
        });
    });
});
