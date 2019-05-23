import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import dineSykmeldinger from './dineSykmeldinger';
import * as actions from './dineSykmeldingerActions';
import * as brukerActions from '../../../data/brukerinfo/brukerinfo_actions';

export function getSykmelding(soknad = {}) {
    return Object.assign({}, {
        id: '73970c89-1173-4d73-b1cb-e8445c2840e2',
        startLegemeldtFravaer: '2017-07-07',
        skalViseSkravertFelt: true,
        identdato: '2017-07-07',
        status: 'SENDT',
        naermesteLederStatus: null,
        innsendtArbeidsgivernavn: 'ARBEIDS- OG VELFERDSDIREKTORATET, AVD SANNERGATA',
        valgtArbeidssituasjon: null,
        orgnummer: '123456789',
        sendtdato: '2017-07-24T10:19:15',
        pasient: {
            fnr: '12345678910',
            fornavn: 'Helen',
            etternavn: 'Flood',
        },
        arbeidsgiver: 'LOMMEN BARNEHAVE',
        diagnose: {
            hoveddiagnose: {
                diagnose: 'TENDINITT INA',
                diagnosekode: 'L87',
                diagnosesystem: 'ICPC-2',
            },
            bidiagnoser: [
                {
                    diagnose: 'GANGLION SENE',
                    diagnosekode: 'L87',
                    diagnosesystem: 'ICPC-2',
                },
            ],
            fravaersgrunnLovfestet: null,
            fravaerBeskrivelse: 'Medising årsak i kategorien annet',
            svangerskap: true,
            yrkesskade: true,
            yrkesskadeDato: '2017-07-07',
        },
        mulighetForArbeid: {
            perioder: [
                {
                    fom: '2017-07-07',
                    tom: '2017-07-23',
                    grad: 100,
                    behandlingsdager: null,
                    reisetilskudd: null,
                    avventende: null,
                },
            ],
            aktivitetIkkeMulig433: [
                'Annet',
            ],
            aktivitetIkkeMulig434: [
                'Annet',
            ],
            aarsakAktivitetIkkeMulig433: 'andre årsaker til sykefravær',
            aarsakAktivitetIkkeMulig434: 'andre årsaker til sykefravær',
        },
        friskmelding: {
            arbeidsfoerEtterPerioden: true,
            hensynPaaArbeidsplassen: 'Må ta det pent',
            antarReturSammeArbeidsgiver: true,
            antattDatoReturSammeArbeidsgiver: '2017-07-07',
            antarReturAnnenArbeidsgiver: true,
            tilbakemeldingReturArbeid: '2017-07-07',
            utenArbeidsgiverAntarTilbakeIArbeid: false,
            utenArbeidsgiverAntarTilbakeIArbeidDato: '2017-03-10',
            utenArbeidsgiverTilbakemelding: '2017-03-10',
        },
        utdypendeOpplysninger: {
            sykehistorie: null,
            paavirkningArbeidsevne: null,
            resultatAvBehandling: null,
            henvisningUtredningBehandling: null,
        },
        arbeidsevne: {
            tilretteleggingArbeidsplass: 'Fortsett som sist.',
            tiltakNAV: 'Pasienten har plager',
            tiltakAndre: null,
        },
        meldingTilNav: {
            navBoerTaTakISaken: false,
            navBoerTaTakISakenBegrunnelse: null,
        },
        innspillTilArbeidsgiver: null,
        tilbakedatering: {
            dokumenterbarPasientkontakt: '2017-03-12',
            tilbakedatertBegrunnelse: null,
        },
        bekreftelse: {
            utstedelsesdato: '2017-07-24',
            sykmelder: 'Helen Flood',
            sykmelderTlf: '99988777',
        },
    }, soknad);
}

export function getParsetSykmelding(soknad = {}) {
    return Object.assign({}, {
        id: '73970c89-1173-4d73-b1cb-e8445c2840e2',
        startLegemeldtFravaer: new Date('2017-07-07'),
        skalViseSkravertFelt: true,
        identdato: new Date('2017-07-07'),
        status: 'SENDT',
        naermesteLederStatus: null,
        innsendtArbeidsgivernavn: 'ARBEIDS- OG VELFERDSDIREKTORATET, AVD SANNERGATA',
        valgtArbeidssituasjon: null,
        orgnummer: '123456789',
        sendtdato: new Date('2017-07-24T10:19:15'),
        pasient: {
            fnr: '12345678910',
            fornavn: 'Helen',
            etternavn: 'Flood',
        },
        arbeidsgiver: 'LOMMEN BARNEHAVE',
        diagnose: {
            hoveddiagnose: {
                diagnose: 'TENDINITT INA',
                diagnosekode: 'L87',
                diagnosesystem: 'ICPC-2',
            },
            bidiagnoser: [
                {
                    diagnose: 'GANGLION SENE',
                    diagnosekode: 'L87',
                    diagnosesystem: 'ICPC-2',
                },
            ],
            fravaersgrunnLovfestet: null,
            fravaerBeskrivelse: 'Medising årsak i kategorien annet',
            svangerskap: true,
            yrkesskade: true,
            yrkesskadeDato: new Date('2017-07-07'),
        },
        mulighetForArbeid: {
            perioder: [
                {
                    fom: new Date('2017-07-07'),
                    tom: new Date('2017-07-23'),
                    grad: 100,
                    behandlingsdager: null,
                    reisetilskudd: null,
                    avventende: null,
                },
            ],
            aktivitetIkkeMulig433: [
                'Annet',
            ],
            aktivitetIkkeMulig434: [
                'Annet',
            ],
            aarsakAktivitetIkkeMulig433: 'andre årsaker til sykefravær',
            aarsakAktivitetIkkeMulig434: 'andre årsaker til sykefravær',
        },
        friskmelding: {
            arbeidsfoerEtterPerioden: true,
            hensynPaaArbeidsplassen: 'Må ta det pent',
            antarReturSammeArbeidsgiver: true,
            antattDatoReturSammeArbeidsgiver: new Date('2017-07-07'),
            antarReturAnnenArbeidsgiver: true,
            tilbakemeldingReturArbeid: new Date('2017-07-07'),
            utenArbeidsgiverAntarTilbakeIArbeid: false,
            utenArbeidsgiverAntarTilbakeIArbeidDato: new Date('2017-03-10'),
            utenArbeidsgiverTilbakemelding: new Date('2017-03-10'),
        },
        utdypendeOpplysninger: {
            sykehistorie: null,
            paavirkningArbeidsevne: null,
            resultatAvBehandling: null,
            henvisningUtredningBehandling: null,
        },
        arbeidsevne: {
            tilretteleggingArbeidsplass: 'Fortsett som sist.',
            tiltakNAV: 'Pasienten har plager',
            tiltakAndre: null,
        },
        meldingTilNav: {
            navBoerTaTakISaken: false,
            navBoerTaTakISakenBegrunnelse: null,
        },
        innspillTilArbeidsgiver: null,
        tilbakedatering: {
            dokumenterbarPasientkontakt: new Date('2017-03-12'),
            tilbakedatertBegrunnelse: null,
        },
        bekreftelse: {
            utstedelsesdato: new Date('2017-07-24'),
            sykmelder: 'Helen Flood',
            sykmelderTlf: '99988777',
        },
    }, soknad);
}

describe('dineSykmeldingerReducer', () => {
    it('håndterer SET_DINE_SYKMELDINGER når man ikke har sykmeldinger fra før', () => {
        const initialState = deepFreeze({
            data: [],
        });
        const action = actions.setDineSykmeldinger([getSykmelding()]);
        const nextState = dineSykmeldinger(initialState, action);

        expect(nextState).to.deep.equal({
            data: [getParsetSykmelding()],
            henter: false,
            hentingFeilet: false,
            hentet: true,
        });
    });

    it('håndterer SET_DINE_SYKMELDINGER når datofelter er null', () => {
        const initialState = deepFreeze({
            data: [],
        });
        const action = actions.setDineSykmeldinger([getSykmelding({ identdato: null })]);
        const nextState = dineSykmeldinger(initialState, action);

        expect(nextState).to.deep.equal({
            data: [getParsetSykmelding({ identdato: null })],
            henter: false,
            hentingFeilet: false,
            hentet: true,
        });
    });

    it('håndterer SET_DINE_SYKMELDINGER når man har sykmeldinger fra før, ved å kun overskrive properties som finnes', () => {
        const initialState = deepFreeze({
            hentet: false,
            data: [getParsetSykmelding({ id: '55' }), getParsetSykmelding({ id: '44' })],
        });
        const action = actions.setDineSykmeldinger([getSykmelding({ id: '55', navn: 'Harald' }), getSykmelding({ id: '44' })]);
        const nextState = dineSykmeldinger(initialState, action);

        expect(nextState).to.deep.equal({
            data: [getParsetSykmelding({ id: '55', navn: 'Harald' }), getParsetSykmelding({ id: '44' })],
            henter: false,
            hentingFeilet: false,
            hentet: true,
        });
    });

    it('Parser datofelter', () => {
        const initialState = deepFreeze({
            hentet: false,
            data: [],
        });
        const action = actions.setDineSykmeldinger([getSykmelding()]);
        const nextState = dineSykmeldinger(initialState, action);
        expect(nextState.data).to.deep.equal([getParsetSykmelding()]);
    });

    it('Håndterer HENTER_DINE_SYKMELDINGER når man ikke har data fra før', () => {
        const initialState = deepFreeze({
            data: [],
        });
        const action = actions.henterDineSykmeldinger();
        const nextState = dineSykmeldinger(initialState, action);
        expect(nextState).to.deep.equal({
            data: [],
            henter: true,
            hentingFeilet: false,
            hentet: false,
        });
    });

    it('Håndterer HENTER_DINE_SYKMELDINGER når man har data fra før', () => {
        const initialState = deepFreeze({
            data: [{
                id: 77,
            }, {
                id: 6789,
            }],
        });
        const action = actions.henterDineSykmeldinger();
        const nextState = dineSykmeldinger(initialState, action);
        expect(nextState).to.deep.equal({
            data: [{
                id: 77,
            }, {
                id: 6789,
            }],
            henter: true,
            hentet: false,
            hentingFeilet: false,
        });
    });

    it('Håndterer HENT_DINE_SYKMELDINGER_FEILET', () => {
        const initialState = deepFreeze({
            hentet: true,
        });
        const action = actions.hentDineSykmeldingerFeilet();
        const nextState = dineSykmeldinger(initialState, action);
        expect(nextState).to.deep.equal({
            data: [],
            henter: false,
            hentingFeilet: true,
            hentet: true,
        });
    });

    it('Håndterer BRUKER_ER_UTLOGGET', () => {
        const initialState = deepFreeze({
            data: [{ id: '5566' }],
            henter: false,
            hentingFeilet: false,
        });
        const action = brukerActions.setErUtlogget();
        const nextState = dineSykmeldinger(initialState, action);
        expect(nextState).to.deep.equal({
            henter: false,
            hentingFeilet: false,
            data: [],
        });
    });
});
