import validerFoerDuBegynner from '../for-du-begynner/validerFoerDuBegynner';
import validerFravaerOgFriskmelding from '../fravar-og-friskmelding/validerFravaerOgFriskmelding';
import validerAktiviteterISykmeldingsperioden from '../aktiviteter-i-sykmeldingsperioden/validerAktiviteterISykmeldingsperioden';

const validate = (values, props) => {
    const foerDuBegynnerFeil = validerFoerDuBegynner(values, props);
    const fravaerOgFriskmeldingFeil = validerFravaerOgFriskmelding(values, props);
    const aktiviteterISykmeldingsperiodenFeil = validerAktiviteterISykmeldingsperioden(values, props);
    const feilmeldinger = {
        ...foerDuBegynnerFeil,
        ...fravaerOgFriskmeldingFeil,
        ...aktiviteterISykmeldingsperiodenFeil,
    };

    if (Object.keys(feilmeldinger).length > 0) {
        props.sendTilFoerDuBegynner(props.sykepengesoknad);
    }

    if (!values.bekreftetKorrektInformasjon) {
        feilmeldinger.bekreftetKorrektInformasjon = 'Du må bekrefte at du har lest informasjonen og bekreftet at opplysningene du har gitt er korrekte';
    }

    if (props.visForskutteringssporsmal && !values.arbeidsgiverForskutterer) {
        feilmeldinger.arbeidsgiverForskutterer = 'Vennligst svar på om arbeidsgiveren din betaler lønnen når du er syk';
    }

    return feilmeldinger;
};

export default validate;
