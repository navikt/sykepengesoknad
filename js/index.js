import 'whatwg-fetch';
import 'babel-polyfill';
import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import history from './history';
import '../styles/styles.less';
import './logging';
import store from './store';

if (window.location.href.indexOf('visLedetekster=true') > -1) {
    window.VIS_LEDETEKSTNOKLER = true;
} else if (window.location.href.indexOf('visLedetekster=false') > -1) {
    window.VIS_LEDETEKSTNOKLER = false;
}

render(<Provider store={store}>
    <AppRouter history={history} />
</Provider>, document.getElementById('maincontent'));

export {
    store,
    history,
};
