import deepFreeze from 'deep-freeze';
import { expect } from 'chai';
import sinon from 'sinon';
import metrikker from './metrikker';
import { utfyllingStartet } from './metrikker_actions';
import { UTFYLLING_STARTET } from '../../enums/metrikkerEnums';
import { soknadSendt } from '../../sykepengesoknad/data/soknader/soknaderActions';

describe('metrikker', () => {
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(new Date('2018-02-17'));
    });

    afterEach(() => {
        clock.restore();
    });

    it('Skal håndtere utfyllingStartet', () => {
        const action = utfyllingStartet('min-sykmelding-id');
        const state = metrikker(deepFreeze({
            data: [],
        }), action);
        expect(state.data).to.deep.equal([{
            type: UTFYLLING_STARTET,
            ressursId: 'min-sykmelding-id',
            tid: new Date(),
        }]);
    });

    it('Skal håndtere soknadSendt', () => {
        const tid = new Date();
        const action = utfyllingStartet('min-selvstendig-soknadPt');
        const state = metrikker(deepFreeze({
            data: [],
        }), action);
        clock.tick(200);
        const nesteTid = new Date();
        const nesteAction = soknadSendt({
            id: 'min-selvstendig-soknadPt',
        });
        const nesteState = metrikker(deepFreeze(state), nesteAction);
        expect(nesteState.data).to.deep.equal([{
            type: UTFYLLING_STARTET,
            ressursId: 'min-selvstendig-soknadPt',
            tid,
        }, {
            type: 'SOKNAD_SENDT',
            ressursId: 'min-selvstendig-soknadPt',
            tid: nesteTid,
        }]);
    });
});
