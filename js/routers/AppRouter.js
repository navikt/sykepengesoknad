import React from 'react';
import PropTypes from 'prop-types';
import { Route, Router } from 'react-router';
import SoknaderSide from '../sykepengesoknad-gammel-plattform/sider/SoknaderSide';
import SykepengesoknadContainer from '../sykepengesoknad/sider/SoknadSide';

const AppRouter = ({ history }) => {
    return (<Router history={history}>
        <Route path={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader`} component={SoknaderSide} />
        <Route path={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/:sykepengesoknadId`} component={SykepengesoknadContainer} />
        <Route path={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/:sykepengesoknadId/:steg`} component={SykepengesoknadContainer} />
    </Router>);
};

AppRouter.propTypes = {
    history: PropTypes.shape({
        replace: PropTypes.func,
        push: PropTypes.func,
    }),
};

export default AppRouter;
