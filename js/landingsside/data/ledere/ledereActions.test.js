import { expect } from 'chai';

import * as actions from './ledereActions';
import * as actiontyper from '../../../actions/actiontyper';

describe('ledere_actions', () => {
    it('Har en hentLedere()-funksjon', () => {
        const res = actions.hentLedere();
        expect(res).to.deep.equal({
            type: actiontyper.HENT_LEDERE_FORESPURT,
        });
    });

    it('Har en avkreftLeder()-funksjon', () => {
        const orgnummer = '12';
        const res = actions.avkreftLeder(orgnummer);

        expect(res).to.deep.equal({
            type: actiontyper.AVKREFT_LEDER_FORESPURT,
            orgnummer,
        });
    });
});
