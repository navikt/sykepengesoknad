import PropTypes from 'prop-types';
import { sporsmal } from './sporsmalProptype';

export const soknadPt = PropTypes.shape({
    id: PropTypes.string,
    sykmeldingId: PropTypes.string,
    soknadstype: PropTypes.string,
    status: PropTypes.string,
    fom: PropTypes.instanceOf(Date),
    tom: PropTypes.instanceOf(Date),
    opprettetDato: PropTypes.instanceOf(Date),
    innsendtDato: PropTypes.instanceOf(Date),
    sendtTilNAVDato: PropTypes.instanceOf(Date),
    sendtTilArbeidsgiverDato: PropTypes.instanceOf(Date),
    sporsmal: PropTypes.arrayOf(sporsmal),
});
