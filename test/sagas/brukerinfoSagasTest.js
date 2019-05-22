import { expect } from 'chai';
import { get, getAjax } from '@navikt/digisyfo-npm';
import { put, call, select } from 'redux-saga/effects';
import { hentBrukerinfo, sjekkInnlogging } from '../../js/sagas/brukerinfoSagas';
import { skalHenteBrukerinfoSelector } from '../../js/selectors/brukerinfoSelectors';
import { henterBrukerinfo, brukerinfoHentet, setErInnlogget, sjekkerInnlogging } from '../../js/actions/brukerinfo_actions';

describe('brukerinfoSagas', () => {
    describe('hentBrukerinfo', () => {
        const generator = hentBrukerinfo();

        it('Skal sjekke om get skal utføres', () => {
            const nextSelect = select(skalHenteBrukerinfoSelector);
            expect(generator.next().value).to.deep.equal(nextSelect);
        });

        it('Skal dispatche HENTER_BRUKERINFO', () => {
            const nextPut = put(henterBrukerinfo());
            const skalHente = true;
            expect(generator.next(skalHente).value).to.deep.equal(nextPut);
        });

        it('Skal dernest hente brukerinfo', () => {
            const nextCall = call(get, '/syforest/informasjon/bruker');
            expect(generator.next().value).to.deep.equal(nextCall);
        });

        it('Skal dernest sette brukerinfo', () => {
            const nextPut = put(brukerinfoHentet({
                navn: 'Ole Olsen',
            }));
            expect(generator.next({
                navn: 'Ole Olsen',
            }).value).to.deep.equal(nextPut);
        });
    });

    describe('sjekkInnlogging', () => {
        const generator = sjekkInnlogging();

        it('Skal dispatche SJEKKER_INNLOGGING', () => {
            const nextPut = put(sjekkerInnlogging());
            expect(generator.next().value).to.deep.equal(nextPut);
        });

        it('Skal dernest sjekke om brukeren er innlogget', () => {
            const nextCall = call(getAjax, '/sykepengesoknad/');
            expect(generator.next().value).to.deep.equal(nextCall);
        });

        it('Skal dernest sette status for innlogging', () => {
            const nextPut = put(setErInnlogget());
            expect(generator.next().value).to.deep.equal(nextPut);
        });
    });
});
