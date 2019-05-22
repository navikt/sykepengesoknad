import deepFreeze from 'deep-freeze';
import { expect } from 'chai';
import sinon from 'sinon';
import { parseSykepengesoknad } from '@navikt/digisyfo-npm';
import * as actiontyper from '../../../actions/actiontyper';
import sykepengesoknader, {
    finnSoknad,
    sorterAktiviteterEldsteFoerst,
    settErOppdelt,
} from './sykepengesoknader';
import * as actions from './sykepengesoknader_actions';

const getSoknad = () => {
    return {
        aktiviteter: [
            {
                avvik: null,
                grad: 100,
                periode: {
                    fom: '2016-07-15',
                    tom: '2017-01-19',
                },
            },
        ],
        fom: '2016-07-15',
        tom: '2017-01-19',
        egenmeldingsperioder: [],
        ferie: [],
        gjenopptattArbeidFulltUtDato: null,
        identdato: null,
        oppfoelgingsdato: null,
        permisjon: [],
        utdanning: null,
        utenlandsopphold: {
            perioder: [],
            soektOmSykepengerIPerioden: null,
        },
        opprettetDato: '2017-01-01',
        sendtTilArbeidsgiverDato: null,
        sendtTilNAVDato: null,
        sykmeldingSkrevetDato: '2017-02-15',
        forrigeSykeforloepTom: '2017-01-18',
        forrigeSendteSoknadTom: null,
        id: '1',
        avbruttDato: null,
    };
};

const getParsetSoknad = () => {
    return {
        aktiviteter: [
            {
                avvik: null,
                grad: 100,
                periode: {
                    fom: new Date('2016-07-15'),
                    tom: new Date('2017-01-19'),
                },
            },
        ],
        fom: new Date('2016-07-15'),
        tom: new Date('2017-01-19'),
        egenmeldingsperioder: [],
        ferie: [],
        gjenopptattArbeidFulltUtDato: null,
        identdato: null,
        oppfoelgingsdato: null,
        permisjon: [],
        utdanning: null,
        utenlandsopphold: {
            perioder: [],
            soektOmSykepengerIPerioden: null,
        },
        opprettetDato: new Date('2017-01-01'),
        sendtTilArbeidsgiverDato: null,
        sendtTilNAVDato: null,
        sykmeldingSkrevetDato: new Date('2017-02-15'),
        forrigeSendteSoknadTom: null,
        forrigeSykeforloepTom: new Date('2017-01-18'),
        id: '1',
        avbruttDato: null,
        _erOppdelt: false,
    };
};

describe('sykepengesoknader', () => {
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(1484524800000); // 16. januar 2017
    });

    afterEach(() => {
        clock.restore();
    });

    describe('henter', () => {
        let initialState = deepFreeze({
            data: [],
            henter: false,
            hentingFeilet: false,
            sender: false,
            sendingFeilet: false,
        });

        it('håndterer SYKEPENGESOKNADER_HENTET', () => {
            const action = {
                type: actiontyper.SYKEPENGESOKNADER_HENTET,
                sykepengesoknader: [getSoknad()],
            };
            const nextState = sykepengesoknader(initialState, action);

            expect(nextState).to.deep.equal({
                data: [getParsetSoknad()],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
                hentet: true,
            });
        });

        it('håndterer HENTER_SYKEPENGESOKNADER', () => {
            const action = actions.henterSykepengesoknader();
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [],
                henter: true,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
                hentet: false,
            });
        });

        it('håndterer HENT_SYKEPENGESOKNADER_FEILET', () => {
            const soknad = {
                id: '1',
            };

            initialState = deepFreeze({
                data: [soknad],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });

            const action = actions.hentSykepengesoknaderFeilet();
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [soknad],
                henter: false,
                hentingFeilet: true,
                sender: false,
                sendingFeilet: false,
                hentet: true,
            });
        });
    });

    describe('innsending', () => {
        it('håndterer SENDER_SYKEPENGESOKNAD', () => {
            const soknad = {
                id: '1',
            };
            const initialState = deepFreeze({
                data: [soknad],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });
            const action = {
                type: actiontyper.SENDER_SYKEPENGESOKNAD,
            };
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [soknad],
                sender: true,
                sendingFeilet: false,
                henter: false,
                hentingFeilet: false,
            });
        });

        it('håndterer SEND_SYKEPENGESOKNAD_FEILET', () => {
            const soknad = {
                id: '1',
            };
            const initialState = deepFreeze({
                data: [soknad],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });
            const action = actions.sendSykepengesoknadFeilet();
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [soknad],
                sender: false,
                sendingFeilet: true,
                henter: false,
                hentingFeilet: false,
            });
        });

        it('håndterer SYKEPENGESOKNAD_SENDT', () => {
            const initialState = deepFreeze({
                data: [{ id: '1' }, { id: '2' }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });
            const action = actions.sykepengesoknadSendt('1', getSoknad());
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [getParsetSoknad(), {
                    id: '2',
                }],
                sender: false,
                sendingFeilet: false,
                henter: false,
                hentingFeilet: false,
            });
        });

        it('håndterer SYKEPENGESOKNAD_SENDT når den sendte søknaden korrigerer en annen', () => {
            const initialState = deepFreeze({
                data: [getParsetSoknad(), { id: '2' }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });
            const soknad = getSoknad();
            soknad.id = '1';
            soknad.korrigerer = '2';
            const action = actions.sykepengesoknadSendt('1', soknad);
            const nextState = sykepengesoknader(initialState, action);

            const parsetSoknad = getParsetSoknad();
            parsetSoknad.korrigerer = '2';
            expect(nextState).to.deep.equal({
                data: [parsetSoknad, {
                    id: '2',
                    status: 'KORRIGERT',
                }],
                sender: false,
                sendingFeilet: false,
                henter: false,
                hentingFeilet: false,
            });
        });

        it('håndterer SYKEPENGESOKNAD_SENDT_TIL_NAV', () => {
            const initialState = deepFreeze({
                data: [{ id: '1' }, { id: '2' }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });
            const action = actions.sykepengesoknadSendtTilNAV('1', getSoknad());
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [getParsetSoknad(), {
                    id: '2',
                }],
                sender: false,
                sendingFeilet: false,
                henter: false,
                hentingFeilet: false,
            });
        });

        it('håndterer SYKEPENGESOKNAD_SENDT_TIL_ARBEIDSGIVER', () => {
            const initialState = deepFreeze({
                data: [{ id: '1' }, { id: '2' }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });
            const action = actions.sykepengesoknadSendtTilArbeidsgiver('1', getSoknad());
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [getParsetSoknad(), {
                    id: '2',
                }],
                sender: false,
                sendingFeilet: false,
                henter: false,
                hentingFeilet: false,
            });
        });

        it('håndterer SEND_SYKEPENGESOKNAD_HAR_IKKE_FEILET', () => {
            const initialState = deepFreeze({
                data: [{ id: '1' }, { id: '2' }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: true,
            });
            const action = actions.sendSykepengesoknadHarIkkeFeilet();
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [{
                    id: '1',
                }, {
                    id: '2',
                }],
                sender: false,
                sendingFeilet: false,
                henter: false,
                hentingFeilet: false,
            });
        });
    });

    describe('Endring', () => {
        it('Håndterer START_ENDRING_SYKEPENGESOKNAD_FORESPURT', () => {
            const initialState = deepFreeze({
                data: [{ id: '1' }, { id: '2' }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });
            const action = actions.startEndringForespurt('2');
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState.starterEndring).to.equal(true);
            expect(nextState.startEndringFeilet).to.equal(false);
        });

        it('Håndterer ENDRING_SYKEPENGESOKNAD_STARTET hvis søknaden ikke finnes i listen fra før', () => {
            const initialState = deepFreeze({
                data: [{ id: '88' }, { id: '99' }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });
            const action = actions.endringStartet(getSoknad());
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState.starterEndring).to.equal(false);
            expect(nextState.startEndringFeilet).to.equal(false);
            expect(nextState.data.length).to.equal(3);
            expect(nextState.data[2]).to.deep.equal(getParsetSoknad());
        });

        it('Håndterer ENDRING_SYKEPENGESOKNAD_STARTET hvis søknaden finnes i listen fra før', () => {
            const initialState = deepFreeze({
                data: [{ id: '88' }, { id: '99' }, getParsetSoknad()],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });
            const action = actions.endringStartet(getSoknad());
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState.starterEndring).to.equal(false);
            expect(nextState.startEndringFeilet).to.equal(false);
            expect(nextState.data.length).to.equal(3);
        });

        it('Håndterer startEndringFeilet', () => {
            const initialState = deepFreeze({
                data: [{ id: '1' }, { id: '2' }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
                starterEndring: true,
            });
            const action = actions.startEndringFeilet();
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState.starterEndring).to.equal(false);
            expect(nextState.startEndringFeilet).to.equal(true);
        });
    });

    describe('Avbryt søknad', () => {
        let state = deepFreeze({
            data: [{ id: '1', status: 'NY', avbruttDato: null }, { id: '2', status: 'SENDT', avbruttDato: null }],
            henter: false,
            hentingFeilet: false,
            sender: false,
            sendingFeilet: false,
        });

        it('Håndterer avbryterSoknad()', () => {
            const action = actions.avbryterSoknad();
            state = sykepengesoknader(state, action);
            expect(state).to.deep.equal({
                data: [{ id: '1', status: 'NY', avbruttDato: null }, { id: '2', status: 'SENDT', avbruttDato: null }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
                avbryter: true,
            });
        });

        it('Håndterer avbrytSoknadFeilet()', () => {
            state = deepFreeze(state);
            const action = actions.avbrytSoknadFeilet();
            state = sykepengesoknader(state, action);
            expect(state).to.deep.equal({
                data: [{ id: '1', status: 'NY', avbruttDato: null }, { id: '2', status: 'SENDT', avbruttDato: null }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
                avbryter: false,
                avbrytFeilet: true,
            });
        });

        it('Håndterer soknadAvbrutt()', () => {
            state = deepFreeze(state);
            const action = actions.soknadAvbrutt('1');
            state = sykepengesoknader(state, action);
            expect(state).to.deep.equal({
                data: [{ id: '1', status: 'AVBRUTT', avbruttDato: new Date() }, { id: '2', status: 'SENDT', avbruttDato: null }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
                avbryter: false,
                avbrytFeilet: false,
            });
        });

        it('Håndterer soknadAvbrutt() når det er et utkast som er avbrutt', () => {
            const initialState = deepFreeze({
                data: [{ id: '1', status: 'UTKAST_TIL_KORRIGERING', avbruttDato: null }, { id: '2', status: 'SENDT', avbruttDato: null }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });
            const action = actions.soknadAvbrutt('1');
            const nyState = sykepengesoknader(initialState, action);
            expect(nyState).to.deep.equal({
                data: [{ id: '1', status: 'SLETTET_UTKAST', avbruttDato: new Date() }, { id: '2', status: 'SENDT', avbruttDato: null }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
                avbryter: false,
                avbrytFeilet: false,
            });
        });

        it('Håndterer gjenapnerSoknad', () => {
            state = deepFreeze(Object.assign({}, state, {
                data: [{ id: '1', status: 'AVBRUTT', avbruttDato: new Date('2017-06-06') }, { id: '2', status: 'SENDT', avbruttDato: null }],
            }));
            const action = actions.gjenapnerSoknad();
            state = sykepengesoknader(state, action);
            expect(state).to.deep.equal({
                data: [{ id: '1', status: 'AVBRUTT', avbruttDato: new Date('2017-06-06') }, { id: '2', status: 'SENDT', avbruttDato: null }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
                avbryter: false,
                avbrytFeilet: false,
                gjenapner: true,
            });
        });

        it('Håndterer gjenapneSoknadFeilet()', () => {
            state = deepFreeze(Object.assign({}, state, {
                data: [{ id: '1', status: 'AVBRUTT', avbruttDato: new Date('2017-06-06') }, { id: '2', status: 'SENDT', avbruttDato: null }],
            }));
            const action = actions.gjenapneSoknadFeilet();
            state = sykepengesoknader(state, action);
            expect(state).to.deep.equal({
                data: [{ id: '1', status: 'AVBRUTT', avbruttDato: new Date('2017-06-06') }, { id: '2', status: 'SENDT', avbruttDato: null }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
                avbryter: false,
                avbrytFeilet: false,
                gjenapner: false,
                gjenapneFeilet: true,
            });
        });

        it('Håndterer soknadGjenapnet', () => {
            state = deepFreeze(state);
            const action = actions.soknadGjenapnet('1');
            state = sykepengesoknader(state, action);
            expect(state).to.deep.equal({
                data: [{ id: '1', status: 'NY', avbruttDato: null }, { id: '2', status: 'SENDT', avbruttDato: null }],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
                avbryter: false,
                avbrytFeilet: false,
                gjenapner: false,
                gjenapneFeilet: false,
            });
        });
    });

    describe('settErOppdelt', () => {
        it('Setter _erOppdelt til false hvis vi ikke vet om søknaden er oppdelt', () => {
            const soknad = Object.assign({}, getSoknad(), {
                fom: null,
                tom: null,
            });
            const _soknad = settErOppdelt(soknad);
            expect(_soknad._erOppdelt).to.equal(false);
        });

        it('Setter _erOppdelt til false hvis søknaden ikke er oppdelt', () => {
            const soknad = Object.assign({}, getSoknad(), {
                fom: new Date('2017-01-15'),
                tom: new Date('2017-01-30'),
                aktiviteter: [
                    {
                        avvik: null,
                        grad: 100,
                        periode: {
                            fom: new Date('2017-01-15'),
                            tom: new Date('2017-01-20'),
                        },
                    },
                    {
                        avvik: null,
                        grad: 100,
                        periode: {
                            fom: new Date('2017-01-21'),
                            tom: new Date('2017-01-30'),
                        },
                    },
                ],
            });
            const _soknad = settErOppdelt(soknad);
            expect(_soknad._erOppdelt).to.equal(false);
        });

        it('Setter _erOppdelt til true hvis søknaden er oppdelt', () => {
            const soknad = Object.assign({}, getSoknad(), {
                fom: new Date('2017-01-15'),
                tom: new Date('2017-01-25'),
                aktiviteter: [
                    {
                        avvik: null,
                        grad: 100,
                        periode: {
                            fom: new Date('2017-01-15'),
                            tom: new Date('2017-01-20'),
                        },
                    },
                    {
                        avvik: null,
                        grad: 100,
                        periode: {
                            fom: new Date('2017-01-21'),
                            tom: new Date('2017-01-30'),
                        },
                    },
                ],
            });
            const _soknad = settErOppdelt(soknad);
            expect(_soknad._erOppdelt).to.equal(true);
        });

        it('Setter _erOppdelt hvis vi har skikkelig mange perioder', () => {
            const soknad = parseSykepengesoknad({
                id: '35134708-930e-43dc-a850-38ed33adc1d9',
                status: 'NY',
                opprettetDato: '2017-08-04',
                arbeidsgiver: {
                    navn: 'ARBEIDS- OG VELFERDSDIREKTORATET, AVD SANNERGATA',
                    orgnummer: '123456789',
                    naermesteLeder: null,
                },
                identdato: '2017-07-26',
                ansvarBekreftet: false,
                bekreftetKorrektInformasjon: false,
                arbeidsgiverForskutterer: null,
                egenmeldingsperioder: [],
                gjenopptattArbeidFulltUtDato: null,
                ferie: [],
                permisjon: [],
                utenlandsopphold: null,
                aktiviteter: [
                    {
                        periode: {
                            fom: '2017-06-20',
                            tom: '2017-06-28',
                        },
                        grad: 100,
                        avvik: null,
                    },
                    {
                        periode: {
                            fom: '2017-06-29',
                            tom: '2017-07-07',
                        },
                        grad: 100,
                        avvik: null,
                    },
                    {
                        periode: {
                            fom: '2017-07-08',
                            tom: '2017-07-16',
                        },
                        grad: 100,
                        avvik: null,
                    },
                    {
                        periode: {
                            fom: '2017-07-17',
                            tom: '2017-07-25',
                        },
                        grad: 100,
                        avvik: null,
                    },
                    {
                        periode: {
                            fom: '2017-07-26',
                            tom: '2017-08-03',
                        },
                        grad: 100,
                        avvik: null,
                    },
                ],
                andreInntektskilder: [],
                utdanning: null,
                sykmeldingSkrevetDato: '2017-07-26',
                sendtTilArbeidsgiverDato: null,
                sendtTilNAVDato: null,
                forrigeSykeforloepTom: null,
                korrigerer: null,
                fom: '2017-07-13',
                tom: '2017-08-03',
            });
            const _soknad = settErOppdelt(soknad);
            expect(_soknad._erOppdelt).to.equal(true);
        });
    });

    describe('sorterAktiviteterEldsteFoerst', () => {
        it('Sorterer aktiviteter', () => {
            const soknad = {
                aktiviteter: [{
                    avvik: null,
                    grad: 100,
                    periode: {
                        fom: new Date('2016-07-25'),
                        tom: new Date('2016-07-28'),
                    },
                }, {
                    avvik: null,
                    grad: 100,
                    periode: {
                        fom: new Date('2016-07-10'),
                        tom: new Date('2016-07-20'),
                    },
                }, {
                    avvik: null,
                    grad: 100,
                    periode: {
                        fom: new Date('2016-07-10'),
                        tom: new Date('2016-07-21'),
                    },
                }],
            };
            expect(sorterAktiviteterEldsteFoerst(soknad).aktiviteter).to.deep.equal([{
                avvik: null,
                grad: 100,
                periode: {
                    fom: new Date('2016-07-10'),
                    tom: new Date('2016-07-20'),
                },
            }, {
                avvik: null,
                grad: 100,
                periode: {
                    fom: new Date('2016-07-10'),
                    tom: new Date('2016-07-21'),
                },
            }, {
                avvik: null,
                grad: 100,
                periode: {
                    fom: new Date('2016-07-25'),
                    tom: new Date('2016-07-28'),
                },
            }]);
        });
    });

    describe('berikelse', () => {
        const initialState = deepFreeze({
            data: [],
            henterBerikelse: false,
            henterBerikelseFeilet: false,
        });

        it('håndterer henter berikelse', () => {
            const action = actions.henterBerikelse();
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [],
                henterBerikelse: true,
                henterBerikelseFeilet: false,
            });
        });

        it('håndterer berikelse hentet når berikelse inneholder forrigeSykeforloepTom og oppfoelgingsdato', () => {
            const state = deepFreeze({
                data: [{
                    id: '1',
                }],
            });

            const action = actions.berikelseHentet({ forrigeSykeforloepTom: '2017-07-31', oppfoelgingsdato: '2017-12-24' }, '1');
            const nextState = sykepengesoknader(state, action);
            expect(nextState).to.deep.equal({
                data: [{ id: '1', forrigeSykeforloepTom: new Date('2017-07-31'), oppfoelgingsdato: new Date('2017-12-24') }],
                henterBerikelse: false,
                henterBerikelseFeilet: false,
            });
        });

        it('håndterer berikelse hentet når berikelse inneholder forrigeSykeforloepTom eller oppfoelgingsdato === null', () => {
            const state = deepFreeze({
                data: [{
                    id: '1',

                }],
            });

            const action = actions.berikelseHentet({ forrigeSykeforloepTom: null, oppfoelgingsdato: null }, '1');
            const nextState = sykepengesoknader(state, action);
            expect(nextState).to.deep.equal({
                data: [{ id: '1', forrigeSykeforloepTom: null, oppfoelgingsdato: null }],
                henterBerikelse: false,
                henterBerikelseFeilet: false,
            });
        });

        it('håndterer hent berikelse feilet', () => {
            const action = actions.hentBerikelseFeilet();
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [],
                henterBerikelse: false,
                henterBerikelseFeilet: true,
            });
        });
    });

    describe('finnSoknad', () => {
        const state = {
            sykepengesoknader: {
                data: [{ id: '1', en: 'en' }, { id: '2', innhold: 'innhold i soknadPt 2' }, { id: '3', tre: 'tre' }],
            },
        };

        it('finner soknadPt', () => {
            const s = finnSoknad(state, '2');
            expect(s.innhold).to.be.equal('innhold i soknadPt 2');
        });

        it('returnerer tomt om søknaden ikke finnes', () => {
            const s = finnSoknad(state, '4');
            expect(s).to.deep.equal({});
        });
    });
});

