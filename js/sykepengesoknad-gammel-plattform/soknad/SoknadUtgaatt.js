import React from 'react';
import { getLedetekst } from '@navikt/digisyfo-npm';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';
import SykepengesoknadHeader from '../../components/soknad-felles/SykepengesoknadHeader';
import SykmeldingUtdragContainer from '../SykmeldingUtdragContainer';
import GjenapneSoknadContainer from './soknad-avbrutt/GjenapneSoknadContainer';
import Statuspanel, { StatusNokkelopplysning, Statusopplysninger } from '../../components/Statuspanel';

const SoknadUtgaatt = ({ sykepengesoknad }) => {
    return (<div>
        <SykepengesoknadHeader sykepengesoknad={sykepengesoknad} />
        <Statuspanel>
            <Statusopplysninger>
                <StatusNokkelopplysning tittel={getLedetekst('sykepengesoknad.status-2.tittel')}>
                    <p>{getLedetekst('soknad.teaser.status.UTGAATT')}</p>
                </StatusNokkelopplysning>
            </Statusopplysninger>
            <GjenapneSoknadContainer sykepengesoknad={sykepengesoknad} tekst="Åpne søknad" />
        </Statuspanel>
        <SykmeldingUtdragContainer sykepengesoknad={sykepengesoknad} erApen />
    </div>);
};

SoknadUtgaatt.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

export default SoknadUtgaatt;
