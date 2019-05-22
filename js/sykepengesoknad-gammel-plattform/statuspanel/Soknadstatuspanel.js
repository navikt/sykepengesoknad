import React from 'react';
import { tilLesbarDatoMedArstall, getLedetekst, getHtmlLedetekst, sykepengesoknadstatuser } from '@navikt/digisyfo-npm';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';
import { erSendtTilBeggeMenIkkeSamtidig, getSendtTilSuffix } from '../utils/sykepengesoknadUtils';
import { formaterOrgnr } from '../../utils/index';
import Statuspanel, { StatusNokkelopplysning, Statusopplysninger } from '../../components/Statuspanel';
import KnapperadStatuspanel from './KnapperadStatuspanel';

const { SENDT, TIL_SENDING, KORRIGERT } = sykepengesoknadstatuser;

const finnLedetekstParams = (sykepengesoknad) => {
    return {
        '%ARBEIDSGIVER%': sykepengesoknad.arbeidsgiver.navn,
        '%ORGNR%': formaterOrgnr(sykepengesoknad.arbeidsgiver.orgnummer),
        '%SENDTTILNAVDATO%': tilLesbarDatoMedArstall(sykepengesoknad.sendtTilNAVDato),
        '%SENDTTILARBEIDSGIVERDATO%': tilLesbarDatoMedArstall(sykepengesoknad.sendtTilArbeidsgiverDato),
    };
};

const getStatusTekst = (sykepengesoknad) => {
    const params = finnLedetekstParams(sykepengesoknad);
    switch (sykepengesoknad.status) {
        case SENDT: {
            return getLedetekst(`sykepengesoknad.status-2.SENDT${getSendtTilSuffix(sykepengesoknad)}`, params);
        }
        case TIL_SENDING: {
            return getLedetekst(`sykepengesoknad.status-2.TIL_SENDING${getSendtTilSuffix(sykepengesoknad)}`, params);
        }
        case KORRIGERT: {
            return getLedetekst('sykepengesoknad.status-2.KORRIGERT');
        }
        default: {
            return 'Ukjent status';
        }
    }
};

export const tilSendingHjelpetekst = () => {
    return (<Hjelpetekst>{getLedetekst('sykepengesoknad.til-sending.hjelpetekst.tekst')}</Hjelpetekst>);
};

export const SykepengerInfo = ({ sykepengesoknad }) => {
    return (<StatusNokkelopplysning tittel={getLedetekst('sykepengesoknad.sykepengeinfo.tittel')}>
        <p dangerouslySetInnerHTML={getHtmlLedetekst(`sykepengesoknad.sykepengeinfo${getSendtTilSuffix(sykepengesoknad)}`)} />
    </StatusNokkelopplysning>);
};

SykepengerInfo.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

const SendtLikt = ({ sykepengesoknad }) => {
    const tekst = getStatusTekst(sykepengesoknad);
    return (<Statusopplysninger>
        <StatusNokkelopplysning tittel={getLedetekst('sykepengesoknad.status-2.tittel')}>
            {
                sykepengesoknad.status === TIL_SENDING
                    ? (<div>
                        <span>{tekst}</span>{tilSendingHjelpetekst()}
                    </div>)
                    : <p>{tekst}</p>
            }
        </StatusNokkelopplysning>
        <SykepengerInfo sykepengesoknad={sykepengesoknad} />
    </Statusopplysninger>);
};

SendtLikt.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

const SendtUlikt = ({ sykepengesoknad }) => {
    const params = finnLedetekstParams(sykepengesoknad);
    return (<Statusopplysninger>
        <StatusNokkelopplysning tittel={getLedetekst('sykepengesoknad.status-2.tittel')}>
            <p>
                {getLedetekst('sykepengesoknad.status-2.SENDT.til-nav', params)}<br />
                {getLedetekst('sykepengesoknad.status-2.SENDT.til-arbeidsgiver', params)}
            </p>
        </StatusNokkelopplysning>
        <SykepengerInfo sykepengesoknad={sykepengesoknad} />
    </Statusopplysninger>);
};

SendtUlikt.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

const Soknadstatuspanel = ({ sykepengesoknad }) => {
    return (<Statuspanel enKolonne>
        {
            erSendtTilBeggeMenIkkeSamtidig(sykepengesoknad)
                ? <SendtUlikt sykepengesoknad={sykepengesoknad} />
                : <SendtLikt sykepengesoknad={sykepengesoknad} />
        }
        {
            [KORRIGERT, TIL_SENDING].indexOf(sykepengesoknad.status) === -1
                && <KnapperadStatuspanel sykepengesoknad={sykepengesoknad} />
        }
    </Statuspanel>);
};

Soknadstatuspanel.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

export default Soknadstatuspanel;
