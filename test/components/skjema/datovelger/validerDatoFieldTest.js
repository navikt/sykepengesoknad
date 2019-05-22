import chai from 'chai';
import validerDatoField from '../../../../js/components/skjema/datovelger/validerDatoField';

const expect = chai.expect;

describe('validerDatoField', () => {
    it('Skal returnere feilmelding hvis dato ikke er sendt inn', () => {
        const res = validerDatoField();
        expect(res).to.equal('Vennligst fyll ut dato');
    });

    it('Skal returnere Datoen må være på formatet dd.mm.åååå hvis dato er på feil format', () => {
        const s = 'Datoen må være på formatet dd.mm.åååå';
        const res = validerDatoField('olsen');
        const res2 = validerDatoField('22.02.200');
        expect(res).to.equal(s);
        expect(res2).to.equal(s);
    });

    it('Skal si i fra om at datoen er ugyldig hvis datoen er ugyldig', () => {
        const res = validerDatoField('31.11.2018');
        expect(res).to.equal('Datoen er ikke gyldig');
    });

    it('Skal klage hvis datoen er før fra', () => {
        const res = validerDatoField('30.11.2018', {
            fra: new Date('2018-12-01'),
            til: new Date('2018-12-10'),
        });
        expect(res).to.equal('Datoen må være innenfor perioden 1. – 10. desember 2018');
    });

    it('Skal ikke klage hvis datoen er samme dato som fra', () => {
        const res = validerDatoField('01.12.2018', {
            fra: new Date('2018-12-01'),
            til: new Date('2018-12-10'),
        });
        expect(res).to.equal(undefined);
    });

    it('Skal ikke klage hvis datoen er etter fra', () => {
        const res = validerDatoField('02.12.2018', {
            fra: new Date('2018-12-01'),
            til: new Date('2018-12-10'),
        });
        expect(res).to.equal(undefined);
    });

    it('Skal klage hvis datoen er etter til', () => {
        const res = validerDatoField('31.12.2018', {
            fra: new Date('2018-12-01'),
            til: new Date('2018-12-10'),
        });
        expect(res).to.equal('Datoen må være innenfor perioden 1. – 10. desember 2018');
    });

    it('Skal ikke klage hvis datoen er samme dato som til', () => {
        const res = validerDatoField('10.12.2018', {
            fra: new Date('2018-12-01'),
            til: new Date('2018-12-10'),
        });
        expect(res).to.equal(undefined);
    });

    it('Skal klage hvis datoen er etter til hvis bare til er oppgitt', () => {
        const res = validerDatoField('12.12.2018', {
            til: new Date('2018-12-11'),
        });
        expect(res).to.equal('Datoen må være før 11. desember 2018');
    });

    it('Skal ikke klage hvis datoen er samme dato som til hvis bare til er oppgitt', () => {
        const res = validerDatoField('11.12.2018', {
            til: new Date('2018-12-11'),
        });
        expect(res).to.equal(undefined);
    });

    it('Skal ikke klage hvis datoen er før til hvis bare til er oppgitt', () => {
        const res = validerDatoField('10.12.2018', {
            til: new Date('2018-12-11'),
        });
        expect(res).to.equal(undefined);
    });

    it('Skal klage hvis datoen er før fra hvis bare fra er oppgitt', () => {
        const res = validerDatoField('10.12.2018', {
            fra: new Date('2018-12-11'),
        });
        expect(res).to.equal('Datoen må være etter 11. desember 2018');
    });

    it('Skal ikke klage hvis datoen er samme dag som fra hvis bare fra er oppgitt', () => {
        const res = validerDatoField('11.12.2018', {
            fra: new Date('2018-12-11'),
        });
        expect(res).to.equal(undefined);
    });

    it('Skal ikke klage hvis datoen er etter fra hvis bare fra er oppgitt', () => {
        const res = validerDatoField('12.12.2018', {
            fra: new Date('2018-12-11'),
        });
        expect(res).to.equal(undefined);
    });

    it('Skal ikke klage hvis tidligsteFom === senesteTom og oppgitt dato === tidligsteFom', () => {
        const res = validerDatoField('15.07.2016', {
            fra: new Date('2016-07-15'),
            til: new Date('2017-07-15'),
        });
        expect(res).to.equal(undefined);
    });
});
