import { erSisteSide } from './ettSporsmalPerSideUtils';
import { nySoknadArbeidstaker } from '../../../../test/mock/mockNySoknadArbeidstaker';
import expect from '../../../../test/expect';
import { getNySoknadSelvstendig } from '../../../../test/mock/mockSoknadSelvstendig';


describe('ettSporsmalPerSideUtils', () => {
    describe('erSisteSide', () => {
        it('Skal returnere true når man er på VÆR_KLAR_OVER_AT på en arbeidstaker-søknad', () => {
            expect(erSisteSide(nySoknadArbeidstaker, 9)).to.equal(true);
        });

        it('Skal returnere false når man er på UTDANNING på en arbeidstaker-søknad', () => {
            expect(erSisteSide(nySoknadArbeidstaker, 8)).to.equal(false);
        });

        it('Skal returnere true når man er på VÆR_KLAR_OVER_AT på en søknad for frilansere/selvstendig næringsdrivende', () => {
            expect(erSisteSide(getNySoknadSelvstendig(), 8)).to.equal(true);
        });

        it('Skal returnere true når man er på BEKREFT_OPPLYSNINGER på en søknad for frilansere/selvstendig næringsdrivende', () => {
            expect(erSisteSide(getNySoknadSelvstendig(), 9)).to.equal(true);
        });

        it('Skal returnere false når man er på UTDANNING på en søknad for frilansere/selvstendig næringsdrivende', () => {
            expect(erSisteSide(getNySoknadSelvstendig(), 6)).to.equal(false);
        });
    });
});
