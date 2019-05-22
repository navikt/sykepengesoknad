import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import { getHtmlLedetekst, getLedetekst, tilDatePeriode } from '@navikt/digisyfo-npm';
import { Field, getFormValues } from 'redux-form';
import PropTypes from 'prop-types';
import { jaEllerNeiAlternativer, parseJaEllerNei } from '../../components/skjema/JaEllerNei';
import Radioknapper from '../../components/skjema/Radioknapper';
import { datoErHelgedag, erGyldigPeriode, tilDager } from '../../utils/periodeUtils';
import { getSoknadSkjemanavn } from '../../enums/skjemanavn';

const tilTimestamp = (dato) => {
    return dato.getTime();
};

const Presisering = ({ nokkel, className }) => {
    const classNames = cn('presisering js-presisering', className);
    return (<div className={classNames}>
        <div
            className="redaksjonelt-innhold"
            dangerouslySetInnerHTML={getHtmlLedetekst(nokkel)} />
    </div>);
};

Presisering.propTypes = {
    nokkel: PropTypes.string,
    className: PropTypes.string,
};

const PresiseringJa = () => {
    return (<Presisering
        className="blokk--s js-presisering-ja"
        nokkel="sykepengesoknad.ferie-permisjon-utenlandsopphold.ja-presisering-sykepenger-utlandet" />);
};

const PresiseringNei = () => {
    return (<Presisering
        className="js-presisering-nei"
        nokkel="sykepengesoknad.ferie-permisjon-utenlandsopphold.nei-presisering-sykepenger-utlandet" />);
};

export const visSoktOmSykepengerUtenlandsoppholdsporsmal = (values) => {
    const utenlandsoppholdperioder = values.utenlandsopphold.perioder.filter(erGyldigPeriode).map(tilDatePeriode);
    const ferieperioder = values.ferie ? values.ferie.filter(erGyldigPeriode).map(tilDatePeriode) : [];
    const utenlandsoppholddager = tilDager(utenlandsoppholdperioder).map(tilTimestamp);
    const feriedager = tilDager(ferieperioder).map(tilTimestamp);
    return utenlandsoppholddager.some((dag) => {
        return datoErHelgedag(new Date(dag))
            ? false
            : feriedager.indexOf(dag) === -1;
    });
};

export const Sporsmal = ({ vis }) => {
    return vis
        ? (<div className="utenlandsoppholdsporsmal">
            <Field
                spoersmal={getLedetekst('sykepengesoknad.ferie-permisjon-utenlandsopphold.sokt-om-sykepenger.sporsmal')}
                name="utenlandsopphold.soektOmSykepengerIPerioden"
                component={Radioknapper}
                Overskrift="h5"
                parse={parseJaEllerNei}>
                {
                    jaEllerNeiAlternativer.map((alt, index) => {
                        return (<i {...alt} key={index}>
                            {
                                alt.value === true
                                    ? <PresiseringJa />
                                    : <PresiseringNei />
                            }
                        </i>);
                    })
                }
            </Field>
        </div>)
        : null;
};

Sporsmal.propTypes = {
    vis: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
    const values = getFormValues(getSoknadSkjemanavn(ownProps.sykepengesoknad.id))(state);

    return {
        vis: visSoktOmSykepengerUtenlandsoppholdsporsmal(values),
    };
};

export default connect(mapStateToProps)(Sporsmal);
