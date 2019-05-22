import { parseSykmelding, sykmeldingstatuser } from '@navikt/digisyfo-npm';
import * as actiontyper from '../../../actions/actiontyper';

const { NY } = sykmeldingstatuser;

const initiellState = {
    henter: false,
    hentingFeilet: false,
    hentet: false,
    data: [],
};

const setSykmeldingProps = (_sykmeldinger, sykmeldingId, props) => {
    return _sykmeldinger.map((sykmelding) => {
        if (sykmelding.id === sykmeldingId) {
            return {
                ...sykmelding,
                ...props,
            };
        }
        return { ...sykmelding };
    });
};

const dineSykmeldinger = (state = initiellState, action = {}) => {
    switch (action.type) {
        case actiontyper.SET_DINE_SYKMELDINGER: {
            if (!state.data || state.data.length === 0) {
                return {
                    data: action.sykmeldinger.map((s) => {
                        return parseSykmelding(s);
                    }),
                    henter: false,
                    hentingFeilet: false,
                    hentet: true,
                };
            }
            return {
                data: state.data.map((gammelSykmelding) => {
                    const nySykmelding = action.sykmeldinger.filter((sykmld) => {
                        return sykmld.id === gammelSykmelding.id;
                    })[0];
                    return {
                        ...gammelSykmelding,
                        ...parseSykmelding(nySykmelding),
                    };
                }),
                henter: false,
                hentingFeilet: false,
                hentet: true,
            };
        }
        case actiontyper.HENTER_DINE_SYKMELDINGER: {
            return {
                data: state.data,
                henter: true,
                hentingFeilet: false,
                hentet: false,
            };
        }
        case actiontyper.AVBRYTER_SYKMELDING: {
            return {
                ...state,
                avbryter: true,
                avbrytFeilet: false,
            };
        }
        case actiontyper.ANGRER_BEKREFT_SYKMELDING: {
            return {
                ...state,
                angrerBekreftSykmelding: true,
                angreBekreftSykmeldingFeilet: false,
            };
        }
        case actiontyper.ANGRE_BEKREFT_SYKMELDING_FEILET: {
            return {
                ...state,
                angrerBekreftSykmelding: false,
                angreBekreftSykmeldingFeilet: true,
            };
        }
        case actiontyper.BEKREFT_SYKMELDING_ANGRET: {
            const data = setSykmeldingProps(state.data, action.sykmeldingId, {
                status: NY,
            });
            return {
                ...state,
                data,
                angrerBekreftSykmelding: false,
                angreBekreftSykmeldingFeilet: false,
            };
        }
        case actiontyper.HENT_DINE_SYKMELDINGER_FEILET: {
            return {
                data: [],
                henter: false,
                hentingFeilet: true,
                hentet: true,
            };
        }
        case actiontyper.BRUKER_ER_UTLOGGET: {
            return {
                data: [],
                hentingFeilet: false,
                henter: false,
            };
        }
        default: {
            return state;
        }
    }
};

export default dineSykmeldinger;
