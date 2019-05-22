import { connect } from 'react-redux';
import { touch } from 'redux-form';
import { getObjectValueByString } from '../../utils';
import * as actions from '../../actions/reduxFormMeta_actions';
import Feiloppsummering from '../../components/skjema/Feiloppsummering';
import { SEND_SKJEMA_FEILET } from '../../enums/reduxFormMetaEnums';

const getKeys = (key, errors, prefix) => {
    if (typeof errors[key] === 'string') {
        if (prefix) {
            return [`${prefix}.${key}`];
        }
        return [key];
    }
    let keys = [];
    let newPrefix = key;
    if (prefix) {
        if (isNaN(parseInt(key, 10))) {
            newPrefix = `${prefix}.${key}`;
        } else {
            newPrefix = `${prefix}[${key}]`;
        }
    }
    Object.keys(errors[key]).forEach((nKey) => {
        if (errors[key][nKey]) {
            keys = [...getKeys(nKey, errors[key], newPrefix), ...keys];
        }
    });
    keys = keys.map((k) => {
        if (k.indexOf('_error') > -1) {
            return k.replace('._error', '');
        }
        return k;
    });
    return keys;
};

export const getNestedKeys = (errors) => {
    if (!errors) {
        return [];
    }
    let keys = [];
    Object.keys(errors).forEach((key) => {
        if (errors[key]) {
            const keysToAdd = getKeys(key, errors);
            if (keysToAdd) {
                keys = [...keysToAdd, ...keys];
            }
        }
    });
    return keys.reverse();
};

export const onSubmitFail = (errors, dispatch, skjemanavn) => {
    const errorFields = getNestedKeys(errors);
    dispatch(actions.sendSkjemaFeilet(skjemanavn));
    errorFields.forEach((field) => {
        dispatch(touch(skjemanavn, field));
    });
};

export const mapStateToProps = (state, ownProps) => {
    const skjemanavn = ownProps.skjemanavn;
    const harReducer = state.formMeta && state.formMeta[skjemanavn];
    const meta = harReducer ? state.formMeta[skjemanavn] : {};
    const visFeilliste = meta.status === SEND_SKJEMA_FEILET;
    const settFokus = meta.status === SEND_SKJEMA_FEILET && meta.settFokus === true;
    const reduxForm = state.form[skjemanavn];
    const feltnavnMedFeil = reduxForm ? getNestedKeys(reduxForm.syncErrors) : [];

    const feilmeldinger = feltnavnMedFeil.filter((feltnavn) => {
        try {
            return getObjectValueByString(reduxForm.fields, feltnavn).touched;
        } catch (e) {
            return false;
        }
    }).map((feltnavn) => {
        const feilmelding = getObjectValueByString(reduxForm.syncErrors, feltnavn);
        return {
            feltnavn,
            feilmelding: feilmelding._error || feilmelding,
        };
    });

    return {
        skjemanavn,
        settFokus,
        visFeilliste,
        feilmeldinger,
    };
};

const FeiloppsummeringContainer = connect(mapStateToProps, actions)(Feiloppsummering);

export default FeiloppsummeringContainer;
