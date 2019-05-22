import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { inntektskildetyper as inntektskildetypeEnums, sykepengesoknadstatuser, toDatePrettyPrint } from '@navikt/digisyfo-npm';
import history from '../../history';
import { onSubmitFail } from '../../containers/skjema/FeiloppsummeringContainer';
import { mapAktiviteter } from './sykepengesoknadUtils';
import mapBackendsoknadToSkjemasoknad from '../mappers/mapBackendsoknadToSkjemasoknad';
import { getSoknadSkjemanavn } from '../../enums/skjemanavn';
import { getTidligsteSendtDato } from './sorterSoknader';

const sendTilFoerDuBegynner = (sykepengesoknad) => {
    history.replace(`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${sykepengesoknad.id}`);
};

export const andreInntektskilderDefault = Object.keys(inntektskildetypeEnums).map((key) => {
    return {
        annenInntektskildeType: inntektskildetypeEnums[key],
    };
});


const getSisteSoknadISammeSykeforloep = (soknad, soknader) => {
    return soknader
        .filter((s) => {
            return s.id !== soknad.id;
        })
        .filter((s) => {
            return s.identdato.getTime() === soknad.identdato.getTime();
        })
        .filter((s) => {
            return s.status === sykepengesoknadstatuser.SENDT || s.status === sykepengesoknadstatuser.TIL_SENDING;
        })
        .filter((s) => {
            return s.arbeidsgiver.orgnummer === soknad.arbeidsgiver.orgnummer;
        })
        .sort((a, b) => {
            return getTidligsteSendtDato(a) - getTidligsteSendtDato(b);
        })[0];
};

const preutfyllSoknad = (soknad, sisteSoknadISammeSykeforlop) => {
    if (!sisteSoknadISammeSykeforlop || soknad.status === sykepengesoknadstatuser.UTKAST_TIL_KORRIGERING) {
        return soknad;
    }

    const bruktEgenmeldingsdagerFoerLegemeldtFravaer = sisteSoknadISammeSykeforlop.egenmeldingsperioder.length > 0;
    const _erInntektskilderPreutfylt = true;
    const _erEgenmeldingsperioderPreutfylt = true;
    const egenmeldingsperioder = [...sisteSoknadISammeSykeforlop.egenmeldingsperioder]
        .sort((periodeA, periodeB) => {
            return periodeA.fom - periodeB.fom;
        })
        .map((periode) => {
            return {
                fom: toDatePrettyPrint(periode.fom),
                tom: toDatePrettyPrint(periode.tom),
            };
        });

    const mappetSoknad = mapBackendsoknadToSkjemasoknad(sisteSoknadISammeSykeforlop);
    const { utdanning, harAndreInntektskilder, andreInntektskilder } = mappetSoknad;
    const _utdanning = utdanning.underUtdanningISykmeldingsperioden
        ? utdanning
        : {};
    const _erUtdanningPreutfylt = utdanning.underUtdanningISykmeldingsperioden;

    return bruktEgenmeldingsdagerFoerLegemeldtFravaer
        ? {
            ...soknad,
            utdanning: _utdanning,
            bruktEgenmeldingsdagerFoerLegemeldtFravaer,
            egenmeldingsperioder,
            harAndreInntektskilder,
            andreInntektskilder,
            _erInntektskilderPreutfylt,
            _erEgenmeldingsperioderPreutfylt,
            _erUtdanningPreutfylt,
        }
        : {
            ...soknad,
            utdanning: _utdanning,
            bruktEgenmeldingsdagerFoerLegemeldtFravaer,
            harAndreInntektskilder,
            andreInntektskilder,
            _erInntektskilderPreutfylt,
            _erEgenmeldingsperioderPreutfylt,
            _erUtdanningPreutfylt,
        };
};

export const mapToInitialValues = (soknad, soknader = []) => {
    const aktiviteter = mapAktiviteter(soknad).aktiviteter;
    const initialValues = {
        ...soknad,
        aktiviteter: aktiviteter.map((aktivitet) => {
            return {
                ...aktivitet,
                avvik: {},
            };
        }),
        utdanning: {},
        andreInntektskilder: andreInntektskilderDefault,
        utenlandsopphold: {
            perioder: [],
        },
    };
    const sisteSoknadISammeSykeforlop = getSisteSoknadISammeSykeforloep(soknad, soknader);

    return preutfyllSoknad(initialValues, sisteSoknadISammeSykeforlop);
};

export const getInitialValuesSykepengesoknad = (sykepengesoknad, state) => {
    return sykepengesoknad.status === sykepengesoknadstatuser.UTKAST_TIL_KORRIGERING
        ? mapBackendsoknadToSkjemasoknad(sykepengesoknad)
        : mapToInitialValues(sykepengesoknad, state.sykepengesoknader.data);
};

export const mapStateToProps = (state, ownProps) => {
    const { sykepengesoknad } = ownProps;
    return {
        key: sykepengesoknad.id,
        form: getSoknadSkjemanavn(sykepengesoknad.id),
        sykepengesoknad: mapAktiviteter(sykepengesoknad),
    };
};

export const mapStateToPropsMedInitialValues = (state, ownProps) => {
    const initialValues = getInitialValuesSykepengesoknad(ownProps.sykepengesoknad, state);

    return {
        ...mapStateToProps(state, ownProps),
        initialValues,
    };
};

const reduxFormSetup = (validate, Component, initialize = false) => {
    return compose(
        connect(initialize ? mapStateToPropsMedInitialValues : mapStateToProps),
        reduxForm({
            validate,
            destroyOnUnmount: false,
            forceUnregisterOnUnmount: true,
            sendTilFoerDuBegynner,
            onSubmitFail: (errors, dispatch, submitError, props) => {
                onSubmitFail(errors, dispatch, getSoknadSkjemanavn(props.sykepengesoknad.id));
            },
        }),
    )(Component);
};

export default reduxFormSetup;
