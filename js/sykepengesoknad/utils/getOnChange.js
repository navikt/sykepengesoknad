import { formaterEnkeltverdi } from '../felleskomponenter/sporsmal/fieldUtils';
import { erGyldigDato } from '../../utils/datoUtils';

export const getOnChange = (props) => {
    if (props.pavirkerAndreSporsmal) {
        return (event, newValue) => {
            props.actions.soknadEndret(props.soknad, props.name, newValue);
        };
    }
    return null;
};

export const getOnChangeForDato = (props) => {
    if (props.pavirkerAndreSporsmal) {
        return (event, newValue) => {
            const formatertVerdi = formaterEnkeltverdi(newValue);
            if (erGyldigDato(formatertVerdi)) {
                props.actions.soknadEndret(props.soknad, props.name, newValue);
            }
        };
    }
    return null;
};

export const getOnChangeForPerioder = (props) => {
    if (props.pavirkerAndreSporsmal) {
        return (name, newValue) => {
            if (erGyldigDato(newValue)) {
                props.actions.soknadEndret(props.soknad, name, newValue, props.svartype);
            }
        };
    }
    return null;
};
