import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import validate from './validerFoerDuBegynner';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('validerFoerDuBegynner', () => {
    let values;

    beforeEach(() => {
        values = {};
    });

    it('Skal returnere ansvarBekreftet', () => {
        const res = validate(values);
        expect(typeof res.ansvarBekreftet).to.equal('string');
    });

    it('Skal returnere ansvarBekreftet når ansvarBekreftet er fylt ut', () => {
        values.ansvarBekreftet = true;
        const res = validate(values);
        expect(typeof res.ansvarBekreftet).to.equal('undefined');
    });
});
