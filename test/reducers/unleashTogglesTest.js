import deepFreeze from 'deep-freeze';
import unleashToggles from '../../js/reducers/unleashToggles';
import * as actions from '../../js/actions/unleashToggles_actions';
import expect from '../expect';

describe('toggles', () => {
    it('Håndterer TOGGLES_HENTET ', () => {
        const initialState = deepFreeze({});
        const action = actions.unleashTogglesHentet({
            'nokkel.1': 'Verdi 1',
            'nokkel.2': 'Verdi 2',
            'nokkel.3': 'Verdi 3',
        });
        const nextState = unleashToggles(initialState, action);
        expect(nextState).to.deep.equal({
            data: {
                'nokkel.1': 'Verdi 1',
                'nokkel.2': 'Verdi 2',
                'nokkel.3': 'Verdi 3',
            },
            henter: false,
            hentingFeilet: false,
            hentet: true,
        });
    });

    it('Håndterer HENTER_TOGGLES ', () => {
        const initialState = deepFreeze({});
        const action = actions.henterUnleashToggles();
        const nextState = unleashToggles(initialState, action);
        expect(nextState).to.deep.equal({
            henter: true,
            hentingFeilet: false,
            hentet: false,
        });
    });

    it('Håndterer HENT_TOGGLES_FEILET ', () => {
        const initialState = deepFreeze({});
        const action = actions.hentUnleashTogglesFeilet();
        const nextState = unleashToggles(initialState, action);
        expect(nextState).to.deep.equal({
            henter: false,
            hentingFeilet: true,
            hentet: true,
        });
    });
});
