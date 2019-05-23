import { expect } from 'chai';
import { put, call } from 'redux-saga/effects';
import { hentUnleashToggles } from './unleashTogglesSagas';
import { henterUnleashToggles, unleashTogglesHentet } from './unleashToggles_actions';
import { post } from '../../gateway-api/index';
import * as toggles from '../../enums/unleashToggles';

describe('togglesSagas', () => {
    const generator = hentUnleashToggles();

    it('Skal dispatche HENTER_TOGGLES', () => {
        const action = henterUnleashToggles();
        const nextPut = put(action);
        expect(generator.next().value).to.deep.equal(nextPut);
    });

    it('Skal dernest hente toggles', () => {
        const nextCall = call(post, '/syfounleash/', Object.values(toggles));
        expect(generator.next().value).to.deep.equal(nextCall);
    });

    it('Skal dernest sette toggles', () => {
        const action = unleashTogglesHentet({
            'min-toggle': true,
        });
        const nextPut = put(action);
        expect(generator.next({ 'min-toggle': true }).value).to.deep.equal(nextPut);
    });
});
