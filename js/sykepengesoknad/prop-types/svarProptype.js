import PropTypes from 'prop-types';

export const svar = PropTypes.arrayOf(PropTypes.shape({
    verdi: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
}));
