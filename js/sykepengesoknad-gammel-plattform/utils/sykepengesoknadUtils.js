import {
    erGyldigDatoformat,
    fraInputdatoTilJSDato,
    periodeOverlapperMedPeriode,
    tidligsteFom,
    tilDatePeriode,
} from '@navikt/digisyfo-npm';

export const filtrerAktuelleAktiviteter = (aktiviteter, gjenopptattArbeidFulltUtDato) => {
    if (gjenopptattArbeidFulltUtDato && aktiviteter) {
        return aktiviteter
            .filter((aktivitet) => {
                return aktivitet.periode.fom < gjenopptattArbeidFulltUtDato;
            })
            .map((aktivitet) => {
                const justertTOM = gjenopptattArbeidFulltUtDato <= aktivitet.periode.tom
                    ? new Date(gjenopptattArbeidFulltUtDato.getTime() - (24 * 60 * 60 * 1000))
                    : aktivitet.periode.tom;

                return Object.assign({}, aktivitet, {
                    periode: {
                        fom: aktivitet.periode.fom,
                        tom: justertTOM,
                    },
                });
            });
    }
    return aktiviteter;
};

export const mapAktiviteter = (soknad) => {
    const aktiviteter = soknad.aktiviteter
        .filter((aktivitet) => {
            return periodeOverlapperMedPeriode(aktivitet.periode, {
                fom: soknad.fom,
                tom: soknad.tom,
            });
        })
        .map((aktivitet) => {
            const fom = aktivitet.periode.fom.getTime() < soknad.fom.getTime() ? soknad.fom : aktivitet.periode.fom;
            const tom = aktivitet.periode.tom.getTime() > soknad.tom.getTime() ? soknad.tom : aktivitet.periode.tom;
            return {
                ...aktivitet,
                periode: { fom, tom },
            };
        });
    return {
        ...soknad,
        aktiviteter,
    };
};

export const getTomDato = (sykepengesoknad) => {
    const perioder = sykepengesoknad.aktiviteter.map((a) => {
        return a.periode;
    });
    if (sykepengesoknad.gjenopptattArbeidFulltUtDato) {
        const tidligsteFomFraPerioder = new Date(tidligsteFom(perioder));
        const gjenopptattArbeidFulltUtDato = new Date(sykepengesoknad.gjenopptattArbeidFulltUtDato);
        if (gjenopptattArbeidFulltUtDato.getTime() === tidligsteFomFraPerioder.getTime()) {
            return gjenopptattArbeidFulltUtDato;
        }
        return new Date(gjenopptattArbeidFulltUtDato - (1000 * 60 * 60 * 24));
    }
    return sykepengesoknad.tom;
};

export const getGjenopptattArbeidFulltUtDato = (skjemasoknad) => {
    let gjenopptattArbeidFulltUtDato = skjemasoknad.gjenopptattArbeidFulltUtDato;
    if (!skjemasoknad.harGjenopptattArbeidFulltUt || !gjenopptattArbeidFulltUtDato || !erGyldigDatoformat(gjenopptattArbeidFulltUtDato)) {
        gjenopptattArbeidFulltUtDato = null;
    } else {
        try {
            gjenopptattArbeidFulltUtDato = fraInputdatoTilJSDato(gjenopptattArbeidFulltUtDato);
        } catch (e) {
            gjenopptattArbeidFulltUtDato = null;
        }
        if (gjenopptattArbeidFulltUtDato && isNaN(gjenopptattArbeidFulltUtDato.getTime())) {
            gjenopptattArbeidFulltUtDato = null;
        }
    }
    return gjenopptattArbeidFulltUtDato;
};

export const erSendtTilBeggeMenIkkeSamtidig = (sykepengesoknad) => {
    return sykepengesoknad.sendtTilNAVDato
        && sykepengesoknad.sendtTilArbeidsgiverDato
        && sykepengesoknad.sendtTilNAVDato.getTime() !== sykepengesoknad.sendtTilArbeidsgiverDato.getTime();
};

export const getSendtTilSuffix = (sykepengesoknad) => {
    if (sykepengesoknad.sendtTilArbeidsgiverDato && sykepengesoknad.sendtTilNAVDato) {
        return '.til-arbeidsgiver-og-nav';
    }
    if (sykepengesoknad.sendtTilArbeidsgiverDato) {
        return '.til-arbeidsgiver';
    }
    if (sykepengesoknad.sendtTilNAVDato) {
        return '.til-nav';
    }
    return '';
};

export const getFeriePermisjonPerioder = (values) => {
    let ferieOgPermisjonPerioder = [];
    if (values.harHattFeriePermisjonEllerUtenlandsopphold) {
        if (values.harHattFerie) {
            ferieOgPermisjonPerioder = [...ferieOgPermisjonPerioder, ...values.ferie];
        }
        if (values.harHattPermisjon) {
            ferieOgPermisjonPerioder = [...ferieOgPermisjonPerioder, ...values.permisjon];
        }
    }
    return ferieOgPermisjonPerioder.map(tilDatePeriode);
};

export const getGjenopptattArbeidFulltUtDatoFraSkjema = (skjemasoknad) => {
    return skjemasoknad.harGjenopptattArbeidFulltUt && skjemasoknad.gjenopptattArbeidFulltUtDato
        ? fraInputdatoTilJSDato(skjemasoknad.gjenopptattArbeidFulltUtDato)
        : null;
};

export const finnFomForFeriesporsmal = (sykepengesoknad) => {
    const { forrigeSykeforloepTom, forrigeSendteSoknadTom } = sykepengesoknad;

    if (forrigeSykeforloepTom !== null && forrigeSendteSoknadTom !== null) {
        if (forrigeSendteSoknadTom >= forrigeSykeforloepTom) {
            return sykepengesoknad.fom;
        }
    }

    return forrigeSykeforloepTom || sykepengesoknad.fom;
};
