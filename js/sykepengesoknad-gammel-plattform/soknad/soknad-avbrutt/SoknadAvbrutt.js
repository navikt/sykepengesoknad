import React from 'react';
import { getLedetekst, tilLesbarDatoMedArstall, sykepengesoknadstatuser } from '@navikt/digisyfo-npm';
import { sykepengesoknad as sykepengesoknadPt } from '../../../propTypes/index';
import SykepengesoknadHeader from '../../../components/soknad-felles/SykepengesoknadHeader';
import SykmeldingUtdragContainer from '../../SykmeldingUtdragContainer';
import GjenapneSoknadContainer from './GjenapneSoknadContainer';
import Statuspanel, { StatusNokkelopplysning, Statusopplysninger } from '../../../components/Statuspanel';

const SoknadAvbrutt = (props) => {
    const { sykepengesoknad } = props;
    return (<div>
        <SykepengesoknadHeader sykepengesoknad={sykepengesoknad} />
        <Statuspanel>
            <Statusopplysninger>
                <StatusNokkelopplysning tittel="Status">
                    <p>
                        {getLedetekst(`sykepengesoknad.status.${sykepengesoknad.status}`)}
                    </p>
                </StatusNokkelopplysning>
                <StatusNokkelopplysning tittel="Dato avbrutt">
                    <p>
                        {tilLesbarDatoMedArstall(sykepengesoknad.avbruttDato)}
                    </p>
                </StatusNokkelopplysning>
            </Statusopplysninger>
            { sykepengesoknad.status === sykepengesoknadstatuser.AVBRUTT && <GjenapneSoknadContainer {...props} /> }
        </Statuspanel>
        <SykmeldingUtdragContainer sykepengesoknad={sykepengesoknad} erApen />
    </div>);
};

SoknadAvbrutt.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

export default SoknadAvbrutt;
