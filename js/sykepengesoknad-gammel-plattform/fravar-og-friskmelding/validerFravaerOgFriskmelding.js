import { toDatePrettyPrint, tidligsteFom, fraInputdatoTilJSDato } from '@navikt/digisyfo-npm';
import validerFoerDuBegynner from '../for-du-begynner/validerFoerDuBegynner';
import * as valideringUtils from '../utils/valideringUtils';
import { getTomDato } from '../utils/sykepengesoknadUtils';
import { visSoktOmSykepengerUtenlandsoppholdsporsmal } from './SoktOmSykepengerIUtenlandsopphold';

export const validate = (values, props) => {
    const { sykepengesoknad } = props;
    const feilmeldinger = {};
    let gjenopptattArbeidFulltUtDato;
    const periodealternativer = {};
    if (values.harGjenopptattArbeidFulltUt) {
        try {
            gjenopptattArbeidFulltUtDato = fraInputdatoTilJSDato(values.gjenopptattArbeidFulltUtDato);
            const perioder = sykepengesoknad.aktiviteter.map((a) => {
                return a.periode;
            });
            periodealternativer.fra = sykepengesoknad.del === 1 && sykepengesoknad.forrigeSykeforloepTom ? sykepengesoknad.forrigeSykeforloepTom : tidligsteFom(perioder);
            periodealternativer.til = getTomDato({
                ...sykepengesoknad,
                gjenopptattArbeidFulltUtDato,
            });
        } catch (e) {
            gjenopptattArbeidFulltUtDato = null;
        }
    }

    if (Object.keys(validerFoerDuBegynner(values)).length !== 0) {
        props.sendTilFoerDuBegynner(sykepengesoknad);
    }

    if (values.bruktEgenmeldingsdagerFoerLegemeldtFravaer === undefined) {
        feilmeldinger.bruktEgenmeldingsdagerFoerLegemeldtFravaer = 'Du må svare om du brukte egenmeldingsdager før det legemeldte fraværet startet';
    }

    if (values.harGjenopptattArbeidFulltUt === undefined) {
        feilmeldinger.harGjenopptattArbeidFulltUt = 'Vennligst oppgi om du var tilbake i arbeid før sykmeldingsperioden utløp';
    } else if (values.harGjenopptattArbeidFulltUt) {
        if (!values.gjenopptattArbeidFulltUtDato) {
            feilmeldinger.gjenopptattArbeidFulltUtDato = 'Vennligst oppgi når du gjenopptok arbeidet';
        } else if (!valideringUtils.datoErFoersteSykmeldingsdagEllerSenere(values.gjenopptattArbeidFulltUtDato, sykepengesoknad)) {
            feilmeldinger.gjenopptattArbeidFulltUtDato = `Datoen kan ikke være før du ble sykmeldt ${toDatePrettyPrint(sykepengesoknad.identdato)}`;
        }
    }

    if (values.bruktEgenmeldingsdagerFoerLegemeldtFravaer) {
        const egenmeldingsperioderFeil = valideringUtils.validerPerioder(values.egenmeldingsperioder);
        if (egenmeldingsperioderFeil) {
            feilmeldinger.egenmeldingsperioder = egenmeldingsperioderFeil;
        }
    }

    if (values.harHattFeriePermisjonEllerUtenlandsopphold === undefined) {
        feilmeldinger.harHattFeriePermisjonEllerUtenlandsopphold = 'Vennligst svar på om du har hatt ferie, permisjon eller utenlandsopphold';
    } else if (values.harHattFeriePermisjonEllerUtenlandsopphold) {
        if (([values.harHattFerie, values.harHattPermisjon, values.harHattUtenlandsopphold]).filter((a) => {
            return a;
        }).length === 0) {
            feilmeldinger.feriePermisjonEllerUtenlandsopphold = {
                _error: 'Vennligst kryss av ett av alternativene',
            };
        }

        if (values.harHattFerie) {
            const feriefeilmeldinger = valideringUtils.validerPerioder(values.ferie, periodealternativer);
            if (feriefeilmeldinger) {
                feilmeldinger.ferie = feriefeilmeldinger;
            }
        }

        if (values.harHattUtenlandsopphold) {
            const utenlandsoppholdPeriodefeilmeldinger = valideringUtils.validerPerioder(values.utenlandsopphold.perioder, periodealternativer);
            const utenlandsoppholdfeilmeldinger = {};
            if (utenlandsoppholdPeriodefeilmeldinger) {
                utenlandsoppholdfeilmeldinger.perioder = utenlandsoppholdPeriodefeilmeldinger;
            }

            if (visSoktOmSykepengerUtenlandsoppholdsporsmal(values)
                && (values.utenlandsopphold.soektOmSykepengerIPerioden === undefined || values.utenlandsopphold.soektOmSykepengerIPerioden === null)) {
                utenlandsoppholdfeilmeldinger.soektOmSykepengerIPerioden = 'Vennligst oppgi om du har søkt på sykepenger under oppholdet utenfor Norge';
            }

            if (Object.keys(utenlandsoppholdfeilmeldinger).length > 0) {
                feilmeldinger.utenlandsopphold = utenlandsoppholdfeilmeldinger;
            }
        }

        if (values.harHattPermisjon) {
            const permisjonfeilmeldinger = valideringUtils.validerPerioder(values.permisjon, periodealternativer);
            if (permisjonfeilmeldinger) {
                feilmeldinger.permisjon = permisjonfeilmeldinger;
            }
        }
    }
    return feilmeldinger;
};

export default validate;
