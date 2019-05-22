import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SykmeldingUtdrag as SykmeldingUtdragForArbeidstakere, sykmelding as sykmeldingPt } from '@navikt/digisyfo-npm';
import { settErOppdelt } from '../../utils/settErOppdelt';
import { ARBEIDSTAKERE, SELVSTENDIGE_OG_FRILANSERE } from '../../enums/soknadtyper';
import SykmeldingUtdragForSelvstendige from '../../soknad-selvstendig-frilanser/sykmelding-utdrag/SykmeldingUtdragForSelvstendige';
import { soknadPt } from '../../prop-types/soknadProptype';

const Utdrag = ({ sykmelding, soknad, erApen, erOppdelt }) => {
    return soknad.soknadstype === ARBEIDSTAKERE
        && sykmelding
        ? <SykmeldingUtdragForArbeidstakere
            erApen={erApen}
            sykmelding={sykmelding}
            sykepengesoknad={{ _erOppdelt: erOppdelt }} />
        : soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE
            && sykmelding
            ? <SykmeldingUtdragForSelvstendige
                erApen={erApen}
                sykmelding={sykmelding}
                erOppdelt={erOppdelt} />
            : null;
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
