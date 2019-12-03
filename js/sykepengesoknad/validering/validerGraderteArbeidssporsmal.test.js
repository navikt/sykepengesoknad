import { setLedetekster } from '@navikt/digisyfo-npm';
import fraBackendsoknadTilInitiellSoknad from '../utils/fraBackendsoknadTilInitiellSoknad';
import { parseSoknad } from '../data/soknader/soknader';
import expect from '../../../test/expect';
import validerGraderteArbeidssporsmal from './validerGraderteArbeidssporsmal';
import {
    selvstendigSoknadMedOppgittArbeidsgradMerEnnArbeidsgradISykmelding,
    selvstendigSoknadMedOppgittArbeidsgradMindreEnnArbeidsgradISykmelding,
    soknadMedOppgittArbeidsgradIProsent,
    soknadMedOppgittArbeidsgradMerEnnArbeidsgradISykmelding,
    soknadMedOppgittArbeidsgradMindreEnnArbeidsgradISykmelding,
    soknadMedOppgittFerieOgPermisjon,
    soknadMedOppgittFeriePermisjonUtland,
    soknadMedOppgittTilbakeNar,
    soknadMedOppgittTilbakeNarIManedskifte,
    soknadUtenFerieOgPermisjon,
} from './validerGraderteArbeidssporsmalMock.test';

/* eslint-disable max-len */

describe('validerGraderteArbeidssporsmal', () => {
    beforeEach(() => {
        setLedetekster({
            'soknad.feilmelding.hvor_mye_timer_verdi.min': 'Timene du skrev inn tyder på at du har jobbet mindre enn %MIN% %. Du må enten svare nei på spørsmålet over eller endre antall timer her.',
            'soknad.feilmelding.hvor_mye_prosent_verdi.min': 'Prosenten du skrev inn tyder på at du har jobbet mindre enn %ARBEIDSGRAD% %. Du må enten svare nei på spørsmålet over eller endre prosenten til et tall mellom %MIN% og %MAX%.',
        });
    });

    it('Skal klage når oppgitt timer i beregnet arbeidsgrad utgjør mindre enn arbeidsgrad i sykmeldingen', () => {
        const soknad = soknadMedOppgittArbeidsgradMindreEnnArbeidsgradISykmelding;
        const values = fraBackendsoknadTilInitiellSoknad(soknad);
        const feilmeldinger = validerGraderteArbeidssporsmal(soknad.sporsmal, values, parseSoknad(soknad));
        expect(feilmeldinger.HVOR_MYE_TIMER_VERDI_0).to.equal('Timene du skrev inn tyder på at du har jobbet mindre enn 60 %. Du må enten svare nei på spørsmålet over eller endre antall timer her.');
    });

    it('Skal klage når oppgitt timer i beregnet arbeidsgrad Frilanser/Selvstendig utgjør mindre enn arbeidsgrad i sykmeldingen', () => {
        const soknad = selvstendigSoknadMedOppgittArbeidsgradMindreEnnArbeidsgradISykmelding;
        const values = fraBackendsoknadTilInitiellSoknad(soknad);
        const feilmeldinger = validerGraderteArbeidssporsmal(soknad.sporsmal, values, parseSoknad(soknad));
        expect(feilmeldinger.HVOR_MYE_HAR_DU_JOBBET_1).to.equal('Prosenten du skrev inn tyder på at du har jobbet mindre enn 80 %. Du må enten svare nei på spørsmålet over eller endre prosenten til et tall mellom 81 og 99.');
    });

    it('Skal ikke klage når oppgitt timer i beregnet arbeidsgrad Frilanser/Selvstendig utgjør mer enn arbeidsgrad i sykmeldingen', () => {
        const soknad = selvstendigSoknadMedOppgittArbeidsgradMerEnnArbeidsgradISykmelding;
        const values = fraBackendsoknadTilInitiellSoknad(soknad);
        const feilmeldinger = validerGraderteArbeidssporsmal(soknad.sporsmal, values, parseSoknad(soknad));
        expect(feilmeldinger.HVOR_MYE_HAR_DU_JOBBET_1).to.equal(undefined);
    });

    it('Skal ikke klage når oppgitt timer i beregnet arbeidsgrad utgjør mer enn arbeidsgrad i sykmeldingen', () => {
        const soknad = soknadMedOppgittArbeidsgradMerEnnArbeidsgradISykmelding;
        const values = fraBackendsoknadTilInitiellSoknad(soknad);
        const feilmeldinger = validerGraderteArbeidssporsmal(soknad.sporsmal, values, parseSoknad(soknad));
        expect(feilmeldinger.HVOR_MYE_TIMER_VERDI_0).to.equal(undefined);
    });

    it('Skal ikke klage når oppgitt timer i beregnet arbeidsgrad utgjør mindre enn arbeidsgrad i sykmeldingen hvis man har valgt å oppgi svar i prosent', () => {
        const soknad = soknadMedOppgittArbeidsgradIProsent;
        const values = fraBackendsoknadTilInitiellSoknad(soknad);
        const feilmeldinger = validerGraderteArbeidssporsmal(soknad.sporsmal, values, parseSoknad(soknad));
        expect(feilmeldinger.HVOR_MYE_TIMER_VERDI_0).to.equal(undefined);
    });

    it('Skal ta med ferie- og permisjonsperioder i beregning av arbeidsgrad', () => {
        const soknad = soknadMedOppgittFerieOgPermisjon;
        const values = fraBackendsoknadTilInitiellSoknad(soknad);
        const feilmeldinger = validerGraderteArbeidssporsmal(soknad.sporsmal, values, parseSoknad(soknad));
        expect(feilmeldinger.HVOR_MYE_TIMER_VERDI_0).to.equal(undefined);
    });

    it('Skal ikke med ferie- og permisjonsperioder i beregning av arbeidsgrad dersom disse er fjernet fra søknaden', () => {
        const soknad = soknadUtenFerieOgPermisjon;
        const values = fraBackendsoknadTilInitiellSoknad(soknad);
        const feilmeldinger = validerGraderteArbeidssporsmal(soknad.sporsmal, values, parseSoknad(soknad));
        expect(feilmeldinger.HVOR_MYE_TIMER_VERDI_0).not.to.equal(undefined);
    });

    it('Skal ikke med ferie- og permisjonsperioder i beregning av arbeidsgrad dersom søknad inneholder FERIE_PERM_UTLAND-spørsmålet', () => {
        const soknad = soknadMedOppgittFeriePermisjonUtland;
        const values = fraBackendsoknadTilInitiellSoknad(soknad);
        const feilmeldinger = validerGraderteArbeidssporsmal(soknad.sporsmal, values, parseSoknad(soknad));
        expect(feilmeldinger.HVOR_MYE_TIMER_VERDI_0).to.equal(undefined);
    });

    it('Skal ta med TILBAKE-NAR i beregning av arbeidsgrad', () => {
        const soknad = soknadMedOppgittTilbakeNar;
        const values = fraBackendsoknadTilInitiellSoknad(soknad);
        const feilmeldinger = validerGraderteArbeidssporsmal(soknad.sporsmal, values, parseSoknad(soknad));
        expect(feilmeldinger.HVOR_MYE_TIMER_VERDI_0).to.equal(undefined);
    });

    it('Skal ta med TILBAKE-NAR som er i månedskifte i beregning av arbeidsgrad', () => {
        const soknad = soknadMedOppgittTilbakeNarIManedskifte;
        const values = fraBackendsoknadTilInitiellSoknad(soknad);
        const feilmeldinger = validerGraderteArbeidssporsmal(soknad.sporsmal, values, parseSoknad(soknad));
        expect(feilmeldinger.HVOR_MYE_TIMER_VERDI_0).to.equal(undefined);
    });

    /* eslint-enable max-len */
});
