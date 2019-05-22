import { Link } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { frilanserOgSelvstendigUrler } from '../../components/soknad-felles/Stegindikator';

export const TilbakelenkeSoknad = ({ aktivtSteg, soknadId, urler = frilanserOgSelvstendigUrler }) => {
    const to = `/sykepengesoknad/soknader/${soknadId}/${urler[aktivtSteg - 2]}`;
    return aktivtSteg && aktivtSteg > 1
        ? <p>
            <Link className="tilbakelenke" to={to}>Tilbake</Link>
        </p>
        : null;
};

TilbakelenkeSoknad.propTypes = {
    aktivtSteg: PropTypes.number,
    soknadId: PropTypes.string,
    urler: PropTypes.arrayOf(PropTypes.string),
};
