import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import { mapStateToProps } from './GjenapneSoknadContainer';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('GjenapneSykepengesoknadContainer', () => {
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(new Date('2018-04-03').getTime());
    });

    afterEach(() => {
        clock.restore();
    });

    it('Skal returnere vis === true hvis søknad ble opprettet for mindre enn et år siden', () => {
        const state = {
            sykepengesoknader: {},
        };
        const sykepengesoknad = {
            opprettetDato: new Date('2017-04-04'),
        };
        const { vis } = mapStateToProps(state, { sykepengesoknad });
        expect(vis).to.equal(true);
    });

    it('Skal returnere vis === true hvis søknad ble opprettet for nøyaktig ett år siden', () => {
        const state = {
            sykepengesoknader: {},
        };
        const sykepengesoknad = {
            opprettetDato: new Date('2017-04-03'),
        };
        const { vis } = mapStateToProps(state, { sykepengesoknad });
        expect(vis).to.equal(true);
    });

    it('Skal returnere vis === false hvis søknad ble opprettet for mer enn et år siden', () => {
        const state = {
            sykepengesoknader: {},
        };
        const sykepengesoknad = {
            opprettetDato: new Date('2017-04-02'),
        };
        const { vis } = mapStateToProps(state, { sykepengesoknad });
        expect(vis).to.equal(false);
    });
});
