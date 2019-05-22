import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Bjorn, getLedetekst } from '@navikt/digisyfo-npm';
import { formValueSelector } from 'redux-form';
import { SYKMELDINGSGRAD, FERIE } from '../../enums/tagtyper';
import { formaterEnkeltverdi } from './fieldUtils';
import { NEI, JA } from '../../enums/svarEnums';
import { getSkjemanavnFraSoknad } from '../../utils/getSkjemanavnFraSoknad';

const sporsmalMedBjorn = {
    [SYKMELDINGSGRAD]: NEI,
    [FERIE]: JA,
};

const ledetekstNokler = {
    [SYKMELDINGSGRAD]: 'sykepengesoknad-utland.skjema.bjorn',
    [FERIE]: 'sykepengesoknad-utland.skjema.ferie-sporsmal-bjorn',
};

export const SporsmalBjornComponent = ({ vis, tag }) => {
    return vis
        ? (<Bjorn className="press">
            <p>{getLedetekst(ledetekstNokler[tag])}</p>
        </Bjorn>)
        : null;
};

SporsmalBjornComponent.propTypes = {
    vis: PropTypes.bool,
    tag: PropTypes.string,
};

export function mapStateToProps(state, ownProps) {
    const skjemanavn = getSkjemanavnFraSoknad(ownProps.soknad);
    const selector = formValueSelector(skjemanavn);
    const feltVerdi = selector(state, ownProps.tag);
    return {
        vis: sporsmalMedBjorn[ownProps.tag] === undefined
            ? false
            : sporsmalMedBjorn[ownProps.tag] === formaterEnkeltverdi(feltVerdi),
    };
}

export default connect(mapStateToProps)(SporsmalBjornComponent);
