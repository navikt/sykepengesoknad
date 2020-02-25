import React from 'react';
import PropTypes from 'prop-types';
import {
    SykmeldingUtdrag as SykmeldingUtdragForArbeidstakere,
} from '@navikt/digisyfo-npm';
import { soknadPt, sykmelding as sykmeldingPt } from '../../../propTypes';
import SykmeldingUtdragForArbeidsledige from '../../soknad-arbeidsledig/sykmelding-utdrag/SykmeldingUtdragForArbeidsledige';
import SykmeldingUtdragForSelvstendige from '../../soknad-selvstendig-frilanser/sykmelding-utdrag/SykmeldingUtdragForSelvstendige';
import { ARBEIDSSITUASJON_ARBEIDSLEDIG, ARBEIDSSITUASJON_ARBEIDSTAKER, ARBEIDSSITUASJON_FRILANSER, ARBEIDSSITUASJON_SELVSTENDIG } from '../../enums/arbeidssituasjon';

const SykmeldingUtdragForBehandlingsdager = ({ erApen, sykmelding, soknad, erOppdelt }) => {
    if (soknad) {
        switch (soknad.arbeidssituasjon) {
            case ARBEIDSSITUASJON_ARBEIDSTAKER:
                return (
                    <SykmeldingUtdragForArbeidstakere
                        erApen={erApen}
                        sykmelding={sykmelding}
                        sykepengesoknad={{ _erOppdelt: erOppdelt }}
                    />);
            case ARBEIDSSITUASJON_ARBEIDSLEDIG:
                return (
                    <SykmeldingUtdragForArbeidsledige
                        erApen={erApen}
                        sykmelding={sykmelding}
                        erOppdelt={erOppdelt}
                    />);
            case ARBEIDSSITUASJON_SELVSTENDIG:
            case ARBEIDSSITUASJON_FRILANSER:
                return (
                    <SykmeldingUtdragForSelvstendige
                        erApen={erApen}
                        sykmelding={sykmelding}
                        erOppdelt={erOppdelt}
                    />);
            default:
                return null;
        }
    }
    return null;
};

SykmeldingUtdragForBehandlingsdager.propTypes = {
    erApen: PropTypes.bool,
    erOppdelt: PropTypes.bool,
    sykmelding: sykmeldingPt,
    soknad: soknadPt,
};

export default SykmeldingUtdragForBehandlingsdager;
