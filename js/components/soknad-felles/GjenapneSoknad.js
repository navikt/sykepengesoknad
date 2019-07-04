import React from 'react';
import PropTypes from 'prop-types';
import Knapp from 'nav-frontend-knapper';
import { getLedetekst, sykepengesoknad as sykepengesoknadPt } from '@navikt/digisyfo-npm';
import { soknadPt } from '../../propTypes';
import logger from '../../logging';

const GjenapneSoknad = (
    {
        sykepengesoknad, gjenapneSoknad, gjenapner, gjenapneFeilet,
        tekst = getLedetekst('sykepengesoknad.gjenapne.knapp'), vis,
    }) => {
    logger.info(`GjenapneSoknad-1 - sykepengesoknad.id: ${sykepengesoknad.id} - vis: ${vis}`);

    return vis
        ? <React.Fragment>
            <div className={`verktoylinje ${gjenapneFeilet ? 'blokk--mini' : ''}`}>
                <div className="verktoylinje__element">
                    {
                        logger.info(`GjenapneSoknad-2 - sykepengesoknad.id: ${sykepengesoknad.id} - vis: ${vis}`)
                    }
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
                        {tekst}
                    </Knapp>
                </div>
            </div>
            <div aria-live="polite">
                {gjenapneFeilet && <p className="skjemaelement__feilmelding">Beklager, søknaden kunne ikke gjenåpnes</p>}
            </div>
        </React.Fragment>
        : null;
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
