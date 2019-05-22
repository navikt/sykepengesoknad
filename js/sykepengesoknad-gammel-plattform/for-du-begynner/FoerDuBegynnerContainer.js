import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLedetekst, sykepengesoknadstatuser } from '@navikt/digisyfo-npm';
import { destroy } from 'redux-form';
import FoerDuBegynner from './FoerDuBegynner';
import GenerellSoknadContainer from '../soknad/GenerellArbeidstakersoknadContainer';
import SoknadSendt from '../soknad/soknad-sendt/SoknadSendt';
import SoknadUtgaatt from '../soknad/SoknadUtgaatt';
import Feilmelding from '../../components/Feilmelding';
import { datoMedKlokkeslett } from '../../utils/datoUtils';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';
import { hentBerikelse } from '../data/sykepengesoknader/sykepengesoknader_actions';
import SoknadAvbrutt from '../soknad/soknad-avbrutt/SoknadAvbrutt';
import { filtrerOgSorterNyeSoknader } from '../sykepengesoknader/Soknader';
import { erForsteSykepengesoknad } from '../../selectors/sykepengesoknaderSelectors';
import { utfyllingStartet as utfyllingStartetAction } from '../../actions/metrikker_actions';

const { NY, SENDT, UTGAATT, TIL_SENDING, UTKAST_TIL_KORRIGERING, KORRIGERT, AVBRUTT, SLETTET_UTKAST } = sykepengesoknadstatuser;

export const Controller = (props) => {
    const { sykepengesoknad, vedlikehold } = props;

    if (vedlikehold && vedlikehold.datospennMedTid) {
        return (<Feilmelding
            tittel={getLedetekst('under-vedlikehold.varsel.tittel')}
            melding={getLedetekst('under-vedlikehold.varsel.tekst', {
                '%FRA%': datoMedKlokkeslett(vedlikehold.datospennMedTid.fom),
                '%TIL%': datoMedKlokkeslett(vedlikehold.datospennMedTid.tom),
            })} />);
    }
    switch (sykepengesoknad.status) {
        case NY:
        case UTKAST_TIL_KORRIGERING: {
            return <FoerDuBegynner {...props} />;
        }
        case SENDT:
        case TIL_SENDING:
        case KORRIGERT: {
            return <SoknadSendt sykepengesoknad={sykepengesoknad} />;
        }
        case UTGAATT: {
            return <SoknadUtgaatt sykepengesoknad={sykepengesoknad} />;
        }
        case AVBRUTT:
        case SLETTET_UTKAST: {
            return <SoknadAvbrutt sykepengesoknad={sykepengesoknad} />;
        }
        default: {
            return <Feilmelding tittel="Søknaden har ukjent status" />;
        }
    }
};

Controller.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
    vedlikehold: PropTypes.shape({
        datospennMedTid: PropTypes.object,
    }),
};

export class Container extends Component {
    componentDidMount() {
        if (this.props.skalHenteBerikelse) {
            this.props.hentBerikelse(this.props.sykepengesoknadId);
        }
    }

    render() {
        const { params, vedlikehold, henter, erForsteSoknad, detFinnesEldreSoknader, eldsteSoknadId, utfyllingStartet } = this.props;
        return (<GenerellSoknadContainer
            erForsteSoknad={erForsteSoknad}
            henter={henter}
            Component={Controller}
            params={params}
            vedlikehold={vedlikehold}
            detFinnesEldreSoknader={detFinnesEldreSoknader}
            utfyllingStartet={utfyllingStartet}
            eldsteSoknadId={eldsteSoknadId} />);
    }
}


Container.propTypes = {
    params: PropTypes.shape({
        sykepengesoknadId: PropTypes.string,
    }),
    sykepengesoknadId: PropTypes.string,
    henter: PropTypes.bool,
    vedlikehold: PropTypes.shape({
        data: PropTypes.shape({
            vedlikehold: PropTypes.bool,
        }),
    }),
    hentBerikelse: PropTypes.func,
    erForsteSoknad: PropTypes.bool,
    skalHenteBerikelse: PropTypes.bool,
    detFinnesEldreSoknader: PropTypes.bool,
    eldsteSoknadId: PropTypes.string,
    utfyllingStartet: PropTypes.func,
};

export const mapStateToProps = (state, ownProps) => {
    const henter = state.vedlikehold.henter || state.sykepengesoknader.henterBerikelse;
    const sykepengesoknadId = ownProps.params.sykepengesoknadId;
    const skalHenteBerikelse = state.sykepengesoknader.data.some((s) => {
        return s.id === sykepengesoknadId;
    });

    const soknader = filtrerOgSorterNyeSoknader(state.sykepengesoknader.data);
    const eldsteSoknadId = soknader[0] ? soknader[0].id : '';
    const detFinnesEldreSoknader = eldsteSoknadId !== sykepengesoknadId;

    return {
        henter,
        sykepengesoknadId,
        vedlikehold: state.vedlikehold.data.vedlikehold,
        erForsteSoknad: erForsteSykepengesoknad(state),
        skalHenteBerikelse,
        detFinnesEldreSoknader,
        eldsteSoknadId,
    };
};

const FoerDuBegynnerContainer = connect(mapStateToProps, {
    hentBerikelse,
    destroy,
    utfyllingStartet: utfyllingStartetAction,
})(Container);

export default FoerDuBegynnerContainer;
