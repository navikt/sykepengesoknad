import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Knapp from 'nav-frontend-knapper';
import { getLedetekst, sykmelding as sykmeldingPt } from '@navikt/digisyfo-npm';
import { angreBekreftSykmelding as angreBekreftSykmeldingAction } from '../data/din-sykmelding/dinSykmeldingActions';
import { selectKanEndreSykmeldingArbeidssituasjon } from '../data/dine-sykmeldinger/dineSykmeldingerSelectors';

export const Container = ({ sykmelding, angreBekreftSykmelding, angreBekreftSykmeldingFeilet, vis, angrerBekreftSykmelding }) => {
    return vis ? (
        <div>
            <div className="verktoylinje">
                <div className="verktoylinje__element">
                    <Knapp
                        mini
                        autoDisableVedSpinner
                        spinner={angrerBekreftSykmelding}
                        htmlType="button"
                        type="standard"
                        className="js-angre-bekreft-sykmelding"
                        onClick={() => { return angreBekreftSykmelding(sykmelding.id); }}>
                        {getLedetekst('din-sykmelding.godkjennt.angre')}
                    </Knapp>
                </div>
            </div>
            <div aria-live="polite">
                {
                    angreBekreftSykmeldingFeilet
                    && <p className="skjemaelement__feilmelding">{getLedetekst('din-sykmelding.godkjennt.angre.feilet')}</p>
                }
            </div>
        </div>
    ) : null;
};

Container.propTypes = {
    sykmelding: sykmeldingPt,
    angreBekreftSykmelding: PropTypes.func.isRequired,
    angreBekreftSykmeldingFeilet: PropTypes.bool,
    angrerBekreftSykmelding: PropTypes.bool,
    vis: PropTypes.bool,
};

export const mapStateToProps = (state, ownProps) => {
    const vis = selectKanEndreSykmeldingArbeidssituasjon(state, ownProps.sykmelding);
    return {
        vis,
        angreBekreftSykmeldingFeilet: state.dineSykmeldinger.angreBekreftSykmeldingFeilet,
        angrerBekreftSykmelding: state.dineSykmeldinger.angrerBekreftSykmelding,
    };
};

export const connectAngreArbeidssituasjon = (Component) => {
    return connect(mapStateToProps, {
        angreBekreftSykmelding: angreBekreftSykmeldingAction,
    })(Component);
};

export default connectAngreArbeidssituasjon(Container);
