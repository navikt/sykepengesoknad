import React from 'react';
import { connect } from 'react-redux';
import { getLedetekst, tilLesbarPeriodeMedArstall, sykmelding as sykmeldingPt } from '@navikt/digisyfo-npm';
import PropTypes from 'prop-types';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import * as proptypes from '../../propTypes';
import { soknadPt } from '../../sykepengesoknad/prop-types/soknadProptype';
import { OPPHOLD_UTLAND } from '../../sykepengesoknad/enums/soknadtyper';
import { settErOppdelt as settErOppdeltGammel } from '../../sykepengesoknad-gammel-plattform/data/sykepengesoknader/sykepengesoknader';
import { settErOppdelt as settErOppdeltNy } from '../../sykepengesoknad/utils/settErOppdelt';
import Brodsmuler from '../Brodsmuler';

const SykepengesoknadBanner = ({ soknad, sykmelding, henter, brodsmuler }) => {
    const settErOppdelt = soknad && soknad.soknadstype
        ? settErOppdeltNy
        : settErOppdeltGammel;
    const { _erOppdelt } = settErOppdelt(soknad, sykmelding);
    const tittel = soknad && soknad.soknadstype === OPPHOLD_UTLAND
        ? getLedetekst('sykepengesoknad-utland.tittel')
        : getLedetekst('sykepengesoknad.sidetittel');

    return henter
        ? null
        : (<React.Fragment>
            <header className="soknadtopp">
                <div className="begrensning begrensning--soknad soknadtopp__brodsmuler">
                    <Brodsmuler brodsmuler={brodsmuler} />
                </div>
                <h1 className="soknadtopp__tittel">{tittel}</h1>
                {
                    _erOppdelt
                    && (<div className="soknadtopp__meta begrensning begrensning--soknad">
                        <p>
                            {
                                getLedetekst('sykepengesoknad.sidetittel.periode-2', {
                                    '%PERIODE%': tilLesbarPeriodeMedArstall(soknad.fom, soknad.tom),
                                })
                            }
                        </p>
                        <Hjelpetekst id="oppdelt-soknad-hjelpetekst">{getLedetekst('sykepengesoknad.sidetittel.hjelpetekst.tekst')}</Hjelpetekst>
                    </div>)
                }
            </header>
        </React.Fragment>);
};

SykepengesoknadBanner.propTypes = {
    soknad: PropTypes.oneOfType([
        proptypes.sykepengesoknad,
        soknadPt,
    ]),
    sykmelding: sykmeldingPt,
    henter: PropTypes.bool,
    brodsmuler: PropTypes.arrayOf(proptypes.brodsmule),
};

const mapStateToProps = (state, ownProps) => {
    return {
        henter: state.dineSykmeldinger.henter
            || state.ledetekster.henter
            || state.soknader.henter
            || state.sykepengesoknader.henter,
        sykmelding: ownProps.soknad
            ? state.dineSykmeldinger.data.find((s) => {
                return s.id === ownProps.soknad.sykmeldingId;
            })
            : undefined,
    };
};

export default connect(mapStateToProps)(SykepengesoknadBanner);
