import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import * as utils from './valideringUtils';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('valideringUtils', () => {
    describe('validerPerioder', () => {
        it('Skal returnere null hvis det ikke finnes perioder', () => {
            const res = utils.validerPerioder();
            expect(res).to.equal(null);
        });

        it('Skal klage hvis det finnes tomme perioder', () => {
            const res = utils.validerPerioder([{}]);
            expect(res).to.deep.equal([{
                fom: 'Vennligst fyll ut dato',
                tom: 'Vennligst fyll ut dato',
            }]);
        });

        it('Skal klage hvis det er oppgitt kun én dato', () => {
            const res = utils.validerPerioder([{
                fom: '12.12.2012',
            }]);
            expect(res).to.deep.equal([{
                tom: 'Vennligst fyll ut dato',
            }]);
        });

        it('Skal klage hvis det er oppgitt kun én dato', () => {
            const res = utils.validerPerioder([{
                tom: '12.12.2012',
            }]);
            expect(res).to.deep.equal([{
                fom: 'Vennligst fyll ut dato',
            }]);
        });

        it('Skal klage hvis til-dato er før fra-dato', () => {
            const res = utils.validerPerioder([{
                fom: '12.01.2014',
                tom: '12.12.2012',
            }]);
            expect(res).to.deep.equal([{
                tom: 'Sluttdato må være etter startdato',
            }]);
        });

        it('Skal ikke klage hvis det er fylt ut en gyldig periode', () => {
            const res = utils.validerPerioder([{
                fom: '12.01.2014',
                tom: '12.12.2014',
            }]);
            expect(res).to.equal(null);
        });

        it('Skal ikke klage hvis startdato og sluttdato er samme dato', () => {
            const res = utils.validerPerioder([{
                fom: '12.01.2014',
                tom: '12.01.2014',
            }]);
            expect(res).to.equal(null);
        });

        it('Skal klage hvis datoene er før fra', () => {
            const res = utils.validerPerioder([{
                fom: '12.01.2014',
                tom: '12.01.2014',
            }], {
                fra: new Date('2014-01-13'),
            });
            expect(res).to.deep.equal([{
                fom: 'Datoen må være etter 13. januar 2014',
                tom: 'Datoen må være etter 13. januar 2014',
            }]);
        });

        it('Skal klage hvis datoene er etter til', () => {
            const res = utils.validerPerioder([{
                fom: '12.01.2014',
                tom: '12.01.2014',
            }], {
                til: new Date('2014-01-11'),
            });
            expect(res).to.deep.equal([{
                fom: 'Datoen må være før 11. januar 2014',
                tom: 'Datoen må være før 11. januar 2014',
            }]);
        });

        it('Skal klage hvis datoene er etter til', () => {
            const res = utils.validerPerioder([{
                fom: '12.02.2014',
                tom: '18.02.2014',
            }], {
                fra: new Date('2014-01-08'),
                til: new Date('2014-01-11'),
            });
            expect(res).to.deep.equal([{
                fom: 'Datoen må være innenfor perioden 8. – 11. januar 2014',
                tom: 'Datoen må være innenfor perioden 8. – 11. januar 2014',
            }]);
        });

        it('Skal klage hvis tom-dato er etter til', () => {
            const res = utils.validerPerioder([{
                fom: '12.07.2016',
                tom: '20.07.2016',
            }], {
                til: new Date('2016-07-16'),
            });
            expect(res).to.deep.equal([{
                tom: 'Datoen må være før 16. juli 2016',
            }]);
        });
    });
});
