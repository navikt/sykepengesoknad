import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { timeout } from '@navikt/digisyfo-npm';
import createSagaMiddleware from 'redux-saga';
import dineSykmeldinger from '../js/data/dine-sykmeldinger/dineSykmeldinger';
import brukerinfo from '../js/data/brukerinfo/brukerinfo';
import unleashToggles from '../js/data/unleashToggles/unleashToggles';

const defaultState = {
    dineSykmeldinger: dineSykmeldinger(),
    brukerinfo: brukerinfo(),
    timeout: timeout(),
    unleashToggles: unleashToggles(),
};

const mountWithStore = (child, _state = {}) => {
    const state = {
        ...defaultState,
        ..._state,
    };
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];
    const mockStore = configureMockStore(middlewares);
    const store = mockStore(state);
    return mount(<Provider store={store}>{child}</Provider>);
};

export default mountWithStore;
