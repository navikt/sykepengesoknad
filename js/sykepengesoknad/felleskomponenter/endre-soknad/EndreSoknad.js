import React from 'react';
import PropTypes from 'prop-types';
import Knapp from 'nav-frontend-knapper';
import { soknadPt } from '../../../propTypes/index';

const EndreSoknad = ({ soknad, endreSoknad, endrer, vis }) => {
    return vis
        ? (<div className="verktoylinje__element">
            <Knapp
                type="standard"
                spinner={endrer}
                disabled={endrer}
                mini
                onClick={(e) => {
                    e.preventDefault();
                    endreSoknad(soknad.id);
                }}
                className="js-endre">
                Endre søknad
            </Knapp>
        </div>)
        : null;
};

EndreSoknad.propTypes = {
    endreSoknad: PropTypes.func,
    endrer: PropTypes.bool,
    soknad: soknadPt,
    vis: PropTypes.bool,
};

export default EndreSoknad;
