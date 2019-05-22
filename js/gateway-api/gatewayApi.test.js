import sinon from 'sinon';
import { leggTilCacheBuster } from './gatewayApi';
import expect from '../../test/expect';

describe('gatewayApi', () => {
    let clock;
    let now;

    beforeEach(() => {
        now = new Date('2019-04-25').getTime();
        clock = sinon.useFakeTimers(now);
    });

    afterEach(() => {
        clock.restore();
    });

    describe('cacheBuster', () => {
        it('Skal legge til ?_ts=timestamp bak URL når URL ikke inneholder parametre', () => {
            const url = 'http://localhost:8080/syfoapi/syfosoknad/api/soknader';
            const res = leggTilCacheBuster(url);
            expect(res).to.equal(`${url}?_ts=${now}`);
        });

        it('Skal legge til &_ts=timestamp bak URL når URL inneholder parametre', () => {
            const url = 'http://localhost:8080/syfoapi/syfosoknad/api/soknader?brukernavn=OLE';
            const res = leggTilCacheBuster(url);
            expect(res).to.equal(`${url}&_ts=${now}`);
        });
    });
});
