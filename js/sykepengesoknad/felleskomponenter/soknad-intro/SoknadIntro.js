import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ForsteSoknadIntro from '../../../sykepengesoknad-gammel-plattform/for-du-begynner/ForsteSoknadIntro';
import SoknadIntro from '../../../sykepengesoknad-gammel-plattform/for-du-begynner/SoknadIntro';
import { erForsteSoknad as erForsteSoknadSelector } from '../../data/soknader/soknaderSelectors';
import { soknadPt } from '../../prop-types/soknadProptype';
import { ARBEIDSTAKERE, SELVSTENDIGE_OG_FRILANSERE } from '../../enums/soknadtyper';
import ForsteSelvstendigFrilanserSoknadIntro from '../../soknad-selvstendig-frilanser/for-du-begynner/ForsteSelvstendigFrilanserSoknadIntro';
import SelvstendigFrilanserSoknadIntro from '../../soknad-selvstendig-frilanser/for-du-begynner/SelvstendigFrilanserSoknadIntro';

const Intro = ({ erForsteSoknad, soknad }) => {
    switch (soknad.soknadstype) {
        case ARBEIDSTAKERE: {
            return erForsteSoknad
                ? <ForsteSoknadIntro />
                : <SoknadIntro />;
        }
        case SELVSTENDIGE_OG_FRILANSERE: {
            return erForsteSoknad
                ? <ForsteSelvstendigFrilanserSoknadIntro />
                : <SelvstendigFrilanserSoknadIntro />;
        }
        default: {
            return null;
        }
    }
};

Intro.propTypes = {
    erForsteSoknad: PropTypes.bool,
    soknad: soknadPt,
};

const mapStateToProps = (state) => {
    return {
        erForsteSoknad: erForsteSoknadSelector(state),
    };
};

export default connect(mapStateToProps)(Intro);
