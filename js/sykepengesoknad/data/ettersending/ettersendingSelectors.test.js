import { expect } from 'chai';
import {
    ETTERSEND_SOKNAD_FEILET,
    ETTERSEND_SOKNAD_SENDER,
    ETTERSEND_SOKNAD_SENDT,
    selectEttersenderSoknad,
    selectEttersendSoknadFeilet,
    selectEttersendSoknadStatus,
    selectEttersendtSoknad,
} from './ettersendingSelectors';
import ettersendingNav, { ettersenderSoknadTilNav, ettersendSoknadTilNavFeilet, soknadEttersendtTilNav } from './ettersendingNav';
import ettersendingArbeidsgiver, { ettersenderSoknadTilArbeidsgiver, ettersendSoknadTilArbeidsgiverFeilet, soknadEttersendtTilArbeidsgiver } from './ettersendingArbeidsgiver';

describe('ettersendingSelectors', () => {
    describe('selectEttersenderSoknad', () => {
        it('Skal returnere true hvis ettersender til NAV', () => {
            const action = ettersenderSoknadTilNav();
            const state = {
                ettersendingNav: ettersendingNav(ettersendingNav(), action),
                ettersendingArbeidsgiver: ettersendingArbeidsgiver(),
            };
            expect(selectEttersenderSoknad(state)).to.equal(true);
        });
        it('Skal returnere true hvis ettersender til arbeidsgiver', () => {
            const action = ettersenderSoknadTilArbeidsgiver();
            const state = {
                ettersendingNav: ettersendingNav(),
                ettersendingArbeidsgiver: ettersendingArbeidsgiver(ettersendingArbeidsgiver(), action),
            };
            expect(selectEttersenderSoknad(state)).to.equal(true);
        });
        it('Skal returnere false hvis det ikke skjer ettersending', () => {
            const state = {
                ettersendingNav: ettersendingNav(),
                ettersendingArbeidsgiver: ettersendingArbeidsgiver(),
            };
            expect(selectEttersenderSoknad(state)).to.equal(false);
        });
    });
    describe('selectEttersendtSoknad', () => {
        it('Skal returnere true hvis ettersendt til NAV', () => {
            const action = soknadEttersendtTilNav();
            const state = {
                ettersendingNav: ettersendingNav(ettersendingNav(), action),
                ettersendingArbeidsgiver: ettersendingArbeidsgiver(),
            };
            expect(selectEttersendtSoknad(state)).to.equal(true);
        });
        it('Skal returnere true hvis ettersendt til arbeidsgiver', () => {
            const action = soknadEttersendtTilArbeidsgiver();
            const state = {
                ettersendingNav: ettersendingNav(),
                ettersendingArbeidsgiver: ettersendingArbeidsgiver(ettersendingArbeidsgiver(), action),
            };
            expect(selectEttersendtSoknad(state)).to.equal(true);
        });
        it('Skal returnere false hvis ikke ettersendt', () => {
            const state = {
                ettersendingNav: ettersendingNav(),
                ettersendingArbeidsgiver: ettersendingArbeidsgiver(),
            };
            expect(selectEttersendtSoknad(state)).to.equal(false);
        });
    });
    describe('selectEttersendSoknadFeilet', () => {
        it('Skal returnere true hvis ettersend til NAV feiler', () => {
            const action = ettersendSoknadTilNavFeilet();
            const state = {
                ettersendingNav: ettersendingNav(ettersendingNav(), action),
                ettersendingArbeidsgiver: ettersendingArbeidsgiver(),
            };
            expect(selectEttersendSoknadFeilet(state)).to.equal(true);
        });
        it('Skal returnere true hvis ettersend til arbeidsgiver feiler', () => {
            const action = ettersendSoknadTilArbeidsgiverFeilet();
            const state = {
                ettersendingNav: ettersendingNav(),
                ettersendingArbeidsgiver: ettersendingArbeidsgiver(ettersendingArbeidsgiver(), action),
            };
            expect(selectEttersendSoknadFeilet(state)).to.equal(true);
        });
        it('Skal returnere false hvis ettersending ikke har feilet', () => {
            const state = {
                ettersendingNav: ettersendingNav(),
                ettersendingArbeidsgiver: ettersendingArbeidsgiver(),
            };
            expect(selectEttersendSoknadFeilet(state)).to.equal(false);
        });
    });
    describe('selectEttersendSoknadStatus', () => {
        it('Skal returnere ETTERSEND_SOKNAD_SENDER hvis søknad ettersendes', () => {
            const action = ettersenderSoknadTilNav();
            const state = {
                ettersendingNav: ettersendingNav(ettersendingNav(), action),
                ettersendingArbeidsgiver: ettersendingArbeidsgiver(),
            };
            expect(selectEttersendSoknadStatus(state)).to.equal(ETTERSEND_SOKNAD_SENDER);
        });
        it('Skal returnere ETTERSEND_SOKNAD_SENDT hvis søknad er ettersendt', () => {
            const action = soknadEttersendtTilArbeidsgiver();
            const state = {
                ettersendingNav: ettersendingNav(),
                ettersendingArbeidsgiver: ettersendingArbeidsgiver(ettersendingArbeidsgiver(), action),
            };
            expect(selectEttersendSoknadStatus(state)).to.equal(ETTERSEND_SOKNAD_SENDT);
        });
        it('Skal returnere ETTERSEND_SOKNAD_FEILET hvis ettersending har feilet', () => {
            const action = ettersendSoknadTilNavFeilet();
            const state = {
                ettersendingNav: ettersendingNav(ettersendingNav(), action),
                ettersendingArbeidsgiver: ettersendingArbeidsgiver(),
            };
            expect(selectEttersendSoknadStatus(state)).to.equal(ETTERSEND_SOKNAD_FEILET);
        });
    });
});
