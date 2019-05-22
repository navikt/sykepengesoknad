import { Link } from 'react-router';
import { getLedetekst } from '@navikt/digisyfo-npm';
import React from 'react';

export const LenkeTilSoknader = () => {
    return (<Link to={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader`} className="tilbakelenke">
        {getLedetekst('sykepengesoknad.navigasjon.gaa-til')}
    </Link>);
};
