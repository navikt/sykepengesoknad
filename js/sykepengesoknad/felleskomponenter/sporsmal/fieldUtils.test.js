import chai from 'chai';
import { fjernIndexFraTag, formaterEnkeltverdi, formaterFlereVerdier, genererParseForCheckbox, genererParseForEnkeltverdi, genererParseForFlereVerdier } from './fieldUtils';
import { UNCHECKED, CHECKED } from '../../enums/svarEnums';
import { ANDRE_INNTEKTSKILDER, JOBBET_DU_GRADERT } from '../../enums/tagtyper';

const expect = chai.expect;

describe('fieldUtils', () => {
    let parse;

    beforeEach(() => {
        parse = genererParseForEnkeltverdi('1');
    });

    describe('parse', () => {
        it('Skal returnere svar på riktig format når svaret er JA', () => {
            const svar = parse('JA');
            expect(svar).to.deep.equal({
                svarverdier: [{
                    verdi: 'JA',
                }],
            });
        });

        it('Skal returnere svar på riktig format når svaret er NEI', () => {
            const svar = parse('NEI');
            expect(svar).to.deep.equal({
                svarverdier: [{
                    verdi: 'NEI',
                }],
            });
        });

        it('Skal returnere svar på riktig format når svaret er undefined', () => {
            const svar = parse(undefined);
            expect(svar).to.equal(undefined);
        });

        it('Skal returnere svar på riktig format når svaret er tom streng', () => {
            const svar = parse('');
            expect(svar).to.deep.equal({
                svarverdier: [{
                    verdi: '',
                }],
            });
        });

        it('Skal returnere svar på riktig format når svaret er en dato', () => {
            const svar = parse('22.02.2018');
            expect(svar).to.deep.equal({
                svarverdier: [{
                    verdi: '22.02.2018',
                }],
            });
        });

        it('Skal returnere riktig svar når enhet er FOM', () => {
            const parseTimer = genererParseForEnkeltverdi('1');
            const svar = parseTimer('40');
            expect(svar).to.deep.equal({
                svarverdier: [{
                    verdi: '40',
                }],
            });
        });

        it('Skal returnere riktig svar når enhet er TOM', () => {
            const parseFom = genererParseForEnkeltverdi('1');
            const svar = parseFom('40');
            expect(svar).to.deep.equal({
                svarverdier: [{
                    verdi: '40',
                }],
            });
        });

        it('Skal returnere riktig svar når det svares med tom streng', () => {
            const parseTom = genererParseForEnkeltverdi('1');
            const svar = parseTom('');
            expect(svar).to.deep.equal({
                svarverdier: [{
                    verdi: '',
                }],
            });
        });

        it('Skal returnere riktig svar når det svares med undefined', () => {
            const parseTom = genererParseForEnkeltverdi('1');
            const svar = parseTom(undefined);
            expect(svar).to.deep.equal(undefined);
        });
    });

    describe('genererParseForFlereverdier', () => {
        it('Skal returnere svar på riktig format når svaret er JA, NEI', () => {
            parse = genererParseForFlereVerdier();
            const svar = parse(['JA', 'NEI']);
            expect(svar).to.deep.equal({
                svarverdier: [{
                    verdi: 'JA',
                }, {
                    verdi: 'NEI',
                }],
            });
        });
    });

    describe('formaterFlereVerdier', () => {
        it('Skal returnere array av verdier', () => {
            parse = genererParseForFlereVerdier();
            const svar = parse(['JA', 'NEI']);
            const formatertSvar = formaterFlereVerdier(svar);
            expect(formatertSvar).to.deep.equal(['JA', 'NEI']);
        });
    });

    describe('genererParseForCheckbox', () => {
        it('Skal returnere riktig svar når det svares med true', () => {
            const parseCheckbox = genererParseForCheckbox('1');
            const svar = parseCheckbox(true);
            expect(svar).to.deep.equal({
                svarverdier: [{
                    verdi: CHECKED,
                }],
            });
        });

        it('Skal returnere riktig svar når det svares med false', () => {
            const parseCheckbox = genererParseForCheckbox('1');
            const svar = parseCheckbox(false);
            expect(svar).to.deep.equal({
                svarverdier: [{
                    verdi: UNCHECKED,
                }],
            });
        });
    });

    describe('format', () => {
        it('Skal returnere JA når svar lagret i redux-store er JA', () => {
            const svar = parse('JA');
            const formatertVerdi = formaterEnkeltverdi(svar);
            expect(formatertVerdi).to.equal('JA');
        });

        it('Skal returnere JA når svar lagret i redux-store er NEI', () => {
            const svar = parse('NEI');
            const formatertVerdi = formaterEnkeltverdi(svar);
            expect(formatertVerdi).to.equal('NEI');
        });

        it('Skal returnere tom streng når svar lagret i redux-store er undefined', () => {
            const svar = parse(undefined);
            const formatertVerdi = formaterEnkeltverdi(svar);
            expect(formatertVerdi).to.equal('');
        });

        it('Skal returnere tom streng når argument er undefined', () => {
            const formatertVerdi = formaterEnkeltverdi(undefined);
            expect(formatertVerdi).to.equal('');
        });

        it('Skal returnere JA når svar lagret i redux-store er en dato', () => {
            const svar = parse('08.02.1984');
            const formatertVerdi = formaterEnkeltverdi(svar);
            expect(formatertVerdi).to.equal('08.02.1984');
        });

        it('Skal returnere true når lagret svar i redux-store er CHECKED', () => {
            const parseCheckbox = genererParseForCheckbox('1');
            const svar = parseCheckbox(true);
            const formatertSvar = formaterEnkeltverdi(svar);
            expect(formatertSvar).to.equal(true);
        });

        it('Skal returnere false når lagret svar i redux-store er UNCHECKED', () => {
            const parseCheckbox = genererParseForCheckbox('1');
            const svar = parseCheckbox(false);
            const formatertSvar = formaterEnkeltverdi(svar);
            expect(formatertSvar).to.equal(false);
        });

        it('Skal returnere riktig svar når svar lagret i redux-store er flere verdier', () => {
            const svar = genererParseForFlereVerdier()(['ja', 'nei']);
            const formatertVerdi = formaterFlereVerdier(svar);
            expect(formatertVerdi).to.deep.equal(['ja', 'nei']);
        });
    });

    describe('fjernIndexFraTag', () => {
        it('Skal ikke fjerne noe fra tagger uten index', () => {
            expect(fjernIndexFraTag(ANDRE_INNTEKTSKILDER)).to.equal(ANDRE_INNTEKTSKILDER);
        });

        it('Skal fjerne index fra tagger med index = 0', () => {
            expect(fjernIndexFraTag(`${JOBBET_DU_GRADERT}_0`)).to.equal(JOBBET_DU_GRADERT);
        });

        it('Skal fjerne index fra tagger med index = 1', () => {
            expect(fjernIndexFraTag(`${JOBBET_DU_GRADERT}_1`)).to.equal(JOBBET_DU_GRADERT);
        });

        it('Skal fjerne index fra tagger med index = 2', () => {
            expect(fjernIndexFraTag(`${JOBBET_DU_GRADERT}_2`)).to.equal(JOBBET_DU_GRADERT);
        });
    });
});
