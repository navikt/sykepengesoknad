import { FERIE, FERIE_V2 } from '../../enums/tagtyper';
import expect from '../../../../test/expect';
import { harHjelpetekst } from './SporsmalHjelpetekst';

describe('SporsmalHjelpetekst', () => {
    describe('harHjelpetekst', () => {
        it('Skal returnere true for FERIE_2 når vi har en arbeidstaker-søknad med ferie-spørsmål som hovedspørsmål', () => {
            const tag = FERIE_V2;
            expect(harHjelpetekst(tag)).to.equal(true);
        });

        it('Skal returnere false for FERIE når vi har en arbeidstaker-søknad med ferie-spørsmål som underspørsmål', () => {
            const tag = FERIE;
            expect(harHjelpetekst(tag)).to.equal(false);
        });
    });
});
