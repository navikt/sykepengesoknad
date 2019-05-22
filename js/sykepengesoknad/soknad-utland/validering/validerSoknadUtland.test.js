import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { setLedetekster } from '@navikt/digisyfo-npm';
import { getSoknadUtland } from '../../../../test/mock/mockSoknadUtland';
import { ledeteksterUtland } from '../../../../test/mock/mockLedetekster';
import { genererParseForCheckbox, genererParseForEnkeltverdi, genererParseForFlereVerdier } from '../../felleskomponenter/sporsmal/fieldUtils';
import validerSoknadUtland from './validerSoknadUtland';
import {
    ARBEIDSGIVER,
    BEKREFT_OPPLYSNINGER_UTLAND, FERIE,
    LAND,
    PERIODEUTLAND,
    SYKMELDINGSGRAD,
} from '../../enums/tagtyper';
import { beregnFeilmeldingstekstFraTag } from '../../validering/validerSporsmal';
import { JA, NEI } from '../../enums/svarEnums';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('validerSoknadUtland', () => {
    let parseCheckbox;
    let parseEnkeltverdi;
    let parseFlereVerdier;
    let soknad;

    beforeEach(() => {
        parseCheckbox = genererParseForCheckbox();
        parseEnkeltverdi = genererParseForEnkeltverdi();
        parseFlereVerdier = genererParseForFlereVerdier();
        soknad = getSoknadUtland();
        setLedetekster(ledeteksterUtland);
    });

    it('Skal klage hvis verdier er undefined', () => {
        const verdier = undefined;
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger[BEKREFT_OPPLYSNINGER_UTLAND]).to.equal(beregnFeilmeldingstekstFraTag(BEKREFT_OPPLYSNINGER_UTLAND));
    });

    it('Skal klage hvis bruker ikke har krysset av på ansvarserklæring', () => {
        const verdier = {};
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger[BEKREFT_OPPLYSNINGER_UTLAND]).to.equal(beregnFeilmeldingstekstFraTag(BEKREFT_OPPLYSNINGER_UTLAND));
    });

    it('Skal klage hvis bruker har krysset av på ansvarserklæring med en ugyldig verdi', () => {
        const verdier = {};
        verdier[BEKREFT_OPPLYSNINGER_UTLAND] = parseCheckbox(false);
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger[BEKREFT_OPPLYSNINGER_UTLAND]).to.equal(beregnFeilmeldingstekstFraTag(BEKREFT_OPPLYSNINGER_UTLAND));
    });

    it('Skal ikke klage hvis bruker har krysset av på ansvarserklæring', () => {
        const verdier = {};
        verdier[BEKREFT_OPPLYSNINGER_UTLAND] = parseCheckbox(true);
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger[BEKREFT_OPPLYSNINGER_UTLAND]).to.equal(undefined);
    });

    it('Skal klage hvis bruker ikke har skrevet inn reisemål', () => {
        const verdier = {};
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger[LAND]).to.equal('Vennligst skriv inn land');
    });

    it('Skal ikke klage hvis bruker har skrevet mange tegn som reisemål når max er null', () => {
        const verdier = {};
        verdier[LAND] = parseFlereVerdier(['abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc ']);
        const soknad2 = { ...soknad };
        soknad2.sporsmal[1].max = null;
        const feilmeldinger = validerSoknadUtland(verdier, { soknad: soknad2 });
        expect(feilmeldinger[LAND]).to.equal(undefined);
    });

    it('Skal ikke klage hvis bruker har skrevet inn reisemål', () => {
        const verdier = {};
        verdier[LAND] = parseFlereVerdier(['Sverige']);
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger[LAND]).to.equal(undefined);
    });

    it('Skal klage hvis bruker ikke har svart på arbeidsgiver', () => {
        const verdier = {};
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger[ARBEIDSGIVER]).to.equal('Du har nødt å svare på dette før du går videre');
    });

    it('Skal ikke klage hvis bruker har svart ja på arbeidsgiver', () => {
        const verdier = {};
        verdier[ARBEIDSGIVER] = parseEnkeltverdi(JA);
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger[ARBEIDSGIVER]).to.equal(undefined);
    });

    it('Skal ikke klage hvis bruker har svart nei på arbeidsgiver', () => {
        const verdier = {};
        verdier[ARBEIDSGIVER] = parseEnkeltverdi(NEI);
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger[ARBEIDSGIVER]).to.equal(undefined);
    });

    it('Skal klage hvis bruker har svart ja på arbeidsgiver men ikke svart på sykmeldingsgrad', () => {
        const verdier = {};
        verdier[ARBEIDSGIVER] = parseEnkeltverdi(JA);
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger[SYKMELDINGSGRAD]).to.equal('Du har nødt å svare på dette før du går videre');
    });

    it('Skal ikke klage på sykmeldingsgrad hvis bruker har svart nei på arbeidsgiver', () => {
        const verdier = {};
        verdier[ARBEIDSGIVER] = parseEnkeltverdi(NEI);
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger[SYKMELDINGSGRAD]).to.equal(undefined);
    });

    it('Skal klage hvis bruker har svart ja på arbeidsgiver men ikke svart på feie', () => {
        const verdier = {};
        verdier[ARBEIDSGIVER] = parseEnkeltverdi(JA);
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger[FERIE]).to.equal('Du har nødt å svare på om du har ferie');
    });

    it('Skal ikke klage på ferie hvis bruker har svart nei på arbeidsgiver', () => {
        const verdier = {};
        verdier[ARBEIDSGIVER] = parseEnkeltverdi(NEI);
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger[FERIE]).to.equal(undefined);
    });

    it('Skal ikke klage når bruker har svart alt "riktig"', () => {
        const verdier = {
            [ARBEIDSGIVER]: parseEnkeltverdi(JA),
            [SYKMELDINGSGRAD]: parseEnkeltverdi(JA),
            [FERIE]: parseEnkeltverdi(NEI),
            [BEKREFT_OPPLYSNINGER_UTLAND]: parseCheckbox(true),
            [LAND]: parseEnkeltverdi('Spania'),
            [PERIODEUTLAND]: [{
                fom: '27.06.2018',
                tom: '30.06.2018',
            }],
        };
        const feilmeldinger = validerSoknadUtland(verdier, { soknad });
        expect(feilmeldinger).to.deep.equal({});
    });
});
