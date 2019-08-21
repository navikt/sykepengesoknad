import { DateUtils } from 'react-day-picker';
import { getHtmlLedetekst, tilLesbarDatoMedArstall } from '@navikt/digisyfo-npm';
import { formaterOrgnr } from '../../utils/utils';
import { KORRIGERT } from '../enums/soknadstatuser';

const sendtTilNavArbeidsgiver = (sendtTilNAVDato, sendtTilArbeidsgiverDato) => {
    return DateUtils.isSameDay(sendtTilNAVDato, sendtTilArbeidsgiverDato)
        ? 'sykepengesoknad.status-2.SENDT.til-arbeidsgiver-og-nav'
        : 'sykepengesoknad.status-2.SENDT.til-arbeidsgiver-og-nav-forskjellig-dato';
};

const sendtTilNavOgIkkeArbeidsgiver = (sendtTilNav, sendtTilArbeidsgiver) => {
    return sendtTilNav && !sendtTilArbeidsgiver
        ? 'sykepengesoknad.status-2.SENDT.til-nav'
        : 'sykepengesoknad.status-2.SENDT.til-arbeidsgiver';
};

const hentSoknadStatustekst = (soknad) => {
    const soknadSendtTilNav = soknad.sendtTilNAVDato !== null || soknad.innsendtDato !== null;
    const soknadSendtTilArbeidsgiver = soknad.sendtTilArbeidsgiverDato !== null;
    const nokkel = soknad.status === KORRIGERT
        ? 'sykepengesoknad.status-2.KORRIGERT'
        : soknadSendtTilNav && soknadSendtTilArbeidsgiver
            ? sendtTilNavArbeidsgiver((soknad.sendtTilNAVDato), soknad.sendtTilArbeidsgiverDato)
            : sendtTilNavOgIkkeArbeidsgiver(soknadSendtTilNav, soknadSendtTilArbeidsgiver);
    const args = {
        '%ARBEIDSGIVER%': soknad.arbeidsgiver && soknad.arbeidsgiver.navn
            ? soknad.arbeidsgiver.navn
            : soknad.arbeidsgiver
                ? soknad.arbeidsgiver
                : null,
        '%ORGNR%': soknad.arbeidsgiver && soknad.arbeidsgiver.orgnummer ? formaterOrgnr(soknad.arbeidsgiver.orgnummer) : null,
        '%SENDTTILARBEIDSGIVERDATO%': soknadSendtTilArbeidsgiver ? tilLesbarDatoMedArstall(soknad.sendtTilArbeidsgiverDato) : null,
        '%SENDTTILNAVDATO%': soknadSendtTilNav ? tilLesbarDatoMedArstall(soknad.sendtTilNAVDato || soknad.innsendtDato) : null,
    };
    return getHtmlLedetekst(nokkel, args);
};

export default hentSoknadStatustekst;
