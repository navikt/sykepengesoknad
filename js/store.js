import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import reducers from "./data/rootReducer";
import createSagaMiddleware from "@redux-saga/core";
import rootSaga from "./data/rootSaga";
import {forlengInnloggetSesjon, hentLedetekster, setPerformOnHttpCalls, sjekkInnloggingssesjon} from "@navikt/digisyfo-npm";
import {hentVedlikehold} from "./data/vedlikehold/vedlikehold_actions";
import {hentUnleashToggles} from "./data/unleashToggles/unleashToggles_actions";
import {hentSoknader} from "./sykepengesoknad/data/soknader/soknaderActions";

const rootReducer = combineReducers(reducers);

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(sagaMiddleware),
));

sagaMiddleware.run(rootSaga);

// <OBS>: Minimer antall kall som gjøres her!
store.dispatch(hentLedetekster());
store.dispatch(hentVedlikehold());
store.dispatch(forlengInnloggetSesjon());
store.dispatch(hentUnleashToggles());
store.dispatch(hentSoknader());
// </OBS>

setPerformOnHttpCalls(() => {
    store.dispatch(forlengInnloggetSesjon());
});

setInterval(() => {
    store.dispatch(sjekkInnloggingssesjon());
}, 5000);


export default store;
