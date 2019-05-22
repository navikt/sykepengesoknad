import validerSporsmal from '../../validering/validerSporsmal';
import { erSisteSide, hentSporsmalForOppsummering } from './ettSporsmalPerSideUtils';
import validerGraderteArbeidssporsmal from '../../validering/validerGraderteArbeidssporsmal';
import { ARBEIDSTAKERE } from '../../enums/soknadtyper';

export const validerDenneSiden = (values, props) => {
    const sporsmal = erSisteSide(props.soknad, props.sidenummer)
        ? hentSporsmalForOppsummering(props.soknad)
        : [props.soknad.sporsmal[props.sidenummer - 1]];
    const resultat = validerSporsmal(sporsmal, values);
    const arbeidssporsmalFeilmeldinger = props.soknad.soknadstype === ARBEIDSTAKERE
        ? validerGraderteArbeidssporsmal(sporsmal, values, props.soknad)
        : {};
    return {
        ...resultat,
        ...arbeidssporsmalFeilmeldinger,
    };
};

export const validerForegaendeSider = (values, props) => {
    const sporsmal = props.soknad.sporsmal.filter((spm, index) => {
        return (index + 1) < props.sidenummer;
    });
    const arbeidssporsmalFeilmeldinger = props.soknad.soknadstype === ARBEIDSTAKERE
        ? validerGraderteArbeidssporsmal(sporsmal, values, props.soknad)
        : {};
    return {
        ...validerSporsmal(sporsmal, values),
        ...arbeidssporsmalFeilmeldinger,
    };
};
