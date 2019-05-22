import { getHtmlLedetekst } from '@navikt/digisyfo-npm';

const hentSykepengetekst = (soknad) => {
    const nokkel = (soknad.sendtTilNAVDato || soknad.innsendtDato)
        && soknad.sendtTilArbeidsgiverDato
        ? 'sykepengesoknad.sykepengeinfo.til-arbeidsgiver-og-nav'
        : (soknad.sendtTilNAVDato || soknad.innsendtDato)
            ? 'sykepengesoknad.sykepengeinfo.til-nav'
            : 'sykepengesoknad.sykepengeinfo.til-arbeidsgiver';
    return getHtmlLedetekst(nokkel);
};

export default hentSykepengetekst;
