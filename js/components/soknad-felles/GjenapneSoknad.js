import React from 'react';
import PropTypes from 'prop-types';
import Knapp from 'nav-frontend-knapper';
import { getLedetekst, sykepengesoknad as sykepengesoknadPt } from '@navikt/digisyfo-npm';
import { soknadPt } from '../../propTypes';

const GjenapneSoknad = ({ sykepengesoknad, gjenapneSoknad, gjenapner, gjenapneFeilet, tekst = getLedetekst('sykepengesoknad.gjenapne.knapp'), vis }) => {
    return vis ? (<div>
        <div className={`verktoylinje ${gjenapneFeilet ? 'blokk--mini' : ''}`}>
            <div className="verktoylinje__element">
                <Knapp
                    type="standard"
                    spinner={gjenapner}
                    disabled={gjenapner}
                    mini
                    onClick={(e) => {
                        e.preventDefault();
                        gjenapneSoknad(sykepengesoknad);
                    }}
                    className="js-gjenapne">
                    {tekst}</Knapp>
            </div>
        </div>
        <div aria-live="polite">
            { gjenapneFeilet && <p className="skjemaelement__feilmelding">Beklager, søknaden kunne ikke gjenåpnes</p> }
        </div>
    </div>) : null;
};

GjenapneSoknad.propTypes = {
    gjenapneSoknad: PropTypes.func,
    gjenapner: PropTypes.bool,
    gjenapneFeilet: PropTypes.bool,
    sykepengesoknad: PropTypes.oneOfType([soknadPt, sykepengesoknadPt]),
    tekst: PropTypes.string,
    vis: PropTypes.bool,
};

export default GjenapneSoknad;
