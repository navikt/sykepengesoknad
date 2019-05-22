import { fraInputdatoTilJSDato } from '@navikt/digisyfo-npm';
import validerPeriode from '../../components/skjema/periodevelger/validerPeriode';

export const erIFortiden = (dato) => {
    const oppgittDato = fraInputdatoTilJSDato(dato);
    const dagensDato = new Date();
    return oppgittDato.getTime() < dagensDato.getTime();
};

export const datoErFoersteSykmeldingsdagEllerSenere = (dato, sykepengesoknad) => {
    const oppgittDato = fraInputdatoTilJSDato(dato);
    const foersteSykmeldingsdato = sykepengesoknad.identdato;
    return oppgittDato.getTime() >= foersteSykmeldingsdato.getTime();
};

export const harMinstEnPeriode = (perioder = []) => {
    return perioder.filter((periode) => {
        return periode.tom || periode.fom;
    }).length > 0;
};

export const validerDatoerIPerioder = (perioder, alternativer) => {
    return perioder.map((periode) => {
        const feil = {};
        if (!periode.fom) {
            feil.fom = 'Vennligst fyll ut dato';
        }
        if (!periode.tom) {
            feil.tom = 'Vennligst fyll ut dato';
        }
        if (feil.tom || feil.fom) {
            return feil;
        }
        const fom = fraInputdatoTilJSDato(periode.fom);
        const tom = fraInputdatoTilJSDato(periode.tom);
        if (fom.getTime() > tom.getTime()) {
            feil.tom = 'Sluttdato må være etter startdato';
            return feil;
        }
        if (alternativer) {
            const fomFeil = validerPeriode(periode.fom, alternativer);
            const tomFeil = validerPeriode(periode.tom, alternativer);
            if (fomFeil) {
                feil.fom = fomFeil;
            }
            if (tomFeil) {
                feil.tom = tomFeil;
            }
            if (feil.fom || feil.tom) {
                return feil;
            }
        }
        return undefined;
    });
};

export const validerPerioder = (perioder, alternativer) => {
    if (!perioder) {
        return null;
    }
    const datofeil = validerDatoerIPerioder(perioder, alternativer);
    const faktiskeDatofeil = datofeil.filter((feil) => {
        return feil !== undefined;
    });
    if (faktiskeDatofeil.length > 0) {
        return datofeil;
    }
    return null;
};
