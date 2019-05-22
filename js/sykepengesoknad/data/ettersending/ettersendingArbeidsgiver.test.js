import deepFreeze from 'deep-freeze';
import { expect } from 'chai';
import * as actions from '../soknader/soknaderActions';
import { getSendtSoknadArbeidstaker } from '../../../../test/mock/mockSendtSoknadArbeidstaker';
import ettersendingArbeidsgiver, {
    ettersenderSoknadTilArbeidsgiver,
    ettersendSoknadTilArbeidsgiverFeilet,
    ettersendSoknadTilArbeidsgiverNullstill,
    soknadEttersendtTilArbeidsgiver,
} from './ettersendingArbeidsgiver';

describe('ettersending arbeidsgiver', () => {
    let getStateMedDataHentet;

    beforeEach(() => {
        getStateMedDataHentet = () => {
            const state = ettersendingArbeidsgiver();
            const action = actions.soknaderHentet(getSendtSoknadArbeidstaker());
            return ettersendingArbeidsgiver(deepFreeze(state), action);
        };
    });

    it('Håndterer ettersenderSoknadTilArbeidsgiver', () => {
        const initState = getStateMedDataHentet();
        const action = ettersenderSoknadTilArbeidsgiver();
        const state = ettersendingArbeidsgiver(deepFreeze(initState), action);
        expect(state.sender)
            .to
            .equal(true);
    });

    it('Håndterer soknadEttersendtTilArbeidsgiver', () => {
        const initState = getStateMedDataHentet();
        const action2 = ettersenderSoknadTilArbeidsgiver();
        const initState2 = ettersendingArbeidsgiver(deepFreeze(initState), action2);
        const action = soknadEttersendtTilArbeidsgiver();
        const state = ettersendingArbeidsgiver(deepFreeze(initState2), action);
        expect(state.sender)
            .to
            .equal(false);
    });

    it('Håndterer ettersendSoknadTilArbeidsgiverFeilet', () => {
        const initState = getStateMedDataHentet();
        const action = ettersendSoknadTilArbeidsgiverFeilet();
        const nextState = ettersendingArbeidsgiver(deepFreeze(initState), action);
        expect(nextState.sendingFeilet)
            .to
            .equal(true);
    });

    it('Håndterer ettersendSoknadTilArbeidsgiverNullstill', () => {
        const initState = getStateMedDataHentet();
        const action = ettersendSoknadTilArbeidsgiverFeilet();
        const initState2 = ettersendingArbeidsgiver(deepFreeze(initState), action);
        const action2 = ettersendSoknadTilArbeidsgiverNullstill();
        const nextState = ettersendingArbeidsgiver(deepFreeze(initState2), action2);
        expect(nextState.sendingFeilet)
            .to
            .equal(false);
    });
});
