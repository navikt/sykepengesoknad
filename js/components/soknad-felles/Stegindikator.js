import React from 'react';
import PropTypes from 'prop-types';
import Stegindikator from 'nav-frontend-stegindikator';
import history from '../../history';

export const arbeidstakerUrler = ['', 'fravaer-og-friskmelding', 'aktiviteter-i-sykmeldingsperioden', ''];
export const frilanserOgSelvstendigUrler = ['', 'fravaer-og-friskmelding', 'aktiviteter-i-sykmeldingsperioden', ''];

const Wrapper = ({ aktivtSteg, soknadId, urler = arbeidstakerUrler }) => {
    const steg = [0, 1, 2, 3];
    return (<div className="blokk--l" role="progressbar" aria-valuenow={aktivtSteg} aria-valuemin="1" aria-valuemax="3">
        <Stegindikator
            onChange={(stegindex) => {
                history.replace(`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${soknadId}/${urler[stegindex]}`);
            }}>
            {steg.map((s, index) => {
                const erPassert = (parseFloat(aktivtSteg) - 1) > s;
                const erAktiv = (parseFloat(aktivtSteg) - 1) === s;

                return (<Stegindikator.Steg
                    aktiv={erAktiv}
                    disabled={!erPassert && !erAktiv}
                    key={`${soknadId}-steg-${index}`}>
                    {s + 1}
                </Stegindikator.Steg>);
            })}
        </Stegindikator>
    </div>);
};

Wrapper.propTypes = {
    soknadId: PropTypes.string,
    aktivtSteg: PropTypes.string,
    urler: PropTypes.arrayOf(PropTypes.string),
};

export default Wrapper;
