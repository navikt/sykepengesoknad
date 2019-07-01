import PropTypes from 'prop-types';
import * as avgittAvEnums from '../enums/avgittavEnums';

export const svar = PropTypes.arrayOf(PropTypes.shape({
    verdi: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    avgittAv: PropTypes.oneOf(Object.values(avgittAvEnums)),
}));
