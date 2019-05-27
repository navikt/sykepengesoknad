import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import * as brukerinfoActions from './brukerinfo_actions';
import brukerinfo from './brukerinfo';

// eslint-disable-next-line no-unused-vars
let item;

window.localStorage = {};
window.localStorage.getItem = (i) => {
    return i;
};
window.localStorage.setItem = (_item) => {
    item = _item;
};

describe('brukerinfo', () => {
    let initiellState;

    beforeEach(() => {
        initiellState = {};
    });

    it('Håndterer hentBrukerinfoFeilet', () => {
        initiellState = deepFreeze({
            innstillinger: {},
            innlogging: {},
        });
        const nextState = brukerinfo(initiellState, brukerinfoActions.hentBrukerinfoFeilet());
        expect(nextState).to.deep.include({
            bruker: {
                data: {},
                hentingFeilet: true,
                henter: false,
                hentet: true,
            },
            innlogging: {},
        });
    });

    it('Håndterer henterBrukerinfo', () => {
        initiellState = deepFreeze({
            innstillinger: {},
            innlogging: {},
        });
        const nextState = brukerinfo(initiellState, brukerinfoActions.henterBrukerinfo());
        expect(nextState).to.deep.include({
            bruker: {
                henter: true,
                hentingFeilet: false,
                data: {},
                hentet: false,
            },
            innlogging: {},
        });
    });

    it('Håndterer sjekkerInnlogging når man ikke er innlogget fra før', () => {
        initiellState = deepFreeze({
            innstillinger: {},
            innlogging: {
                henter: false,
            },
            bruker: {},
            oppfolging: {
                data: {},
            },
        });
        const nyState = brukerinfo(initiellState, brukerinfoActions.sjekkerInnlogging());
        expect(nyState).to.deep.include({
            innlogging: {
                henter: true,
                hentingFeilet: false,
            },
        });
    });

    it('Håndterer setErUtlogget()', () => {
        initiellState = deepFreeze({
            innstillinger: {},
            innlogging: {
                erInnlogget: true,
            },
            bruker: {},
            oppfolging: {
                data: {},
            },
        });
        const nyState = brukerinfo(initiellState, brukerinfoActions.setErUtlogget());
        expect(nyState).to.deep.include({
            innlogging: {
                erInnlogget: false,
                henter: false,
                hentingFeilet: false,
            },
        });
    });

    it('Håndterer setErInnlogget()', () => {
        initiellState = deepFreeze({
            innstillinger: {},
            bruker: {},
        });
        const nyState = brukerinfo(initiellState, brukerinfoActions.setErInnlogget());
        expect(nyState).to.deep.include({
            innlogging: {
                erInnlogget: true,
                henter: false,
                hentingFeilet: false,
            },
        });
    });

    it('Håndterer sjekkInnloggingFeilet()', () => {
        initiellState = deepFreeze({
            innstillinger: {},
            bruker: {},
        });
        const nyState = brukerinfo(initiellState, brukerinfoActions.sjekkInnloggingFeilet());
        expect(nyState).to.deep.include({
            innlogging: {
                erInnlogget: false,
                henter: false,
                hentingFeilet: true,
            },
        });
    });
});
