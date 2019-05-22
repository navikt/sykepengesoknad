import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import * as actions from './dineSykmeldingerActions';
import * as actiontyper from '../../../actions/actiontyper';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('dineSykmeldinger_actions', () => {
    beforeEach(() => {
        window = window || {};
        window.APP_SETTINGS = {
            REST_ROOT: 'http://tjenester.nav.no/syforest',
        };
    });

    it('Skal ha en henterDineSykmeldinger()-funksjon som returnerer riktig action', () => {
        expect(actions.henterDineSykmeldinger()).to.deep.equal({
            type: actiontyper.HENTER_DINE_SYKMELDINGER,
        });
    });

    it('Skal ha en setDineSykmeldinger()-funksjon som returnerer riktig action', () => {
        expect(actions.setDineSykmeldinger([{ id: 12345, navn: 'Helge' }])).to.deep.equal({
            type: actiontyper.SET_DINE_SYKMELDINGER,
            sykmeldinger: [{
                id: 12345, navn: 'Helge',
            }],
        });
    });

    it('Skal ha en hentDineSykmeldingerFeilet()-funksjon som returnerer riktig action', () => {
        expect(actions.hentDineSykmeldingerFeilet()).to.deep.equal({
            type: actiontyper.HENT_DINE_SYKMELDINGER_FEILET,
        });
    });

    it('Skal ha en hentDineSykmeldinger()-funksjon som returnerer riktig action', () => {
        expect(actions.hentDineSykmeldinger()).to.deep.equal({
            type: actiontyper.HENT_DINE_SYKMELDINGER_FORESPURT,
        });
    });

    it('Skal ha en sorterSykmeldinger()-funksjon som returnerer riktig action', () => {
        const res = actions.sorterSykmeldinger('arbeidsgiver', 'tidligere');
        expect(res).to.deep.equal({
            type: actiontyper.SET_SORTERING,
            kriterium: 'arbeidsgiver',
            status: 'tidligere',
        });

        const res2 = actions.sorterSykmeldinger('arbeidsgiver', 'nye');
        expect(res2).to.deep.equal({
            type: actiontyper.SET_SORTERING,
            kriterium: 'arbeidsgiver',
            status: 'nye',
        });
    });
});
