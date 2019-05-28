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
            'soknad.feilmelding.tall-prosent-min-max': 'Prosenten du skrev inn tyder på at du ikke har jobbet mer enn %MIN% %.\n' +
                'Du må enten svare nei på spørsmålet over eller endre prosenten til et tall mellom %MIN% og %MAX%.',
            'soknad.feilmelding.tall-prosent-100': 'Prosenten du skrev inn tyder på at du ikke har jobbet.\n' +
                'Du må enten svare nei på spørsmålet over eller endre prosenten til et tall mellom %MIN% og %MAX%.',
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

        it('Skal klage hvis angitt prosent er lavere enn 1 og tag=HVOR_MYE_PROSENT_VERDI', () => {
            const verdi = parse('0');
            const feilmelding = validerTall(1, 99, 'HVOR_MYE_PROSENT_VERDI', verdi);
            expect(feilmelding).to.equal('Prosenten du skrev inn tyder på at du ikke har jobbet.\n' +
                'Du må enten svare nei på spørsmålet over eller endre prosenten til et tall mellom 1 og 99.');
        });

        it('Skal klage hvis angitt prosent er lavere enn 40 og tag=HVOR_MYE_PROSENT_VERDI', () => {
            const verdi = parse('23');
            const feilmelding = validerTall(40, 99, 'HVOR_MYE_PROSENT_VERDI', verdi);
            expect(feilmelding).to.equal('Prosenten du skrev inn tyder på at du ikke har jobbet mer enn 40 %.\n' +
                'Du må enten svare nei på spørsmålet over eller endre prosenten til et tall mellom 40 og 99.');
        });
    });
});
