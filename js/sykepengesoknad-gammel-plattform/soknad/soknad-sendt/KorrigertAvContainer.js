import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getLedetekst, tilLesbarDatoMedArstall } from '@navikt/digisyfo-npm';
import Alertstripe from 'nav-frontend-alertstriper';
import { sykepengesoknad as sykepengesoknadPt } from '../../../propTypes/index';
import { getTidligsteSendtDato } from '../../utils/sorterSoknader';

export const KorrigertAv = ({ korrigertAvSoknad }) => {
    return (<Alertstripe className="blokk" type="info">
        <p className="sist">
            {getLedetekst('sykepengesoknad.korrigert.tekst', {
                '%DATO%': tilLesbarDatoMedArstall(getTidligsteSendtDato(korrigertAvSoknad)),
            })}
        </p>
        <p className="sist">
            <Link className="lenke" to={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${korrigertAvSoknad.id}`}>{getLedetekst('sykepengesoknad.korrigert.lenketekst')}</Link>
        </p>
    </Alertstripe>);
};

KorrigertAv.propTypes = {
    korrigertAvSoknad: sykepengesoknadPt,
};

export const mapStateToProps = (state, ownProps) => {
    const id = ownProps.sykepengesoknad.id;
    const sykepengesoknader = [
        ...state.sykepengesoknader.data,
        ...state.soknader.data,
    ];
    let korrigertAvSoknad = { id };

    sykepengesoknader.forEach(() => {
        sykepengesoknader.forEach((s) => {
            if (s.korrigerer === korrigertAvSoknad.id) {
                korrigertAvSoknad = s;
            }
        });
    });

    return {
        korrigertAvSoknad,
    };
};

const KorrigertAvContainer = connect(mapStateToProps)(KorrigertAv);

export default KorrigertAvContainer;
