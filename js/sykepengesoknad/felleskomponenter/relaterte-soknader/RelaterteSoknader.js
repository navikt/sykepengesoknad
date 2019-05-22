import React from 'react';
import { Link } from 'react-router';
import { getLedetekst, tilLesbarDatoMedArstall } from '@navikt/digisyfo-npm';
import PropTypes from 'prop-types';
import { soknadPt as sykepengesoknadPt } from '../../../propTypes';
import { getTidligsteSendtDato } from '../../../sykepengesoknad-gammel-plattform/utils/sorterSoknader';

export const RelaterteSoknader = ({ relaterteSoknader }) => {
    if (relaterteSoknader.length === 0) {
        return null;
    }
    return (<div className="panel tidligereVersjoner">
        <h2 className="tidligereVersjoner__tittel">{getLedetekst('relaterte-soknader.tittel')}</h2>
        <ul className="tidligereVersjoner__liste">
            {
                relaterteSoknader
                    .sort((s1, s2) => {
                        return getTidligsteSendtDato(s2) - getTidligsteSendtDato(s1);
                    })
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
