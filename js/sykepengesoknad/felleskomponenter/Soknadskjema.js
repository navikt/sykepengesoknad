import React from 'react';
import PropTypes from 'prop-types';
import { sykmelding as sykmeldingPt, SykmeldingUtdrag } from '@navikt/digisyfo-npm';
import { childEllerChildren, soknadPt } from '../../propTypes/index';
import { settErOppdelt } from '../utils/settErOppdelt';
import Stegindikator, { frilanserOgSelvstendigUrler } from '../../components/soknad-felles/Stegindikator';
import KorrigerVarsel from '../../components/soknad-felles/KorrigerVarsel';
import { UTKAST_TIL_KORRIGERING } from '../enums/soknadstatuser';
import SykmeldingUtdragForSelvstendige from '../soknad-selvstendig-frilanser/sykmelding-utdrag/SykmeldingUtdragForSelvstendige';
import { ARBEIDSTAKERE, SELVSTENDIGE_OG_FRILANSERE } from '../enums/soknadtyper';
import TidligSoknad from '../../components/soknad-felles/TidligSoknad';
import { TilbakelenkeSoknad } from './TilbakelenkeSoknad';

const Soknadskjema = ({ children, aktivtSteg = null, tittel, soknad, sykmelding, intro = null, apentUtdrag = false }) => {
    const { _erOppdelt } = settErOppdelt(soknad, sykmelding);

    return (<div>
        { aktivtSteg && <Stegindikator aktivtSteg={aktivtSteg} soknadId={soknad.id} urler={frilanserOgSelvstendigUrler} /> }
        <TilbakelenkeSoknad aktivtSteg={aktivtSteg} soknadId={soknad.id} urler={frilanserOgSelvstendigUrler} />
        {soknad.status === UTKAST_TIL_KORRIGERING && <KorrigerVarsel />}
        <TidligSoknad soknad={soknad} />
        {intro}
        {sykmelding
        && soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE
        && <SykmeldingUtdragForSelvstendige
            sykmelding={sykmelding}
            erApen={aktivtSteg === '1'}
            erOppdelt={_erOppdelt} />}
        {sykmelding
        && soknad.soknadstype === ARBEIDSTAKERE
        && <SykmeldingUtdrag
            rootUrl="/sykepengesoknad"
            sykmelding={sykmelding}
            erApen={aktivtSteg === '1' || apentUtdrag}
            sykepengesoknad={{ _erOppdelt }} />}
        {tittel && <h2 className="soknad__stegtittel">{tittel}</h2>}
        {children}
    </div>);
};

Soknadskjema.propTypes = {
    children: childEllerChildren,
    aktivtSteg: PropTypes.string,
    tittel: PropTypes.string,
    soknad: soknadPt,
    sykmelding: sykmeldingPt,
    intro: PropTypes.node,
    apentUtdrag: PropTypes.bool,
};

export default Soknadskjema;
