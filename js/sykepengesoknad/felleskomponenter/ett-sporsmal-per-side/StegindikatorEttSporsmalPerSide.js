import PropTypes from 'prop-types';
import React from 'react';
import Stegindikator from 'nav-frontend-stegindikator';
import { VAER_KLAR_OVER_AT } from '../../enums/tagtyper';
import history from '../../../history';
import { soknadPt } from '../../prop-types/soknadProptype';
import { hentTittel } from './ettSporsmalPerSideUtils';

const Fremdriftsbar = ({ aktivtSteg, antallSteg }) => {
    const style = {
        width: `${((100 / antallSteg) * aktivtSteg)}%`,
    };

    return (<div className="fremdriftsbar">
        <span
            className="fremdriftsbar__tekst"
            style={style}
            dangerouslySetInnerHTML={{
                __html: `${aktivtSteg}&nbsp;av&nbsp;${antallSteg}`,
            }}
        />
        <div className="fremdriftsbar__fullbredde" />
        <div
            className="fremdriftsbar__fremdrift"
            style={style}
        />
    </div>);
};

Fremdriftsbar.propTypes = {
    antallSteg: PropTypes.number,
    aktivtSteg: PropTypes.number,
};

const StegindikatorEttSporsmalPerSide = ({ soknad, sidenummer }) => {
    const steg = soknad.sporsmal.filter((s) => {
        return s.tag !== VAER_KLAR_OVER_AT;
    });
    return (<div className="stegindikator-med-fremdriftsbar" role="progressbar" aria-valuenow={sidenummer} aria-valuemin="1" aria-valuemax={steg.length}>
        <Stegindikator
            kompakt
            onChange={(stegindex) => {
                history.replace(`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${soknad.id}/${stegindex + 1}`);
            }}>
            {steg.map((s, index) => {
                const erPassert = (sidenummer - 1) > index;
                const erAktiv = (sidenummer - 1) === index;

                return (<Stegindikator.Steg
                    label={hentTittel(soknad, index + 1)}
                    aktiv={erAktiv}
                    disabled={!erPassert && !erAktiv}
                    key={`${soknad.id}-steg-${index}`}>
                    {s + 1}
                </Stegindikator.Steg>);
            })}
        </Stegindikator>
        <Fremdriftsbar aktivtSteg={sidenummer} antallSteg={steg.length} />
    </div>);
};

StegindikatorEttSporsmalPerSide.propTypes = {
    soknad: soknadPt,
    sidenummer: PropTypes.number,
};

export default StegindikatorEttSporsmalPerSide;
