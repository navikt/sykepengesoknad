import PropTypes from 'prop-types';
import * as svartyper from '../enums/svartyper';

export const svartypePt = PropTypes.oneOf(Object.values(svartyper));
