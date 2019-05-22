import PropTypes from 'prop-types';
import * as soknadmottakertyper from '../enums/soknadmottakertyper';

export const soknadmottakerPt = PropTypes.oneOf(Object.values(soknadmottakertyper));

export const soknadMetaReducerPt = PropTypes.shape({
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    hentet: PropTypes.bool,
    data: PropTypes.shape({
        mottaker: soknadmottakerPt,
    }),
});
