import chai from 'chai';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import * as actions from './brukerinfo_actions';
import * as actiontyper from '../actiontyper';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('brukerinfo_actions', () => {
    beforeEach(() => {
        window.localStorage = {
            setItem: () => {},
        };

        sinon.spy(window.localStorage, 'setItem');
    });

    it('Skal ha en hentBrukerinfo()-funksjon som returnerer riktig action', () => {
        expect(actions.henterBrukerinfo()).to.deep.equal({
            type: actiontyper.HENTER_BRUKERINFO,
        });
    });

    it('Skal ha en hentBrukerinfo()-funksjon', () => {
        expect(typeof actions.hentBrukerinfo).to.equal('function');
    });

    it('Skal ha en hentBrukerinfoFeilet()-function som returnerer riktig action', () => {
        expect(actions.hentBrukerinfoFeilet()).to.deep.equal({
            type: actiontyper.HENT_BRUKERINFO_FEILET,
        });
    });

    it('Skal ha en brukerinfoHentet()-funksjon som returnerer riktig action', () => {
        expect(actions.brukerinfoHentet({
            navn: 'Helge',
            alder: 32,
        })).to.deep.equal({
            type: actiontyper.BRUKERINFO_HENTET,
            data: {
                navn: 'Helge',
                alder: 32,
            },
        });

        expect(actions.brukerinfoHentet()).to.deep.equal({
            type: actiontyper.BRUKERINFO_HENTET,
            data: {},
        });
    });

    it('Skal ha en setArbeidssituasjon()-funksjon som returnerer riktig action()', () => {
        expect(actions.setArbeidssituasjon('MED_ARBEIDSGIVER')).to.deep.equal({
            type: actiontyper.SET_TIDSLINJE_ARBEIDSSITUASJON,
            arbeidssituasjon: 'MED_ARBEIDSGIVER',
        });
    });

    it('Skal ha en sjekkInnlogging()-funksjon som returnerer riktig action', () => {
        expect(actions.sjekkInnlogging()).to.deep.equal({
            type: actiontyper.SJEKK_INNLOGGING_FORESPURT,
        });
    });
});
