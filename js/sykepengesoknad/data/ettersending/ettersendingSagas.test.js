import { expect } from 'chai';
import { call, put } from 'redux-saga/effects';
import {
    ettersendSoknadNav, ettersendSoknadArbeidsgiver,
} from './ettersendingSagas';
import { post } from '../../../gateway-api/index';
import { ettersenderSoknadTilNav, ettersendSoknadTilNav, soknadEttersendtTilNav } from './ettersendingNav';
import { ettersenderSoknadTilArbeidsgiver, ettersendSoknadTilArbeidsgiver, soknadEttersendtTilArbeidsgiver } from './ettersendingArbeidsgiver';

describe('ettersendingSagas', () => {
    describe('Ettersending av søknad til NAV', () => {
        const soknadId = 1;
        const action = ettersendSoknadTilNav(soknadId);
        const generator = ettersendSoknadNav(action);

        it('Skal dispatche ETTERSENDER_SOKNAD_NAV', () => {
            const nextPut = put(ettersenderSoknadTilNav());
            expect(generator.next(true).value).to.deep.equal(nextPut);
        });

        it('Skal ettersende søknad til NAV', () => {
            const nextCall = call(post, 'https://syfoapi-q.nav.no/syfosoknad/api/soknader/1/ettersendTilNav');
            expect(generator.next().value).to.deep.equal(nextCall);
        });

        it('Skal deretter dispatche SOKNAD_ETTERSENDT_NAV', () => {
            const nextPut = put(soknadEttersendtTilNav());
            expect(generator.next().value).to.deep.equal(nextPut);
        });
    });

    describe('Ettersending av søknad til arbeidsgiver', () => {
        const soknadId = 1;
        const action = ettersendSoknadTilArbeidsgiver(soknadId);
        const generator = ettersendSoknadArbeidsgiver(action);

        it('Skal dispatche ETTERSENDER_SOKNAD_ARBG', () => {
            const nextPut = put(ettersenderSoknadTilArbeidsgiver());
            expect(generator.next(true).value).to.deep.equal(nextPut);
        });

        it('Skal ettersende søknad til arbeidsgiver', () => {
            const nextCall = call(post, 'https://syfoapi-q.nav.no/syfosoknad/api/soknader/1/ettersendTilArbeidsgiver');
            expect(generator.next().value).to.deep.equal(nextCall);
        });

        it('Skal deretter dispatche SOKNAD_ETTERSENDT_ARGB', () => {
            const nextPut = put(soknadEttersendtTilArbeidsgiver());
            expect(generator.next().value).to.deep.equal(nextPut);
        });
    });
});
