import { expect } from 'chai';
import { post } from '@navikt/digisyfo-npm';
import { put, call } from 'redux-saga/effects';
import { hentArbeidsgiverperiodeberegning } from './beregnArbeidsgiverperiodeSagas';
import * as actions from './arbeidsgiverperiodeberegning_actions';

describe('arbeidsgiverperiodeberegningSagas', () => {
    const sykepengesoknad = {
        id: '2',
    };
    const action = actions.hentArbeidsgiverperiodeberegning(sykepengesoknad);
    const generator = hentArbeidsgiverperiodeberegning(action);

    it('Skal dispatche HENTER_ARBEIDSGIVERPERIODEBEREGNING', () => {
        const nextPut = put(actions.henterArbeidsgiverperiodeberegning());
        expect(generator.next().value).to.deep.equal(nextPut);
    });

    it('Skal sjekke', () => {
        const nextCall = call(post, '/syforest/soknader/2/actions/beregn-arbeidsgiverperiode', sykepengesoknad);
        expect(generator.next().value).to.deep.equal(nextCall);
    });

    it('Skal deretter dispatche arbeidsgiverperiodeberegningHentet', () => {
        const _action = actions.arbeidsgiverperiodeberegningHentet({ en: 'to' });
        const nextPut = put(_action);
        expect(generator.next({ en: 'to' }).value).to.deep.equal(nextPut);
    });
});
