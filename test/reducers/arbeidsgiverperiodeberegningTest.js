import deepFreeze from 'deep-freeze';
import { expect } from 'chai';
import * as actions from '../../js/sykepengesoknad-gammel-plattform/data/arbeidsgiverperiodeberegning/arbeidsgiverperiodeberegning_actions';
import arbeidsgiverperiodeberegning from '../../js/sykepengesoknad-gammel-plattform/data/arbeidsgiverperiodeberegning/arbeidsgiverperiodeberegning';

describe('arbeidsgiverperiodeberegning', () => {
    let state = arbeidsgiverperiodeberegning();

    it('Håndterer henterArbeidsgiverperiodeberegning()', () => {
        const action = actions.henterArbeidsgiverperiodeberegning();
        state = arbeidsgiverperiodeberegning(deepFreeze(state), action);
        expect(state).to.deep.equal({
            henter: true,
            hentingFeilet: false,
            hentet: false,
            data: {},
        });
    });

    it('Håndterer arbeidsgiverperiodeberegningHentet({})', () => {
        const action = actions.arbeidsgiverperiodeberegningHentet({ en: 'to' });
        state = arbeidsgiverperiodeberegning(deepFreeze(state), action);
        expect(state).to.deep.equal({
            henter: false,
            hentingFeilet: false,
            hentet: true,
            data: { en: 'to' },
        });
    });

    it('Håndterer sjekkSkalViseForskutteringssporsmalFeilet', () => {
        state = arbeidsgiverperiodeberegning();
        const action = actions.arbeidsgiverperiodeberegningFeilet();
        state = arbeidsgiverperiodeberegning(deepFreeze(state), action);
        expect(state).to.deep.equal({
            henter: false,
            hentingFeilet: true,
            hentet: true,
            data: {},
        });
    });
});
