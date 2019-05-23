import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLedetekst, sykmelding as sykmeldingPt } from '@navikt/digisyfo-npm';
import EndreArbeidssituasjonLightbox from './EndreArbeidssituasjonLightbox';
import { selectKanEndreSykmeldingArbeidssituasjon } from '../../../data/dine-sykmeldinger/dineSykmeldingerSelectors';
import { angreBekreftSykmelding as angreBekreftSykmeldingAction } from '../../../data/din-sykmelding/dinSykmeldingActions';

class EndreArbeidssituasjonLenke extends Component {
    constructor(props) {
        super(props);
        this.toggleLightbox = this.toggleLightbox.bind(this);
        this.state = {
            visLightbox: false,
        };
    }

    toggleLightbox(e) {
        if (e) {
            e.preventDefault();
        }
        this.setState({
            visLightbox: !this.state.visLightbox,
        });
    }

    render() {
        return this.props.vis
            ? (<div>
                <EndreArbeidssituasjonLightbox
                    isOpen={this.state.visLightbox}
                    onClose={this.toggleLightbox}
                    sykmelding={this.props.sykmelding}
                    angreBekreftSykmelding={this.props.angreBekreftSykmelding}
                    angreBekreftSykmeldingFeilet={this.props.angreBekreftSykmeldingFeilet} />
                <p>
                    <button type="button" className="lenke" onClick={this.toggleLightbox}>
                        {getLedetekst('din-sykmelding.gjenapne.apne-lightbox')}
                    </button>
                </p>
            </div>)
            : null;
    }
}

EndreArbeidssituasjonLenke.propTypes = {
    sykmelding: sykmeldingPt,
    angreBekreftSykmelding: PropTypes.func,
    angreBekreftSykmeldingFeilet: PropTypes.bool,
    vis: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
    const vis = selectKanEndreSykmeldingArbeidssituasjon(state, ownProps.sykmelding);
    return {
        vis,
        angreBekreftSykmeldingFeilet: state.dineSykmeldinger.angreBekreftSykmeldingFeilet,
        angrerBekreftSykmelding: state.dineSykmeldinger.angrerBekreftSykmelding,
    };
};

const EndreArbeidssituasjon = connect(mapStateToProps, {
    angreBekreftSykmelding: angreBekreftSykmeldingAction,
})(EndreArbeidssituasjonLenke);

export default EndreArbeidssituasjon;
