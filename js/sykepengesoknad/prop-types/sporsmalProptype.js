import PropTypes from 'prop-types';
import { svar } from './svarProptype';
import { svartypePt } from './svartypeProptype';

export const sporsmalShape = {
    id: PropTypes.string,
    kriterieForVisningAvUndersporsmal: PropTypes.string,
    max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]),
    min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]),
    sporsmalstekst: PropTypes.string,
    svar,
    svartype: svartypePt,
    tag: PropTypes.string,
    undertekst: PropTypes.string,
    pavirkerAndreSporsmal: PropTypes.bool,
};

sporsmalShape.undersporsmal = PropTypes.arrayOf(PropTypes.shape(sporsmalShape));
export const sporsmal = PropTypes.shape(sporsmalShape);
