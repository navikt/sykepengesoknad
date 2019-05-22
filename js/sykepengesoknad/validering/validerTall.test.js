import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { setLedetekster } from '@navikt/digisyfo-npm';
import { genererParseForEnkeltverdi } from '../felleskomponenter/sporsmal/fieldUtils';
import validerTall from './validerTall';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('validerTall', () => {
    let parse;

    beforeEach(() => {
        parse = genererParseForEnkeltverdi();
        setLedetekster({
            'soknad.feilmelding.tall-min-max': 'Vennligst fyll ut et tall mellom %MIN% og %MAX%',
            'soknad.feilmelding.mitt_felt': 'Husk å fylle ut dette',
        });
    });

    describe('validerTall', () => {
        it('Skal klage hvis et felt ikke er fylt ut', () => {
            const verdi = parse();
            const feilmelding = validerTall(1, 20, 'MITT_FELT', verdi);
            expect(feilmelding).to.equal('Husk å fylle ut dette');
        });

        it('Skal klage hvis tallet er for høyt', () => {
            const verdi = parse('21');
            const feilmelding = validerTall(1, 20, 'MITT_FELT', verdi);
            expect(feilmelding).to.equal('Vennligst fyll ut et tall mellom 1 og 20');
        });

        it('Skal klage hvis tallet er for lavt', () => {
            const verdi = parse('0');
            const feilmelding = validerTall(1, 20, 'MITT_FELT', verdi);
            expect(feilmelding).to.equal('Vennligst fyll ut et tall mellom 1 og 20');
        });

        it('Skal ikke klage hvis tallet er gyldig og et number', () => {
            const verdi = parse('3');
            const okmelding = validerTall(1, 20, 'MITT_FELT', verdi);
            expect(okmelding).to.equal(undefined);
        });
    });
});
