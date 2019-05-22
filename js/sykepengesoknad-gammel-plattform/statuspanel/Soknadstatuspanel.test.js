import { setLedetekster, sykepengesoknadstatuser as statuser } from '@navikt/digisyfo-npm';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import chai from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { getSoknad } from '../../../test/mock/mockSykepengesoknader';
import Soknadstatuspanel from './Soknadstatuspanel';
import mountWithStore from '../../../test/mountWithStore';
import sykepengesoknader from '../data/sykepengesoknader/sykepengesoknader';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Soknadstatuspanel', () => {
    beforeEach(() => {
        /* eslint-disable max-len */
        setLedetekster({
            'sykepengesoknad.oppsummering.status.label': 'Status',
            'sykepengesoknad.status-2.TIL_SENDING.til-nav': 'Sender til NAV...',
            'sykepengesoknad.status-2.TIL_SENDING.til-arbeidsgiver': 'Sender til %ARBEIDSGIVER% (org. nr. %ORGNR%)...',
            'sykepengesoknad.status-2.TIL_SENDING.til-arbeidsgiver-og-nav': 'Sender til NAV og %ARBEIDSGIVER% (org. nr. %ORGNR%)...',
            'sykepengesoknad.status-2.SENDT.til-arbeidsgiver': 'Sendt til %ARBEIDSGIVER% (org. nr. %ORGNR%): %SENDTTILARBEIDSGIVERDATO%',
            'sykepengesoknad.status-2.SENDT.til-nav': 'Sendt til NAV: %SENDTTILNAVDATO%',
            'sykepengesoknad.status-2.SENDT.til-arbeidsgiver-og-nav': 'Sendt til NAV og %ARBEIDSGIVER% (org. nr. %ORGNR%): %SENDTTILNAVDATO%',
            'sykepengesoknad.sykepengeinfo.til-nav': 'Sykepenger utbetales etter at NAV har innvilget søknaden. <a href="test" target="_blank">Les om sykepenger og saksbehandlingstider.</a>',
            'sykepengesoknad.sykepengeinfo.til-arbeidsgiver': 'Du får sykepengene utbetalt fra din arbeidsgiver. Hvis du er usikker på når pengene kommer, kontakt arbeidsgiveren din.',
            'sykepengesoknad.sykepengeinfo.til-arbeidsgiver-og-nav': '<a href="test" target="_blank">Les om sykepenger og saksbehandlingstider.</a>',
            'sykepengesoknad.status-2.tittel': 'Status',
            'sykepengesoknad.sykepengeinfo.tittel': 'Utbetaling av sykepenger',
        });
        /* eslint-enable max-len */
    });

    describe('Når søknaden sendes til NAV', () => {
        let component;
        let sykepengesoknad;

        beforeEach(() => {
            sykepengesoknad = getSoknad({
                status: statuser.TIL_SENDING,
                sendtTilNAVDato: new Date('1945-05-08'),
            });
            component = mount(<Soknadstatuspanel sykepengesoknad={sykepengesoknad} />);
        });

        it('Skal vise Sender...', () => {
            expect(component.text()).to.contain('Sender til NAV...');
        });

        it('Skal inneholde Hjelpetekst', () => {
            expect(component.find(Hjelpetekst)).to.have.length(1);
        });

        it('Skal vise info om sykepenger', () => {
            expect(component.html())
                .to.contain('Sykepenger utbetales etter at NAV har innvilget søknaden. <a href="test" target="_blank">Les om sykepenger og saksbehandlingstider.</a>');
        });
    });

    describe('Når søknaden sendes til arbeidsgiver', () => {
        let component;
        let sykepengesoknad;

        beforeEach(() => {
            sykepengesoknad = getSoknad({
                status: statuser.TIL_SENDING,
                sendtTilArbeidsgiverDato: new Date('2017-05-17'),
            });
            component = mount(<Soknadstatuspanel sykepengesoknad={sykepengesoknad} />);
        });

        it('Skal vise Sender...', () => {
            expect(component.text()).to.contain('Sender til BYGGMESTER BLOM AS (org. nr. 123 456 789)...');
        });

        it('Skal inneholde Hjelpetekst', () => {
            expect(component.find(Hjelpetekst)).to.have.length(1);
        });

        it('Skal vise info om sykepenger', () => {
            expect(component.html()).to.contain('Du får sykepengene utbetalt fra din arbeidsgiver. Hvis du er usikker på når pengene kommer, kontakt arbeidsgiveren din.');
        });
    });

    describe('Når søknaden sendes til arbeidsgiver og NAV', () => {
        let component;
        let sykepengesoknad;

        beforeEach(() => {
            sykepengesoknad = getSoknad({
                status: statuser.TIL_SENDING,
                sendtTilArbeidsgiverDato: new Date('2017-05-17'),
                sendtTilNAVDato: new Date('2017-05-17'),
            });
            component = mount(<Soknadstatuspanel sykepengesoknad={sykepengesoknad} />);
        });

        it('Skal vise Sender...', () => {
            expect(component.text()).to.contain('Sender til NAV og BYGGMESTER BLOM AS (org. nr. 123 456 789)...');
        });

        it('Skal inneholde Hjelpetekst', () => {
            expect(component.find(Hjelpetekst)).to.have.length(1);
        });

        it('Skal vise info om sykepenger', () => {
            expect(component.html()).to.contain('<a href="test" target="_blank">Les om sykepenger og saksbehandlingstider.</a>');
        });
    });

    describe('Når søknaden er sendt til arbeidsgiver', () => {
        let component;
        let sykepengesoknad;

        beforeEach(() => {
            sykepengesoknad = getSoknad({
                status: statuser.SENDT,
                sendtTilArbeidsgiverDato: new Date('2017-05-17'),
            });
            const state = {
                sykepengesoknader: sykepengesoknader(),
            };
            component = mountWithStore(<Soknadstatuspanel sykepengesoknad={sykepengesoknad} />, state);
        });

        it('Skal vise statustekst', () => {
            expect(component.text()).to.contain('Sendt til BYGGMESTER BLOM AS (org. nr. 123 456 789): 17. mai 2017');
        });

        it('Skal ikke inneholde Hjelpetekst', () => {
            expect(component.find(Hjelpetekst)).to.have.length(0);
        });

        it('Skal vise info om sykepenger', () => {
            expect(component.html()).to.contain('Du får sykepengene utbetalt fra din arbeidsgiver. Hvis du er usikker på når pengene kommer, kontakt arbeidsgiveren din.');
        });
    });

    describe('Når søknaden er sendt til NAV og arbeidsgiver samtidig', () => {
        let component;
        let sykepengesoknad;
        let state;

        beforeEach(() => {
            sykepengesoknad = getSoknad({
                status: statuser.SENDT,
                sendtTilArbeidsgiverDato: new Date('2017-05-17'),
                sendtTilNAVDato: new Date('2017-05-17'),
            });
            state = {
                sykepengesoknader: sykepengesoknader(),
            };
            component = mountWithStore(<Soknadstatuspanel sykepengesoknad={sykepengesoknad} />, state);
        });

        it('Skal vise riktig status', () => {
            expect(component.text()).to.contain('Sendt til NAV og BYGGMESTER BLOM AS (org. nr. 123 456 789): 17. mai 2017');
        });

        it('Skal ikke inneholde Hjelpetekst', () => {
            expect(component.find(Hjelpetekst)).to.have.length(0);
        });

        it('Skal vise info om sykepenger', () => {
            expect(component.html()).to.contain('<a href="test" target="_blank">Les om sykepenger og saksbehandlingstider.</a>');
        });
    });

    describe('Når søknaden er sendt til NAV og arbeidsgiver på to ulike tidspunkt', () => {
        let component;
        let sykepengesoknad;
        let state;

        beforeEach(() => {
            sykepengesoknad = getSoknad({
                status: statuser.SENDT,
                sendtTilArbeidsgiverDato: new Date('2017-05-17'),
                sendtTilNAVDato: new Date('2017-05-20'),
            });
            state = {
                sykepengesoknader: sykepengesoknader(),
            };
            component = mountWithStore(<Soknadstatuspanel sykepengesoknad={sykepengesoknad} />, state);
        });

        it('Skal vise riktig status', () => {
            expect(component.text()).to.contain('Status');
            expect(component.text()).to.contain('Sendt til NAV: 20. mai 2017');
            expect(component.text()).to.contain('Sendt til BYGGMESTER BLOM AS (org. nr. 123 456 789): 17. mai 2017');
        });

        it('Skal ikke inneholde Hjelpetekst', () => {
            expect(component.find(Hjelpetekst)).to.have.length(0);
        });

        it('Skal vise info om sykepenger', () => {
            expect(component.html()).to.contain('<a href="test" target="_blank">Les om sykepenger og saksbehandlingstider.</a>');
        });
    });
});
