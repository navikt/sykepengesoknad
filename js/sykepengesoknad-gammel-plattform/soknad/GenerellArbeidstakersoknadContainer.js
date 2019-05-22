import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Feilmelding from '../../components/Feilmelding';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';
import * as soknadActions from '../data/sykepengesoknader/sykepengesoknader_actions';
import { getSoknadSkjemanavn } from '../../enums/skjemanavn';

const GenerellArbeidstakersoknadContainer = (props) => {
    const { Component, sykepengesoknad, hentingFeilet } = props;
    if (hentingFeilet) {
        return <Feilmelding />;
    }
    if (sykepengesoknad === undefined) {
        return (<Feilmelding
            tittel="Beklager, vi finner ikke søknaden du ser etter"
            melding="Er du sikker på at du er på riktig adresse?" />);
    }
    return <Component {...props} />;
};

GenerellArbeidstakersoknadContainer.propTypes = {
    hentingFeilet: PropTypes.bool,
    Component: PropTypes.func.isRequired,
    sykepengesoknad: sykepengesoknadPt,
};

const dekorerSkjemasoknad = (skjemasoknad, sykepengesoknad) => {
    if (skjemasoknad && sykepengesoknad && sykepengesoknad.forrigeSykeforloepTom) {
        return {
            ...skjemasoknad,
            forrigeSykeforloepTom: sykepengesoknad.forrigeSykeforloepTom,
        };
    }
    return skjemasoknad;
};

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(soknadActions, dispatch),
    };
}

export const mapStateToProps = (state, ownProps) => {
    const sykepengesoknad = state.sykepengesoknader.data.filter((soknad) => {
        return soknad.id === ownProps.params.sykepengesoknadId;
    })[0];
    const skjemanavn = getSoknadSkjemanavn(ownProps.params.sykepengesoknadId);
    const skjemasoknad = state.form && state.form[skjemanavn] ? state.form[skjemanavn].values : undefined;
    const dekorertSkjemasoknad = dekorerSkjemasoknad(skjemasoknad, sykepengesoknad);

    return {
        sykepengesoknad,
        skjemasoknad: dekorertSkjemasoknad,
        sender: state.sykepengesoknader.sender,
        sendingFeilet: state.sykepengesoknader.sendingFeilet,
    };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(GenerellArbeidstakersoknadContainer);

export default Container;
