import { expect } from 'chai';

import * as actions from '../../js/actions/reduxFormMeta_actions';
import * as actiontyper from '../../js/actions/actiontyper';

describe('reduxFormMeta_actions', () => {
    it('Har nødvendige actiontyper', () => {
        expect(actiontyper.SEND_SKJEMA_FEILET).to.equal('SEND_SKJEMA_FEILET');
        expect(actiontyper.SEND_SKJEMA_FEILET_HANDTERT).to.equal('SEND_SKJEMA_FEILET_HÅNDTERT');
        expect(actiontyper.SKJEMA_ER_GYLDIG).to.equal('SKJEMA_ER_GYLDIG');
        expect(actiontyper.SJEKK_SKAL_VISE_FORSKUTTERINGSSPORSMAL_FORESPURT).to.equal('SJEKK_SKAL_VISE_FORSKUTTERINGSSPØRSMAL_FORESPURT');
        expect(actiontyper.SJEKKER_SKAL_VISE_FORSKUTTERINGSSPORSMAL).to.equal('SJEKKER_SKAL_VISE_FORSKUTTERINGSSPØRSMAL');
        expect(actiontyper.SKAL_VISE_FORSKUTTERINGSSPORSMAL_SJEKKET).to.equal('SKAL_VISE_FORSKUTTERINGSSPØRSMAL_SJEKKET');
        expect(actiontyper.SJEKK_SKAL_VISE_FORSKUTTERINGSSPORSMAL_FEILET).to.equal('SJEKK_SKAL_VISE_FORSKUTTERINGSSPØRSMAL_FEILET');
    });

    it('Har en sendSkjemaFeilet som returnerer riktig action', () => {
        expect(actions.sendSkjemaFeilet('TESTSKJEMA')).to.deep.equal({
            type: actiontyper.SEND_SKJEMA_FEILET,
            skjemanavn: 'TESTSKJEMA',
        });
    });

    it('Har en sendSkjemaFeiletHandtert som returnerer riktig action', () => {
        expect(actions.sendSkjemaFeiletHandtert('TESTSKJEMA')).to.deep.equal({
            type: actiontyper.SEND_SKJEMA_FEILET_HANDTERT,
            skjemanavn: 'TESTSKJEMA',
        });
    });

    it('Har en skjemaErGyldig som returnerer riktig action', () => {
        expect(actions.skjemaErGyldig('TESTSKJEMA')).to.deep.equal({
            type: actiontyper.SKJEMA_ER_GYLDIG,
            skjemanavn: 'TESTSKJEMA',
        });
    });
});
