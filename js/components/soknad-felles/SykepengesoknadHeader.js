import React from 'react';
import { getLedetekst, tilLesbarPeriodeMedArstall } from '@navikt/digisyfo-npm';
import PropTypes from 'prop-types';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import * as proptypes from '../../propTypes';
import Sidetopp from '../Sidetopp';
import { soknadPt } from '../../sykepengesoknad/prop-types/soknadProptype';

const SykepengesoknadHeader = ({ sykepengesoknad }) => {
    return !sykepengesoknad._erOppdelt
        ? <Sidetopp tittel={getLedetekst('sykepengesoknad.sidetittel')} />
        : (<header className="sidetopp">
            <h1 className="sidetopp__tittel">{getLedetekst('sykepengesoknad.sidetittel')}</h1>
            <div className="medHjelpetekst sidetopp__meta">
                <p>{
                    getLedetekst('sykepengesoknad.sidetittel.periode-2', {
                        '%PERIODE%': tilLesbarPeriodeMedArstall(sykepengesoknad.fom, sykepengesoknad.tom),
                    })
                }</p>
                <Hjelpetekst id="oppdelt-soknad-hjelpetekst">{getLedetekst('sykepengesoknad.sidetittel.hjelpetekst.tekst')}</Hjelpetekst>
            </div>
        </header>);
};

SykepengesoknadHeader.propTypes = {
    sykepengesoknad: PropTypes.oneOfType([
        proptypes.sykepengesoknad,
        soknadPt,
    ]),
};

export default SykepengesoknadHeader;
