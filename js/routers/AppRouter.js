import React from 'react';
import PropTypes from 'prop-types';
import { Route, Router } from 'react-router';
import amplitude from 'amplitude-js';
import { AmplitudeProvider } from '@amplitude/react-amplitude/src';
import SoknaderSide from '../sykepengesoknad-gammel-plattform/sider/SoknaderSide';
import SykepengesoknadContainer from '../sykepengesoknad/sider/SoknadSide';
import FoerDuBegynnerUtlandContainer from '../sykepengesoknad/soknad-utland/for-du-begynner/FoerDuBegynnerUtlandContainer';


const AppRouter = ({ history }) => {
    return (<AmplitudeProvider amplitudeInstance={amplitude.getInstance().init(
        `${process.env.AMPLITUDE_APIKEY}`, null, {
            apiEndpoint: 'amplitude.nav.no/collect',
            saveEvents: true,
            includeUtm: true,
            includeReferrer: true,
            trackingOptions: {
                city: false,
                ip_address: false,
            },
        },
    )}>
        <Router history={history}>
            <Route path={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/:sykepengesoknadId`} component={SykepengesoknadContainer} />
            <Route path={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/:sykepengesoknadId/:steg`} component={SykepengesoknadContainer} />
            <Route path={`${process.env.REACT_APP_CONTEXT_ROOT}/sykepengesoknad-utland`} component={FoerDuBegynnerUtlandContainer} />
            <Route path="*" component={SoknaderSide} />
        </Router>
    </AmplitudeProvider>);
};

AppRouter.propTypes = {
    history: PropTypes.shape({
        replace: PropTypes.func,
        push: PropTypes.func,
    }),
};

export default AppRouter;
