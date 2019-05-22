import React from 'react';
import PropTypes from 'prop-types';
import Stegindikator, { arbeidstakerUrler } from '../components/soknad-felles/Stegindikator';
import { sykepengesoknad as sykepengesoknadPt, childEllerChildren } from '../propTypes/index';
import SykmeldingUtdragContainer from './SykmeldingUtdragContainer';
import { TilbakelenkeSoknad } from '../sykepengesoknad/felleskomponenter/TilbakelenkeSoknad';

const SykepengerSkjema = ({ children, aktivtSteg, tittel, sykepengesoknad }) => {
    return (<div>
        <Stegindikator aktivtSteg={aktivtSteg} soknadId={sykepengesoknad.id} />
        <TilbakelenkeSoknad aktivtSteg={aktivtSteg} soknadId={sykepengesoknad.id} urler={arbeidstakerUrler} />
        <SykmeldingUtdragContainer sykepengesoknad={sykepengesoknad} />
        { tittel && <h2 className="soknad__stegtittel">{tittel}</h2> }
        {children}
    </div>);
};

SykepengerSkjema.propTypes = {
    children: childEllerChildren,
    aktivtSteg: PropTypes.string,
    tittel: PropTypes.string,
    sykepengesoknad: sykepengesoknadPt,
};

export default SykepengerSkjema;
