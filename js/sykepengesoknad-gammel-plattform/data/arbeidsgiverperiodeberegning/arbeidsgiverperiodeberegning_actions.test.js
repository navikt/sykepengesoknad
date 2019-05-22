import { expect } from 'chai';

import * as actions from './arbeidsgiverperiodeberegning_actions';
import * as actiontyper from '../../../actions/actiontyper';

describe('arbeidsgiverperiodeberegning_actions', () => {
    it('Har nødvendige actiontyper', () => {
        expect(actiontyper.HENT_ARBEIDSGIVERPERIODEBEREGNING_FORESPURT).to.equal('HENT_ARBEIDSGIVERPERIODEBEREGNING_FORESPURT');
        expect(actiontyper.HENTER_ARBEIDSGIVERPERIODEBEREGNING).to.equal('HENTER_ARBEIDSGIVERPERIODEBEREGNING');
        expect(actiontyper.ARBEIDSGIVERPERIODEBEREGNING_HENTET).to.equal('ARBEIDSGIVERPERIODEBEREGNING_HENTET');
        expect(actiontyper.HENT_ARBEIDSGIVERPERIODEBEREGNING_FEILET).to.equal('HENT_ARBEIDSGIVERPERIODEBEREGNING_FEILET');
    });

    it('Har en henterArbeidsgiverperiodeberegning()-funksjon som returnerer riktig action', () => {
        expect(actions.hentArbeidsgiverperiodeberegning({ id: '2' })).to.deep.equal({
            type: actiontyper.HENT_ARBEIDSGIVERPERIODEBEREGNING_FORESPURT,
            sykepengesoknad: {
                id: '2',
            },
        });
    });

    it('Har en henterArbeidsgiverperiodeberegning()-funksjon som returnerer riktig action', () => {
        expect(actions.henterArbeidsgiverperiodeberegning()).to.deep.equal({
            type: actiontyper.HENTER_ARBEIDSGIVERPERIODEBEREGNING,
        });
    });

    it('Har en arbeidsgiverperiodeberegningHentet()-funksjon som returnerer riktig action', () => {
        expect(actions.arbeidsgiverperiodeberegningHentet({ en: 'to' })).to.deep.equal({
            type: actiontyper.ARBEIDSGIVERPERIODEBEREGNING_HENTET,
            data: { en: 'to' },
        });
    });

    it('Har en arbeidsgiverperiodeberegningFeilet()-funksjon som returnerer riktig action', () => {
        expect(actions.arbeidsgiverperiodeberegningFeilet()).to.deep.equal({
            type: actiontyper.HENT_ARBEIDSGIVERPERIODEBEREGNING_FEILET,
        });
    });
});
