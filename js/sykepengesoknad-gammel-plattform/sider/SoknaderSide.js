import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLedetekst } from '@navikt/digisyfo-npm';
import { bindActionCreators } from 'redux';
import Soknader from '../sykepengesoknader/Soknader';
import Side from '../../sider/Side';
import AppSpinner from '../../components/AppSpinner';
import Feilmelding from '../../components/Feilmelding';
import { sykepengesoknad as sykepengesoknadPt, brodsmule as brodsmulePt, soknadPt } from '../../propTypes/index';
import { hentSykepengesoknader } from '../data/sykepengesoknader/sykepengesoknader_actions';
import { hentSoknader } from '../../sykepengesoknad/data/soknader/soknaderActions';
import { skalHenteSykepengesoknader } from '../../selectors/sykepengesoknaderSelectors';
import { skalHenteSoknader } from '../../sykepengesoknad/data/soknader/soknaderSelectors';
import { selectSkalHenteDineSykmeldinger } from '../../sykmeldinger/data/dine-sykmeldinger/dineSykmeldingerSelectors';
import { hentDineSykmeldinger } from '../../sykmeldinger/data/dine-sykmeldinger/dineSykmeldingerActions';
import { ARBEIDSTAKERE } from '../../sykepengesoknad/enums/soknadtyper';
import { toggleNyArbeidstakerSoknad } from '../../selectors/unleashTogglesSelectors';

export class Container extends Component {
    componentWillMount() {
        this.props.actions.hentSykepengesoknader();
        this.props.actions.hentSoknader();
        this.props.actions.hentDineSykmeldinger();
    }

    render() {
        const {
            brodsmuler,
            henter,
            hentingFeilet,
            sykepengesoknader,
            soknader,
            visFeil } = this.props;

        return (
            <Side tittel={getLedetekst('soknader.sidetittel')} brodsmuler={brodsmuler} laster={henter}>
                {
                    (() => {
                        if (henter) {
                            return <AppSpinner />;
                        }
                        if (hentingFeilet) {
                            return <Feilmelding />;
                        }
                        return (<Soknader sykepengesoknader={sykepengesoknader} soknader={soknader} visFeil={visFeil} />);
                    })()
                }
            </Side>
        );
    }
}

Container.propTypes = {
    brodsmuler: PropTypes.arrayOf(brodsmulePt),
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    sykepengesoknader: PropTypes.arrayOf(sykepengesoknadPt),
    soknader: PropTypes.arrayOf(soknadPt),

    actions: PropTypes.shape({
        hentDineSykmeldinger: PropTypes.func,
        hentSykepengesoknader: PropTypes.func,
        hentSoknader: PropTypes.func,
    }),
    visFeil: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ hentSykepengesoknader, hentSoknader, hentDineSykmeldinger }, dispatch),
    };
}

export function mapStateToProps(state) {
    const sykepengesoknader = state.sykepengesoknader.data;
    const dineSykmeldinger = state.dineSykmeldinger.data;
    const soknader = toggleNyArbeidstakerSoknad(state)
        ? state.soknader.data.map((soknad) => {
            const sykmelding = dineSykmeldinger.find((sykmld) => {
                return sykmld.id === soknad.sykmeldingId;
            });
            return soknad.soknadstype === ARBEIDSTAKERE
                ? {
                    ...soknad,
                    sykmelding,
                }
                : soknad;
        })
        : state.soknader.data.filter((s) => {
            return s.soknadstype !== ARBEIDSTAKERE;
        });

    return {
        sykepengesoknader,
        soknader,
        henter: state.ledetekster.henter
            || state.sykepengesoknader.henter
            || state.soknader.henter
            || skalHenteSoknader(state)
            || skalHenteSykepengesoknader(state)
            || selectSkalHenteDineSykmeldinger(state),
        hentingFeilet: state.ledetekster.hentingFeilet
            || (state.sykepengesoknader.hentingFeilet && state.soknader.hentingFeilet),
        visFeil: [state.soknader.hentingFeilet, state.sykepengesoknader.hentingFeilet].some((s) => {
            return s;
        }),
        brodsmuler: [{
            tittel: getLedetekst('landingsside.sidetittel'),
            sti: '/',
            erKlikkbar: true,
        }, {
            tittel: getLedetekst('soknader.sidetittel'),
        }],
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
