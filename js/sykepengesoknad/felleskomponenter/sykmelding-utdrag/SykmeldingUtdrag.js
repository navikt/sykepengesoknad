import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SykmeldingUtdrag as SykmeldingUtdragForArbeidstakere, sykmelding as sykmeldingPt } from '@navikt/digisyfo-npm';
import { settErOppdelt } from '../../utils/settErOppdelt';
import { ARBEIDSTAKERE, SELVSTENDIGE_OG_FRILANSERE, ARBEIDSLEDIG, BEHANDLINGSDAGER, ANNET_ARBEIDSFORHOLD } from '../../enums/soknadtyper';
import SykmeldingUtdragForSelvstendige from '../../soknad-selvstendig-frilanser/sykmelding-utdrag/SykmeldingUtdragForSelvstendige';
import SykmeldingUtdragForArbeidsledige from '../../soknad-arbeidsledig/sykmelding-utdrag/SykmeldingUtdragForArbeidsledige';
import { soknadPt } from '../../prop-types/soknadProptype';
import SykmeldingUtdragForBehandlingsdager from '../../soknad-behandlingsdager/sykmelding-utdrag/SykmeldingUtdragForBehandlingsdager';

const Utdrag = ({ sykmelding, soknad, erApen, erOppdelt }) => {
    if (!sykmelding) {
        return null;
    }

    switch (soknad.soknadstype) {
        case ARBEIDSTAKERE:
            return (
                <SykmeldingUtdragForArbeidstakere
                    erApen={erApen}
                    sykmelding={sykmelding}
                    sykepengesoknad={{ _erOppdelt: erOppdelt }}
                />
            );

        case SELVSTENDIGE_OG_FRILANSERE:
            return (
                <SykmeldingUtdragForSelvstendige
                    erApen={erApen}
                    sykmelding={sykmelding}
                    erOppdelt={erOppdelt}
                />
            );

        case ARBEIDSLEDIG:
        case ANNET_ARBEIDSFORHOLD:
            return (
                <SykmeldingUtdragForArbeidsledige
                    erApen={erApen}
                    sykmelding={sykmelding}
                    erOppdelt={erOppdelt}
                />
            );

        case BEHANDLINGSDAGER:
            return (
                <SykmeldingUtdragForBehandlingsdager
                    erApen={erApen}
                    sykmelding={sykmelding}
                    soknad={soknad}
                    erOppdelt={erOppdelt}
                />
            );

        default:
            return null;
    }
};

Utdrag.propTypes = {
    sykmelding: sykmeldingPt,
    soknad: soknadPt,
    erApen: PropTypes.bool,
    erOppdelt: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
    const sykmelding = state.dineSykmeldinger.data.find((sykmld) => {
        return sykmld.id === ownProps.soknad.sykmeldingId;
    });
    return {
        sykmelding,
        erOppdelt: settErOppdelt(ownProps.soknad, sykmelding)._erOppdelt,
    };
};

const SykmeldingUtdrag = connect(mapStateToProps)(Utdrag);

export default SykmeldingUtdrag;
