import { sykmeldingHarBehandletSoknad } from '../../../sykepengesoknad/data/soknader/soknaderSelectors';
import { toggleSykmeldingEndreArbeidssituasjon } from '../../../selectors/unleashTogglesSelectors';

export const selectDineSykmeldingerSlice = (state) => {
    return state.dineSykmeldinger;
};

export const selectDineSykmeldingerData = (state) => {
    return selectDineSykmeldingerSlice(state).data;
};

export const selectSkalHenteDineSykmeldinger = (state) => {
    const dineSykmeldinger = selectDineSykmeldingerSlice(state);
    return !dineSykmeldinger.henter
        && !dineSykmeldinger.hentet
        && !dineSykmeldinger.hentingFeilet;
};

export const selectKanEndreSykmeldingArbeidssituasjon = (state, sykmelding) => {
    const FIRE_MANEDER_SIDEN = new Date();
    FIRE_MANEDER_SIDEN.setMonth(FIRE_MANEDER_SIDEN.getMonth() - 4);
    return sykmelding.sendtdato > FIRE_MANEDER_SIDEN
        && !sykmeldingHarBehandletSoknad(state, sykmelding.id)
        && toggleSykmeldingEndreArbeidssituasjon(state);
};

export const selectDinSykmelding = (state, sykmeldingId) => {
    return selectDineSykmeldingerData(state).find((s) => {
        return s.id === sykmeldingId;
    });
};
