import { expect } from 'chai';
import { get, post } from '@navikt/digisyfo-npm';
import { put, call } from 'redux-saga/effects';
import { hentLedere, avkreftLeder } from './ledereSagas';
import * as actions from './ledereActions';
import * as actiontyper from '../../../actions/actiontyper';

describe('ledereSagas', () => {
    describe('hentLedere', () => {
        const generator = hentLedere({});

        it('Skal dispatche HENTER_LEDERE', () => {
            const nextPut = put({ type: actiontyper.HENTER_LEDERE });
            expect(generator.next().value).to.deep.equal(nextPut);
        });

        it('Skal dernest hente ledere', () => {
            const nextCall = call(get, '/syforest/naermesteledere');
            expect(generator.next().value).to.deep.equal(nextCall);
        });

        it('Skal dernest lagre ledere', () => {
            const nextPut = put({
                type: actiontyper.LEDERE_HENTET,
                data: 'mine data',
            });
            expect(generator.next('mine data').value).to.deep.equal(nextPut);
        });
    });

    describe('avkreftLeder', () => {
        const generator = avkreftLeder(actions.avkreftLeder('orgnummer'));

        it('skal dispatche AVKREFTER_LEDER', () => {
            const nextPut = put(actions.avkrefterLeder());
            expect(generator.next().value).to.deep.equal(nextPut);
        });

        it('skal dernest poste avkreft', () => {
            const nextCall = call(post, '/syforest/naermesteledere/orgnummer/actions/avkreft');
            expect(generator.next().value).to.deep.equal(nextCall);
        });

        it('skal dernest avkrefte leder i store', () => {
            const nextPut = put(actions.lederAvkreftet('orgnummer'));
            expect(generator.next().value).to.deep.equal(nextPut);
        });
    });
});
