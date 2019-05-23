import * as actiontyper from '../../../data/actiontyper';
import { createReducer } from '../../../data/createReducer';

const arbeidsgiverperiodeberegning = createReducer(
    actiontyper.HENT_ARBEIDSGIVERPERIODEBEREGNING_FEILET,
    actiontyper.HENTER_ARBEIDSGIVERPERIODEBEREGNING,
    actiontyper.ARBEIDSGIVERPERIODEBEREGNING_HENTET);

export default arbeidsgiverperiodeberegning;
