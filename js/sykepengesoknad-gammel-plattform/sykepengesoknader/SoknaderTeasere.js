import React from 'react';
import PropTypes from 'prop-types';
import SykepengesoknadTeaser from './SykepengesoknadTeaser';
import { sykepengesoknad as sykepengesoknadPt, soknadPt } from '../../propTypes/index';

const SoknaderTeasere = ({ soknader, className, tittel = '', tomListeTekst, id, Child = SykepengesoknadTeaser }) => {
    return (<div className="blokk--l">
        <header className="inngangspanelerHeader">
            <h2 className="inngangspanelerHeader__tittel">{tittel}</h2>
        </header>
        <div id={id} className={className || 'js-content'}>
            {
                (soknader.length ? [...soknader]
                    .map((soknad, idx) => {
                        return <Child key={idx} soknad={soknad} />;
                    }) : <p className="panel typo-infotekst">{tomListeTekst}</p>)
            }
        </div>
    </div>);
};

SoknaderTeasere.propTypes = {
    soknader: PropTypes.arrayOf(PropTypes.oneOfType([sykepengesoknadPt, soknadPt])),
    className: PropTypes.string,
    tittel: PropTypes.string,
    tomListeTekst: PropTypes.string,
    id: PropTypes.string,
    Child: PropTypes.func,
};

export default SoknaderTeasere;
