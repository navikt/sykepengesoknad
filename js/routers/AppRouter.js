import React from 'react';
import PropTypes from 'prop-types';
import { Route, Router } from 'react-router';
import SoknaderSide from '../sykepengesoknad-gammel-plattform/sider/SoknaderSide';
import SykepengesoknadContainer from '../sykepengesoknad/sider/SoknadSide';
import FoerDuBegynnerUtlandContainer from '../sykepengesoknad/soknad-utland/for-du-begynner/FoerDuBegynnerUtlandContainer';


const AppRouter = ({ history }) => {
    console.log(process.env);
    return (<Router history={history}>
        <Route path={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/:sykepengesoknadId`} component={SykepengesoknadContainer} />
        <Route path={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/:sykepengesoknadId/:steg`} component={SykepengesoknadContainer} />
        <Route path={`${process.env.REACT_APP_CONTEXT_ROOT}/sykepengesoknad-utland`} component={FoerDuBegynnerUtlandContainer} />
        <Route path="*" component={SoknaderSide} />
    </Router>);
};

AppRouter.propTypes = {
    history: PropTypes.shape({
        replace: PropTypes.func,
        push: PropTypes.func,
    }),
};

export default AppRouter;
