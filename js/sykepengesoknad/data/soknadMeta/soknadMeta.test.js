import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import soknadMeta from './soknadMeta';
import { henterSoknadMottaker, soknadMottakerHentet, hentSoknadMottakerFeilet } from './soknadMetaActions';

describe('soknadMeta', () => {
    it('Har en default state', () => {
        expect(soknadMeta()).to.deep.equal({});
    });

    it('Håndterer henting av mottaker', () => {
        const initState = deepFreeze(soknadMeta());
        expect(soknadMeta(initState, henterSoknadMottaker('1'))).to.deep.equal({
            1: {
                henter: true,
                hentingFeilet: false,
                data: {},
                hentet: false,
            },
        });
    });

    it('Håndterer henting av mottaker for flere søknader', () => {
        const initState = deepFreeze(soknadMeta(soknadMeta(), henterSoknadMottaker('1')));
        expect(soknadMeta(initState, henterSoknadMottaker('2'))).to.deep.equal({
            1: {
                henter: true,
                hentingFeilet: false,
                hentet: false,
                data: {},
            },
            2: {
                henter: true,
                hentingFeilet: false,
                hentet: false,
                data: {},
            },
        });
    });

    it('Håndterer mottakerHentet for flere søknader', () => {
        const initState = deepFreeze(soknadMeta(soknadMeta(), henterSoknadMottaker('1')));
        const initState2 = deepFreeze(soknadMeta(initState, henterSoknadMottaker('2')));
        expect(soknadMeta(initState2, soknadMottakerHentet('1', { mottaker: 'ARBEIDSGIVER' }))).to.deep.equal({
            1: {
                henter: false,
                hentet: true,
                hentingFeilet: false,
                data: {
                    mottaker: 'ARBEIDSGIVER',
                },
            },
            2: {
                henter: true,
                hentingFeilet: false,
                hentet: false,
                data: {},
            },
        });
    });

    it('Håndterer hentSoknadMottakerFeilet for flere søknader', () => {
        const initState = deepFreeze(soknadMeta(soknadMeta(), henterSoknadMottaker('1')));
        const initState2 = deepFreeze(soknadMeta(initState, henterSoknadMottaker('2')));
        expect(soknadMeta(initState2, hentSoknadMottakerFeilet('1'))).to.deep.equal({
            1: {
                henter: false,
                hentet: true,
                hentingFeilet: true,
                data: {},
            },
            2: {
                henter: true,
                hentingFeilet: false,
                hentet: false,
                data: {},
            },
        });
    });
});
