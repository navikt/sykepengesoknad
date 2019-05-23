import deepFreeze from 'deep-freeze';
import { expect } from 'chai';
import * as actions from './reduxFormMeta_actions';
import reduxFormMeta from './reduxFormMeta';

describe('reduxFormMeta', () => {
    it('Returnerer initielt et tomt objekt', () => {
        expect(reduxFormMeta()).to.deep.equal({});
    });

    it('Håndterer sendSkjemaFeilet', () => {
        const action = actions.sendSkjemaFeilet('SYKEPENGERSKJEMA');
        expect(reduxFormMeta(deepFreeze({}), action)).to.deep.equal({
            SYKEPENGERSKJEMA: {
                status: 'SEND_SKJEMA_FEILET',
                settFokus: true,
            },
        });
    });

    it('Håndterer sendSkjemaFeilet for et random skjemanavn', () => {
        const action = actions.sendSkjemaFeilet('SYKEPENGERSKJEMA-random-random');
        expect(reduxFormMeta(deepFreeze({}), action)).to.deep.equal({
            'SYKEPENGERSKJEMA-random-random': {
                status: 'SEND_SKJEMA_FEILET',
                settFokus: true,
            },
        });
    });

    it('Håndterer sendSkjemaFeiletHandtert', () => {
        const action = actions.sendSkjemaFeiletHandtert('SYKEPENGERSKJEMA');
        expect(reduxFormMeta(deepFreeze({}), action)).to.deep.equal({
            SYKEPENGERSKJEMA: {
                status: 'SEND_SKJEMA_FEILET',
                settFokus: false,
            },
        });
    });

    it('Håndterer skjemaErGyldig etter sendSkjemaFeiletHandtert', () => {
        const action1 = actions.sendSkjemaFeiletHandtert('SYKEPENGERSKJEMA');
        const action2 = actions.skjemaErGyldig('SYKEPENGERSKJEMA');
        const state1 = reduxFormMeta(deepFreeze({}), action1);
        const state2 = reduxFormMeta(deepFreeze(state1), action2);
        expect(state2).to.deep.equal({
            SYKEPENGERSKJEMA: {
                status: 'SEND_SKJEMA_FEILET_HÅNDTERT',
                settFokus: false,
            },
        });
    });

    it('Håndterer sendSkjemaFeiletHandtert() etter sendSkjemaFeilet() for annet skjema', () => {
        const action1 = actions.sendSkjemaFeilet('SYKEPENGERSKJEMA');
        const action2 = actions.sendSkjemaFeilet('dinSykmeldingSkjema');
        const action3 = actions.sendSkjemaFeiletHandtert('SYKEPENGERSKJEMA');
        const state1 = reduxFormMeta(deepFreeze({}), action1);
        const state2 = reduxFormMeta(deepFreeze(state1), action2);
        const state3 = reduxFormMeta(deepFreeze(state2), action3);
        expect(state3).to.deep.equal({
            SYKEPENGERSKJEMA: {
                status: 'SEND_SKJEMA_FEILET',
                settFokus: false,
            },
            dinSykmeldingSkjema: {
                status: 'SEND_SKJEMA_FEILET',
                settFokus: true,
            },
        });
    });
});
