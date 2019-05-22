import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import { onSubmitFail } from '../../containers/skjema/FeiloppsummeringContainer';
import { sendSoknad, lagreSoknad, oppdaterSoknader } from '../data/soknader/soknaderActions';
import { getSoknadSkjemanavn } from '../../enums/skjemanavn';
import { utfyllingStartet } from '../../actions/metrikker_actions';
import fraBackendsoknadTilInitiellSoknad from './fraBackendsoknadTilInitiellSoknad';

export const finnSoknad = (state, ownProps) => {
    const soknader = state.soknader.data.filter((s) => {
        return s.id === ownProps.params.sykepengesoknadId;
    });
    return soknader.length === 1 ? soknader[0] : undefined;
};

export const finnSykmelding = (state, ownProps) => {
    const soknad = finnSoknad(state, ownProps);
    const sykmeldinger = state.dineSykmeldinger.data.filter((s) => {
        return s.id === soknad.sykmeldingId;
    });
    return sykmeldinger.length === 1 ? sykmeldinger[0] : undefined;
};

const mapStateToProps = (state, ownProps) => {
    const soknad = finnSoknad(state, ownProps);
    return {
        soknad,
        oppdaterer: state.soknader.oppdaterer,
        soknadMeta: state.soknadMeta[soknad.id] || {},
        sykmelding: finnSykmelding(state, ownProps),
        skjemasvar: getFormValues(getSoknadSkjemanavn(ownProps.params.sykepengesoknadId))(state),
        sender: state.soknader.sender,
        sendingFeilet: state.soknader.sendingFeilet,
        key: ownProps.sidenummer
            ? `${soknad.id}-side-${ownProps.sidenummer}`
            : soknad.id,
        form: getSoknadSkjemanavn(soknad.id),
    };
};

const mapStateToPropsMedInitialValues = (state, ownProps) => {
    const soknad = finnSoknad(state, ownProps);
    return {
        initialValues: fraBackendsoknadTilInitiellSoknad(soknad),
        ...mapStateToProps(state, ownProps),
    };
};

const mapDispatchToProps = (dispatch) => {
    const actions = bindActionCreators({
        sendSoknad,
        utfyllingStartet,
        lagreSoknad,
        oppdaterSoknader,
    }, dispatch);

    return {
        actions,
    };
};

const soknadSetup = (validate, Component, initialize = false) => {
    const connected = initialize
        ? connect(mapStateToPropsMedInitialValues, mapDispatchToProps)
        : connect(mapStateToProps, mapDispatchToProps);

    return compose(
        connected,
        reduxForm({
            validate,
            destroyOnUnmount: false,
            forceUnregisterOnUnmount: true,
            enableReinitialize: true,
            keepDirtyOnReinitialize: true,
            onSubmitFail: (errors, dispatch, submitError, props) => {
                onSubmitFail(errors, dispatch, getSoknadSkjemanavn(props.soknad.id));
            },
        }),
    )(Component);
};

export default soknadSetup;
