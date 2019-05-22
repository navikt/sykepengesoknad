import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SykmeldingUtdrag, sykmelding as sykmeldingPt } from '@navikt/digisyfo-npm';
import AppSpinner from '../components/AppSpinner';
import { hentDineSykmeldinger as hentDineSykmeldingerAction } from '../sykmeldinger/data/dine-sykmeldinger/dineSykmeldingerActions';
import getContextRoot from '../utils/getContextRoot';

class Container extends Component {
    componentDidMount() {
        const { skalHenteSykmeldinger, hentDineSykmeldinger } = this.props;
        if (skalHenteSykmeldinger) {
            hentDineSykmeldinger();
        }
    }

    render() {
        const { sykmelding } = this.props;
        return sykmelding ? <SykmeldingUtdrag {...this.props} rootUrl={getContextRoot()} /> : <AppSpinner />;
    }
}

Container.propTypes = {
    skalHenteSykmeldinger: PropTypes.bool,
    hentDineSykmeldinger: PropTypes.func,
    sykmelding: sykmeldingPt,
};

const mapStateToProps = (state, ownProps) => {
    const sykmelding = state.dineSykmeldinger.data.find((s) => {
        return s.id === ownProps.sykepengesoknad.sykmeldingId;
    });
    return {
        skalHenteSykmeldinger: !state.dineSykmeldinger.henter && !state.dineSykmeldinger.hentet,
        sykmelding,
    };
};

const SykmeldingUtdragContainer = connect(mapStateToProps, { hentDineSykmeldinger: hentDineSykmeldingerAction })(Container);

export default SykmeldingUtdragContainer;
