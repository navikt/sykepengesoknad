import { senesteTom } from '@navikt/digisyfo-npm';
import { PERIODEUTLAND } from '../../sykepengesoknad/enums/tagtyper';
import { OPPHOLD_UTLAND } from '../../sykepengesoknad/enums/soknadtyper';
import { NY, SENDT } from '../../sykepengesoknad/enums/soknadstatuser';

const getTomFraSoknad = (soknad) => {
    const getTomForUtland = (_soknad) => {
        const perioder = _soknad.sporsmal.find((spm) => {
            return spm.tag === PERIODEUTLAND;
        })
            .svar
            .map((periode) => {
                const jsonPeriode = JSON.parse(periode.verdi);
                return {
                    fom: new Date(jsonPeriode.fom),
                    tom: new Date(jsonPeriode.tom),
                };
            });
        return senesteTom(perioder);
    };

    return soknad.soknadstype === OPPHOLD_UTLAND && soknad.status === SENDT
        ? getTomForUtland(soknad)
        : soknad.soknadstype === OPPHOLD_UTLAND && soknad.status === NY
            ? soknad.opprettetDato
            : soknad.tom;
};

export const sorterEtterPerioder = (soknad1, soknad2) => {
    const tom1 = getTomFraSoknad(soknad1);
    const tom2 = getTomFraSoknad(soknad2);
    return tom2.getTime() - tom1.getTime();
};

export const sorterEtterOpprettetDato = (soknad1, soknad2) => {
    return soknad1.opprettetDato.getTime() - soknad2.opprettetDato.getTime() !== 0
        ? soknad1.opprettetDato.getTime() - soknad2.opprettetDato.getTime()
        : soknad1.fom.getTime() - soknad2.fom.getTime();
};
export const getTidligsteSendtDato = (soknad) => {
    const sendtTilNAVDato = soknad.innsendtDato || soknad.sendtTilNAVDato;
    if (sendtTilNAVDato && soknad.sendtTilArbeidsgiverDato) {
        return sendtTilNAVDato > soknad.sendtTilArbeidsgiverDato
            ? soknad.sendtTilArbeidsgiverDato
            : sendtTilNAVDato;
    }
    return sendtTilNAVDato
        || soknad.sendtTilArbeidsgiverDato;
};

export const sorterEtterSendtDato = (soknad1, soknad2) => {
    const dato1 = getTidligsteSendtDato(soknad1);
    const dato2 = getTidligsteSendtDato(soknad2);
    return dato2.getTime() - dato1.getTime();
};
