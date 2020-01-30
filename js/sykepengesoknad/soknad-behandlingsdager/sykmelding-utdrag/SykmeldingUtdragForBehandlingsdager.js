import React from 'react';
import PropTypes from 'prop-types';
import {
    SykmeldingUtdrag as SykmeldingUtdragForArbeidstakere,
} from '@navikt/digisyfo-npm';
import { soknadPt, sykmelding as sykmeldingPt } from '../../../propTypes';
import SykmeldingUtdragForArbeidsledige from '../../soknad-arbeidsledig/sykmelding-utdrag/SykmeldingUtdragForArbeidsledige';
import SykmeldingUtdragForSelvstendige from '../../soknad-selvstendig-frilanser/sykmelding-utdrag/SykmeldingUtdragForSelvstendige';

const SykmeldingUtdragForBehandlingsdager = ({ erApen, sykmelding, soknad, erOppdelt }) => {
    switch (soknad.arbeidssituasjon) {
        case 'ARBEIDSTAKER':
            return (
                <SykmeldingUtdragForArbeidstakere
                    erApen={erApen}
                    sykmelding={sykmelding}
                    sykepengesoknad={{ _erOppdelt: erOppdelt }}
                />);
        case 'ARBEIDSLEDIG':
            return (
                <SykmeldingUtdragForArbeidsledige
                    erApen={erApen}
                    sykmelding={sykmelding}
                    erOppdelt={erOppdelt}
                />);
        case 'NAERINGSDRIVENDE':
        case 'FRILANSER':
            return (
                <SykmeldingUtdragForSelvstendige
                    erApen={erApen}
                    sykmelding={sykmelding}
                    erOppdelt={erOppdelt}
                />);
        default:
            return null;
    }
};

SykmeldingUtdragForBehandlingsdager.propTypes = {
    erApen: PropTypes.bool,
    erOppdelt: PropTypes.bool,
    sykmelding: sykmeldingPt,
    soknad: soknadPt,
};

export default SykmeldingUtdragForBehandlingsdager;
