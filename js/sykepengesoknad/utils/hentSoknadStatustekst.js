import { getLedetekst, tilLesbarDatoMedArstall } from '@navikt/digisyfo-npm';
import { formaterOrgnr } from '../../utils/index';
import { KORRIGERT } from '../enums/soknadstatuser';

const hentSoknadStatustekst = (soknad) => {
    const soknadSendtTilNav = soknad.sendtTilNAVDato !== null || soknad.innsendtDato !== null;
    const soknadSendtTilArbeidsgiver = soknad.sendtTilArbeidsgiverDato !== null;
    const nokkel = soknad.status === KORRIGERT
        ? 'sykepengesoknad.status-2.KORRIGERT'
        : soknadSendtTilNav && soknadSendtTilArbeidsgiver
            ? 'sykepengesoknad.status-2.SENDT.til-arbeidsgiver-og-nav'
            : soknadSendtTilNav && !soknadSendtTilArbeidsgiver
                ? 'sykepengesoknad.status-2.SENDT.til-nav'
                : 'sykepengesoknad.status-2.SENDT.til-arbeidsgiver';
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
    return getLedetekst(nokkel, args);
};

export default hentSoknadStatustekst;
