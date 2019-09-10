/* eslint arrow-body-style: ["error", "as-needed"] */
import { expect } from 'chai';
import { selectSykepengesoknaderData } from './sykepengesoknaderSelectors';

describe('Sykepengesoknader selectors', () => {
    it('skal kunne hente data fra sykepengesoknader state', () => {
        const state = {
            sykepengesoknader: {
                henter: false,
                hentet: true,
                hentingFeilet: false,
                data: [{ id: 1 }],
            },
            soknader: {
                henter: false,
                hentet: true,
                hentingFeilet: false,
                data: [],
            },
        };
        expect(selectSykepengesoknaderData(state)).to.deep.equal([{ id: 1 }]);
    });

    it('skal kun hente soknader med id som ikke finnes blandt nye søknader', () => {
        const state = {
            sykepengesoknader: {
                henter: false,
                hentet: true,
                hentingFeilet: false,
                data: [{ id: 1 }, { id: 2 }],
            },
            soknader: {
                henter: false,
                hentet: true,
                hentingFeilet: false,
                data: [{ id: 2 }],
            },
        };

        expect(selectSykepengesoknaderData(state)).to.deep.equal([{ id: 1 }]);
    });
});
