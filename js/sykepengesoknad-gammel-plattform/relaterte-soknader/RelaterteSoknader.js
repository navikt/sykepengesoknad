import { Link } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { getLedetekst, tilLesbarDatoMedArstall } from '@navikt/digisyfo-npm';
import { getTidligsteSendtDato, sorterEtterSendtDato } from '../utils/sorterSoknader';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes';

const RelaterteSoknader = ({ relaterteSoknader }) => {
    if (relaterteSoknader.length === 0) {
        return null;
    }
    return (<div className="panel tidligereVersjoner">
        <h2 className="tidligereVersjoner__tittel">{getLedetekst('relaterte-soknader.tittel')}</h2>
        <ul className="tidligereVersjoner__liste">
            {
                relaterteSoknader
                    .sort(sorterEtterSendtDato)
                    .map((s, index) => {
                        return (<li key={index}>
                            <Link
                                to={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${s.id}`}>
                                {getLedetekst('relaterte-soknader.sendt')} {tilLesbarDatoMedArstall(getTidligsteSendtDato(s))}
                            </Link>
                        </li>);
                    })
            }
        </ul>
    </div>);
};

RelaterteSoknader.propTypes = {
    relaterteSoknader: PropTypes.arrayOf(sykepengesoknadPt),
};

export default RelaterteSoknader;
