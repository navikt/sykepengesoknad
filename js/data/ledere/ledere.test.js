import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import ledere from './ledere';
import {
    hentLedereFeilet,
    ledereHentet,
    henterLedere,
    avkreftLederFeilet,
    lederAvkreftet,
    avkrefterLeder,
} from './ledereActions';

describe('ledere', () => {
    it('Returnerer { data: [] } ved initializering', () => {
        const nextState = ledere();
        expect(nextState).to.deep.equal({ data: [] });
    });

    it('håndterer LEDERE_HENTET', () => {
        const initialState = deepFreeze({});
        const action = ledereHentet([{
            navn: 'Kurt Nilsen',
        }, {
            navn: 'Hans Hansen',
        }, {
            navn: 'Nina Knutsen',
        }]);
        const nextState = ledere(initialState, action);

        expect(nextState).to.deep.equal({
            henter: false,
            hentingFeilet: false,
            hentet: true,
            data: [{
                navn: 'Kurt Nilsen',
            }, {
                navn: 'Hans Hansen',
            }, {
                navn: 'Nina Knutsen',
            }],
        });
    });

    it('håndterer HENTER_LEDERE', () => {
        const initialState = deepFreeze({
            henter: false,
        });
        const action = henterLedere();
        const nextState = ledere(initialState, action);
        expect(nextState).to.deep.equal({
            data: [],
            henter: true,
            hentet: false,
            hentingFeilet: false,
        });
    });

    it('håndterer HENT_LEDERE_FEILET', () => {
        const initialState = deepFreeze({
            henter: false,
        });
        const action = hentLedereFeilet();
        const nextState = ledere(initialState, action);
        expect(nextState).to.deep.equal({
            henter: false,
            hentingFeilet: true,
            hentet: true,
            data: [],
        });
    });

    it('håndterer AVKREFTER_LEDER', () => {
        const initialState = deepFreeze({
            avkrefter: false,
            avkreftFeilet: false,
            data: [
                {
                    navn: 'Ole Brum',
                    orgnummer: '81549300',
                    id: '1',
                },
                {
                    navn: 'Nasse Neoff',
                    orgnummer: '23529291',
                    id: '2',
                },
            ],
        });
        const action = avkrefterLeder();
        const nextState = ledere(initialState, action);
        expect(nextState).to.deep.equal({
            avkrefter: true,
            avkreftet: false,
            avkreftFeilet: false,
            data: initialState.data,
        });
    });

    it('håndterer LEDER_AVKREFTET_FEILET', () => {
        const initialState = deepFreeze({
            avkrefter: true,
            avkreftFeilet: false,
            data: [
                {
                    navn: 'Ole Brum',
                    orgnummer: '81549300',
                    id: '1',
                },
                {
                    navn: 'Nasse Neoff',
                    orgnummer: '23529291',
                    id: '2',
                },
            ],
        });
        const action = avkreftLederFeilet();
        const nextState = ledere(initialState, action);
        expect(nextState).to.deep.equal({
            avkrefter: false,
            avkreftFeilet: true,
            data: initialState.data,
        });
    });

    it('håndterer LEDER_AVKREFTET', () => {
        const initialState = deepFreeze({
            avkrefter: true,
            avkreftFeilet: false,
            data: [
                {
                    navn: 'Ole Brum',
                    orgnummer: '81549300',
                    id: '1',
                },
                {
                    navn: 'Nasse Neoff',
                    orgnummer: '23529291',
                    id: '2',
                },
            ],
        });
        const action = lederAvkreftet('23529291');
        const nextState = ledere(initialState, action);

        expect(nextState).to.deep.equal({
            avkrefter: false,
            avkreftet: true,
            avkreftFeilet: false,
            data: [{
                navn: 'Ole Brum',
                orgnummer: '81549300',
                id: '1',
            }, {
                navn: 'Nasse Neoff',
                orgnummer: '23529291',
                id: '2',
                avkreftet: true,
            }],
        });
    });
});
