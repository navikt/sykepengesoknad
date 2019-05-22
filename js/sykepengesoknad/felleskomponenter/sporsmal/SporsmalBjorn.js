import React from 'react';
import PropTypes from 'prop-types';
import { Bjorn } from '@navikt/digisyfo-npm';
import { fjernIndexFraTag } from './fieldUtils';
import { JOBBET_DU_100_PROSENT, JOBBET_DU_GRADERT } from '../../enums/tagtyper';
import { soknadPt } from '../../../propTypes/index';
import { ARBEIDSTAKERE } from '../../enums/soknadtyper';

const tagsMedBjorn = {
    [ARBEIDSTAKERE]: [JOBBET_DU_GRADERT, JOBBET_DU_100_PROSENT],
};

const harBjorntekst = (tag, soknadstype) => {
    return tagsMedBjorn[soknadstype]
        && tagsMedBjorn[soknadstype].indexOf(fjernIndexFraTag(tag)) > -1;
};

const hentBjornNokkel = (tag) => {
    const tagUtenIndex = fjernIndexFraTag(tag);
    return `soknad.bjorn.${tagUtenIndex.toLowerCase()}`;
};

const SporsmalBjorn = ({ tag, className, soknad }) => {
    return harBjorntekst(tag, soknad.soknadstype)
        ? <Bjorn className={className} nokkel={hentBjornNokkel(tag)} />
        : null;
};

SporsmalBjorn.propTypes = {
    tag: PropTypes.string,
    className: PropTypes.string,
    soknad: soknadPt,
};

export default SporsmalBjorn;
