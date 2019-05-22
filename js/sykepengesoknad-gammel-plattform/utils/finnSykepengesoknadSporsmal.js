import { getLedetekst } from '@navikt/digisyfo-npm';
import { finnFomForFeriesporsmal, getTomDato } from './sykepengesoknadUtils';
import { getTidligsteStartdatoSykeforloep } from '../../utils/sykmeldingUtils';
import { tilLesbarDatoMedArstall, tilLesbarPeriodeMedArstall } from '../../utils/datoUtils';

const getUkedag = (dato) => {
    const dager = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
    return dager[dato.getDay()];
};

export const finnEgenmeldingsdagerSporsmal = (sykepengesoknad, callback = getLedetekst) => {
    const dato = getTidligsteStartdatoSykeforloep(sykepengesoknad);
    const tom = new Date(dato);
    tom.setDate(tom.getDate() - 1);
    const fom = new Date(dato);
    fom.setDate(fom.getDate() - 16);
    return callback('sykepengesoknad.egenmeldingsdager.janei.sporsmal-3', {
        '%DATO%': `${getUkedag(dato)} ${tilLesbarDatoMedArstall(dato)}`,
        '%PERIODE%': tilLesbarPeriodeMedArstall(fom, tom),
    });
};

export const finnFeriePermisjonEllerUtenlandsoppholdSporsmal = (sykepengesoknad, gjenopptattArbeidFulltUtDato, callback = getLedetekst) => {
    const _soknad = {
        ...sykepengesoknad,
        gjenopptattArbeidFulltUtDato,
    };
    const _tidligsteFom = finnFomForFeriesporsmal(sykepengesoknad);
    const senesteTom = getTomDato(_soknad);
    return callback('sykepengesoknad.ferie-permisjon-utenlandsopphold.janei.sporsmal-2', {
        '%PERIODE%': tilLesbarPeriodeMedArstall(_tidligsteFom, senesteTom),
    });
};

export const finnAktivitetssporsmal = (aktivitet, arbeidsgiver, callback = getLedetekst) => {
    const ledetekstUgradert = 'sykepengesoknad.aktiviteter.ugradert.spoersmal-3';
    const ledetekstGradert = 'sykepengesoknad.aktiviteter.gradert.spoersmal-3';

    const nokkel = aktivitet.grad === 100 ? ledetekstUgradert : ledetekstGradert;
    const tomDato = aktivitet.periode.tom;

    return callback(nokkel, {
        '%PERIODE%': tilLesbarPeriodeMedArstall(aktivitet.periode.fom, tomDato),
        '%ARBEIDSGIVER%': arbeidsgiver,
        '%ARBEIDSGRAD%': 100 - aktivitet.grad,
    });
};

export const finnTotalJobbingSporsmal = (arbeidsgiver, callback = getLedetekst) => {
    return callback('sykepengesoknad.aktiviteter.avvik.hvor-mye-har-du-jobbet-totalt', {
        '%ARBEIDSGIVER%': arbeidsgiver,
    });
};

export const finnInntektskildeLabel = (annenInntektskildeType, callback = getLedetekst) => {
    return callback(`sykepengesoknad.andre-inntektskilder.${annenInntektskildeType}.label`);
};

export const finnUtdanningssporsmal = (sykepengesoknad, gjenopptattArbeidFulltUtDato, callback = getLedetekst) => {
    const _soknad = {
        ...sykepengesoknad,
        gjenopptattArbeidFulltUtDato,
    };
    const _senesteTom = getTomDato(_soknad);

    return callback('sykepengesoknad.utdanning.ja-nei.sporsmal-2', {
        '%PERIODE%': tilLesbarPeriodeMedArstall(sykepengesoknad.fom, _senesteTom),
    });
};

export const finnGjenopptattArbeidFulltUtSporsmal = (sykepengesoknad, callback = getLedetekst) => {
    const dato = new Date(sykepengesoknad.tom);
    dato.setDate(dato.getDate() + 1);
    return callback('sykepengesoknad.gjenopptatt-arbeid-fullt-ut.janei.sporsmal-2', {
        '%ARBEIDSGIVER%': sykepengesoknad.arbeidsgiver.navn,
        '%DATO%': tilLesbarDatoMedArstall(dato),
    });
};
