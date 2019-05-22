import * as actiontyper from '../../../actions/actiontyper';
import { createReducer } from '../../../reducers/createReducer';

const arbeidsgiverperiodeberegning = createReducer(
    actiontyper.HENT_ARBEIDSGIVERPERIODEBEREGNING_FEILET,
    actiontyper.HENTER_ARBEIDSGIVERPERIODEBEREGNING,
    actiontyper.ARBEIDSGIVERPERIODEBEREGNING_HENTET);

export default arbeidsgiverperiodeberegning;
