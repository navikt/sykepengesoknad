import React, { Component } from 'react';
import { getLedetekst } from '@navikt/digisyfo-npm';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { skjemasvar as skjemasvarPt, soknadPt, soknadmottakerPt } from '../../../propTypes';
import { ARBEIDSGIVER, ARBEIDSGIVER_OG_NAV, NAV } from '../../enums/soknadmottakertyper';
import { hentSoknadMottaker } from '../../data/soknadMeta/soknadMetaActions';
import populerSoknadMedSvar from '../../utils/populerSoknadMedSvar';
import { soknadMottakerSelector } from '../../data/soknadMeta/soknadMetaSelectors';

const mottakerTekst = (sendesTil, mottakernavn) => {
    switch (sendesTil) {
        case NAV: {
            return getLedetekst('sykepengesoknad.oppsummering.nav-som-mottaker');
        }
        case ARBEIDSGIVER: {
            return getLedetekst('sykepengesoknad.oppsummering.arbeidsgiver-som-mottaker', { '%ARBEIDSGIVER%': mottakernavn });
        }
        case ARBEIDSGIVER_OG_NAV: {
            return getLedetekst('sykepengesoknad.oppsummering.nav-og-arbeidsgiver-som-mottaker', { '%ARBEIDSGIVER%': mottakernavn });
        }
        default: {
            return null;
        }
    }
};


class SoknadMottakerComponent extends Component {
    componentDidMount() {
        this.hentMottaker();
    }

    hentMottaker() {
        const populertSoknad = populerSoknadMedSvar(this.props.soknad, this.props.skjemasvar);
        this.props.hentSoknadMottaker(populertSoknad);
    }

    render() {
        return this.props.hentingfeilet
            ? null
            : (<p className="js-mottaker sykepengerskjema__sendesTil" aria-busy={this.props.henter}>
                {
                    this.props.henter
                        ? getLedetekst('soknad.mottaker.henter')
                        : mottakerTekst(this.props.mottaker, this.props.mottakernavn)
                }
            </p>);
    }
}

SoknadMottakerComponent.propTypes = {
    skjemasvar: skjemasvarPt,
    soknad: soknadPt,
    mottakernavn: PropTypes.string,
    hentSoknadMottaker: PropTypes.func,
    mottaker: soknadmottakerPt,
    hentingfeilet: PropTypes.bool,
    henter: PropTypes.bool,
};

export const mapStateToSoknadMottakerProps = (state, ownProps) => {
    const soknadMeta = state.soknadMeta[ownProps.soknad.id];
    return {
        mottaker: soknadMottakerSelector(state, ownProps.soknad.id),
        hentingfeilet: soknadMeta && soknadMeta.hentingFeilet,
        henter: soknadMeta && soknadMeta.henter,
    };
};

const SoknadMottaker = connect(mapStateToSoknadMottakerProps, { hentSoknadMottaker })(SoknadMottakerComponent);

export default SoknadMottaker;
