import React from 'react';
import {
    getLedetekst,
} from '@navikt/digisyfo-npm';
import { soknadPt } from '../../propTypes/index';
import Statuspanel, { StatusNokkelopplysning, Statusopplysninger } from '../../components/Statuspanel';
import hentSoknadStatustekst from '../utils/hentSoknadStatustekst';

const StatuspanelUtland = ({ soknad }) => {
    return (<Statuspanel>
        <Statusopplysninger>
            <StatusNokkelopplysning tittel={getLedetekst('statuspanel.status')}>
                <p>{hentSoknadStatustekst(soknad)}</p>
            </StatusNokkelopplysning>
        </Statusopplysninger>
    </Statuspanel>);
};

StatuspanelUtland.propTypes = {
    soknad: soknadPt,
};

export default StatuspanelUtland;
