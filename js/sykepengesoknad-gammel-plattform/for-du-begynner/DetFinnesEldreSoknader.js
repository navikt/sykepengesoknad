import React from 'react';
import PropTypes from 'prop-types';
import { getLedetekst } from '@navikt/digisyfo-npm';
import Alertstripe from 'nav-frontend-alertstriper';
import { Link } from 'react-router';

const DetFinnesEldreSoknader = ({ eldsteSoknadId }) => {
    return (<Alertstripe type="info" className="blokk">
        <p className="sist">{getLedetekst('sykepengesoknad.eldre-soknad.varsel.melding')}</p>
        <p className="sist">
            <Link className="lenke" to={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${eldsteSoknadId}`}>{getLedetekst('sykepengesoknad.eldre-soknad.varsel.lenke')}</Link>
        </p>
    </Alertstripe>);
};

DetFinnesEldreSoknader.propTypes = {
    eldsteSoknadId: PropTypes.string,
};

export default DetFinnesEldreSoknader;
