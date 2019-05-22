import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import { setLedetekster } from '@navikt/digisyfo-npm';
import { getParsetSoknad, getSoknad } from '../../../test/mock/mockSykepengesoknader';
import { NAV, ARBEIDSGIVER_OG_NAV, ARBEIDSGIVER } from '../../sykepengesoknad/enums/soknadmottakertyper';
import {
    mapStateToProps,
    Oppsummering,
    skalViseForskutteringssporsmal,
    utledMottaker,
} from './OppsummeringContainer';
import mapSkjemasoknadToBackendsoknad from '../mappers/mapSkjemasoknadToBackendsoknad';
import mapBackendsoknadToSkjemasoknad from '../mappers/mapBackendsoknadToSkjemasoknad';
import mapSkjemasoknadToOppsummeringsoknad from '../mappers/mapSkjemasoknadToOppsummeringsoknad';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('OppsummeringContainer', () => {
    let props;
    let route;
    let router;
    let setRouteLeaveHook;
    let hentArbeidsgiverperiodeberegning;
    let hentLedere;
    let backendsoknad;
    let sykepengesoknad;
    const navigeringsvarsel = 'Nå er du på vei ut av døra – før du har sendt søknaden. Gå tilbake for å bekrefte og få den av gårde. Hvis det var det du hadde tenkt!';

    beforeEach(() => {
        setLedetekster({
            'sykepengesoknad.navigeringsvarsel': navigeringsvarsel,
        });
        setRouteLeaveHook = sinon.spy();
        route = {};
        router = {
            setRouteLeaveHook,
        };

        hentArbeidsgiverperiodeberegning = sinon.spy();
        hentLedere = sinon.spy();
        backendsoknad = {};
        sykepengesoknad = getSoknad({
            id: '3253d7f2-538d-4058-886d-2b36bef01d90',
            status: 'NY',
        });

        props = {
            router,
            route,
            hentArbeidsgiverperiodeberegning,
            hentLedere,
            backendsoknad,
            sykepengesoknad,
        };
    });

    describe('Utled skal vise forskuttering og mottaker', () => {
        const arbeidsgiverperiodeStartdato = new Date('2017-01-01');
        const soknad = getParsetSoknad();
        const ledere = [];
        const lederSvartJa = [{ orgnummer: '123456789', arbeidsgiverForskuttererLoenn: true }];
        const lederSvartNei = [{ orgnummer: '123456789', arbeidsgiverForskuttererLoenn: false }];
        const lederIkkeSvart = [{ orgnummer: '123456789', arbeidsgiverForskuttererLoenn: null }];

        it('Skal vise forskutteringsspørsmål ledere er null', () => {
            expect(utledMottaker(null, soknad, arbeidsgiverperiodeStartdato)).to.equal(NAV);
            expect(skalViseForskutteringssporsmal(null, soknad, arbeidsgiverperiodeStartdato)).to.equal(true);
        });

        it('Skal sende søknad til arbeidsgiver og ikke vise forskutterinsspørsmål hvis søknaden er innefor arbeidsgiverperioden', () => {
            const _soknad = getParsetSoknad(
                {
                    fom: new Date('2017-01-01'),
                    tom: new Date('2017-01-10'),
                },
            );

            expect(utledMottaker(ledere, _soknad, arbeidsgiverperiodeStartdato)).to.equal(ARBEIDSGIVER);
            expect(skalViseForskutteringssporsmal(ledere, _soknad, arbeidsgiverperiodeStartdato)).to.equal(false);
        });

        it('Skal sende søknaden til nav og arbeidsgiver hvis første dag i søknaden er før eller samme som siste dag i arbeidsgiverperioden', () => {
            const _soknad = getParsetSoknad(
                {
                    fom: new Date('2017-01-01'),
                    tom: new Date('2017-01-30'),
                },
            );

            expect(utledMottaker(lederSvartJa, _soknad, arbeidsgiverperiodeStartdato)).to.equal(ARBEIDSGIVER_OG_NAV);
            expect(skalViseForskutteringssporsmal(lederSvartJa, _soknad, arbeidsgiverperiodeStartdato)).to.equal(false);
        });

        it('Skal ikke vise forskutteringsspørsmål hvis arbeidsgiver har svart på forskuttering', () => {
            const startdato = new Date('2016-01-01');

            expect(utledMottaker(lederSvartJa, soknad, startdato)).to.equal(ARBEIDSGIVER_OG_NAV);
            expect(skalViseForskutteringssporsmal(lederSvartJa, soknad, startdato)).to.equal(false);

            expect(utledMottaker(lederSvartNei, soknad, startdato)).to.equal(NAV);
            expect(skalViseForskutteringssporsmal(lederSvartNei, soknad, startdato)).to.equal(false);
        });

        it('Skal vise forskutteringspørsmål hvis arbeidsgiver ikke har svart på forskuttering', () => {
            const startdato = new Date('2016-01-01');

            expect(utledMottaker(ledere, soknad, startdato)).to.equal(NAV);
            expect(skalViseForskutteringssporsmal(ledere, soknad, startdato)).to.equal(true);
        });

        it('Skal vise forskutteringsspørsmål hvis søknad er etter arbeidsgiverperioden og sende til ag og nav hvis bruker sier ja', () => {
            const _soknad = getParsetSoknad(
                {
                    fom: new Date('2017-02-01'),
                    tom: new Date('2017-02-17'),
                    arbeidsgiverForskutterer: 'JA',
                },
            );

            expect(utledMottaker(lederIkkeSvart, _soknad, arbeidsgiverperiodeStartdato)).to.equal(ARBEIDSGIVER_OG_NAV);
            expect(skalViseForskutteringssporsmal(lederIkkeSvart, _soknad, arbeidsgiverperiodeStartdato)).to.equal(true);
        });

        it('Skal vise forskutteringsspørsmål hvis søknad er etter arbeidsgiverperioden og sende bare til nav hvis bruker sier nei', () => {
            const _soknad = getParsetSoknad(
                {
                    fom: new Date('2017-02-01'),
                    tom: new Date('2017-02-30'),
                    arbeidsgiverForskutterer: 'NEI',
                },
            );

            expect(utledMottaker(lederIkkeSvart, _soknad, arbeidsgiverperiodeStartdato)).to.equal(NAV);
            expect(skalViseForskutteringssporsmal(lederIkkeSvart, _soknad, arbeidsgiverperiodeStartdato)).to.equal(true);
        });

        it('Skal ikke vise forskutteringsspørsmål hvis starten på søknad er innenfor arbeidsgiverperioden og sende til ag og nav', () => {
            const _soknad = getParsetSoknad(
                {
                    fom: new Date('2017-01-15'),
                    tom: new Date('2017-02-17'),
                },
            );

            expect(utledMottaker(lederIkkeSvart, _soknad, arbeidsgiverperiodeStartdato)).to.equal(ARBEIDSGIVER_OG_NAV);
            expect(skalViseForskutteringssporsmal(lederIkkeSvart, _soknad, arbeidsgiverperiodeStartdato)).to.equal(false);
        });
    });

    describe('Oppsummering', () => {
        let state;
        let skjemasoknad;
        let ownProps;
        let oppsummeringsoknad;

        beforeEach(() => {
            sykepengesoknad = getSoknad();
            skjemasoknad = mapBackendsoknadToSkjemasoknad(sykepengesoknad);
            oppsummeringsoknad = mapSkjemasoknadToOppsummeringsoknad(skjemasoknad, sykepengesoknad);
            ownProps = {
                skjemasoknad,
                sykepengesoknad,
            };

            state = {
                arbeidsgiverperiodeberegning: {
                    data: {},
                },
                ledere: {
                    data: [],
                },
            };
        });

        it('Skal returnere oppsummeringsoknad', () => {
            props = mapStateToProps(state, ownProps);
            expect(props.oppsummeringsoknad).to.deep.equal(oppsummeringsoknad);
        });

        it('Skal returnere backendsoknad', () => {
            props = mapStateToProps(state, ownProps);
            expect(props.backendsoknad).to.deep.equal(mapSkjemasoknadToBackendsoknad(skjemasoknad));
        });
    });

    describe('Oppsummering', () => {
        beforeEach(() => {
            shallow(<Oppsummering {...props} />);
        });

        it('Skal hente ledere', () => {
            expect(hentLedere.called).to.equal(true);
        });

        it('Skal hente arbeidsgiverperiodeberegning', () => {
            expect(hentArbeidsgiverperiodeberegning.calledWith(backendsoknad)).to.equal(true);
        });

        it('Skal kalle på setRouteLeaveHook', () => {
            expect(setRouteLeaveHook.called).to.equal(true);
        });

        describe('routerWillLeave', () => {
            let thisArg;

            beforeEach(() => {
                thisArg = {
                    props,
                    _mounted: true,
                };
            });
            it('Skal returnere streng dersom man navigerer til noe annet enn forrige side', () => {
                const nextRoute = {
                    pathname: '/sykepengesoknad/soknader',
                };
                const res = Oppsummering.prototype.routerWillLeave.call(thisArg, nextRoute);
                expect(res).to.equal(navigeringsvarsel);
            });

            it('Skal returnere null dersom man navigerer til forrige side i søknaden', () => {
                const nextRoute = {
                    pathname: '/sykepengesoknad/soknader/3253d7f2-538d-4058-886d-2b36bef01d90/aktiviteter-i-sykmeldingsperioden',
                };
                const res = Oppsummering.prototype.routerWillLeave.call(thisArg, nextRoute);
                expect(res).to.equal(null);
            });

            it('Skal returnere null hvis utils-felleskomponenter-arbeidstaker-arbeidstaker-arbeidstaker-arbeidstaker ikke er NY', () => {
                thisArg.props.sykepengesoknad.status = 'AVBRUTT';
                const nextRoute = {
                    pathname: '/sykepengesoknad/soknader',
                };
                const res = Oppsummering.prototype.routerWillLeave.call(thisArg, nextRoute);
                expect(res).to.equal(null);
            });

            it('Skal returnere streng hvis utils-felleskomponenter-arbeidstaker-arbeidstaker-arbeidstaker-arbeidstaker er UTKAST_TIL_KORRIGERING', () => {
                thisArg.props.sykepengesoknad.status = 'UTKAST_TIL_KORRIGERING';
                const nextRoute = {
                    pathname: '/sykepengesoknad/soknader',
                };
                const res = Oppsummering.prototype.routerWillLeave.call(thisArg, nextRoute);
                expect(res).to.equal(navigeringsvarsel);
            });

            it('Skal returnere null hvis komponent ikke er mounted', () => {
                thisArg._mounted = false;
                const nextRoute = {
                    pathname: '/sykepengesoknad/soknader',
                };
                const res = Oppsummering.prototype.routerWillLeave.call(thisArg, nextRoute);
                expect(res).to.equal(null);
            });
        });
    });
});
