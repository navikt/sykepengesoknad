import { getLedetekst } from '@navikt/digisyfo-npm';
import { BEKREFT_OPPLYSNINGER, VAER_KLAR_OVER_AT } from '../../enums/tagtyper';
import { fjernIndexFraTag } from '../sporsmal/fieldUtils';

export const hentSporsmalForDenneSiden = (soknad, sidenummer) => {
    const sporsmal = soknad.sporsmal[sidenummer - 1];
    return [sporsmal];
};

export const hentSporsmalForOppsummering = (soknad) => {
    return soknad.sporsmal.filter((s) => {
        return s.tag === VAER_KLAR_OVER_AT
            || s.tag === BEKREFT_OPPLYSNINGER;
    });
};

export const erSisteSide = (soknad, sidenummer) => {
    const sporsmal = hentSporsmalForDenneSiden(soknad, sidenummer);
    const tag = sporsmal[0].tag;
    return [VAER_KLAR_OVER_AT, BEKREFT_OPPLYSNINGER].indexOf(tag) > -1;
};

export const hentTittel = (soknad, sidenummer) => {
    const sporsmal = hentSporsmalForDenneSiden(soknad, sidenummer)[0];
    const nokkel = sidenummer === 1
        ? 'sykepengesoknad.for-du-begynner.tittel'
        : erSisteSide(soknad, sidenummer)
            ? 'sykepengesoknad.til-slutt.tittel'
            : `sykepengesoknad.${fjernIndexFraTag(sporsmal.tag)
                .toLowerCase()}.tittel`;
    return getLedetekst(nokkel);
};
