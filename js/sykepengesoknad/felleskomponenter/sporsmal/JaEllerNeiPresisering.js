import React from 'react';
import { getHtmlLedetekst } from '@navikt/digisyfo-npm';
import PropTypes from 'prop-types';
import { ARBEIDSTAKERE } from '../../enums/soknadtyper';
import {
    INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD_ER_DU_SYKMELDT,
    INNTEKTSKILDE_ARBEIDSFORHOLD_ER_DU_SYKMELDT,
    INNTEKTSKILDE_FRILANSER_ER_DU_SYKMELDT,
    INNTEKTSKILDE_JORDBRUKER_ER_DU_SYKMELDT,
    INNTEKTSKILDE_SELVSTENDIG_DAGMAMMA_ER_DU_SYKMELDT,
    INNTEKTSKILDE_SELVSTENDIG_ER_DU_SYKMELDT, UTLANDSOPPHOLD_SOKT_SYKEPENGER,
} from '../../enums/tagtyper';
import { JA, NEI } from '../../enums/svarEnums';
import { fjernIndexFraTag } from './fieldUtils';
import { soknadPt } from '../../../propTypes/index';

const visPresisering = (tag, value, soknadstype) => {
    const tagsMedPresisering = {
        [ARBEIDSTAKERE]: {
            [INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD_ER_DU_SYKMELDT]: [JA],
            [INNTEKTSKILDE_SELVSTENDIG_DAGMAMMA_ER_DU_SYKMELDT]: [JA],
            [INNTEKTSKILDE_ARBEIDSFORHOLD_ER_DU_SYKMELDT]: [JA],
            [INNTEKTSKILDE_SELVSTENDIG_ER_DU_SYKMELDT]: [JA],
            [INNTEKTSKILDE_JORDBRUKER_ER_DU_SYKMELDT]: [JA],
            [INNTEKTSKILDE_FRILANSER_ER_DU_SYKMELDT]: [JA],
            [UTLANDSOPPHOLD_SOKT_SYKEPENGER]: [JA, NEI],
        },
    };
    return tagsMedPresisering[soknadstype]
        && tagsMedPresisering[soknadstype][fjernIndexFraTag(tag)]
        && tagsMedPresisering[soknadstype][fjernIndexFraTag(tag)].indexOf(value) > -1;
};

const JaEllerNeiPresisering = ({ tag, value, soknad }) => {
    return visPresisering(tag, value, soknad.soknadstype)
        ? <div className="presisering blokk">
            <p
                className="sist"
                dangerouslySetInnerHTML={getHtmlLedetekst(`soknad.infotekst.${fjernIndexFraTag(tag).toLowerCase()}.${value.toLowerCase()}.infotekst`)} />
        </div>
        : null;
};

JaEllerNeiPresisering.propTypes = {
    tag: PropTypes.string,
    value: PropTypes.string,
    soknad: soknadPt,
};

export default JaEllerNeiPresisering;
