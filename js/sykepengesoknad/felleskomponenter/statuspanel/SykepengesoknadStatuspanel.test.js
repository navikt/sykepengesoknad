import chai from 'chai';
import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import { setLedetekster } from '@navikt/digisyfo-npm';
import { getSendtSoknadArbeidstaker } from '../../../../test/mock/mockSendtSoknadArbeidstaker';
import SykepengesoknadStatuspanel from './SykepengesoknadStatuspanel';
import mountWithStore from '../../../../test/mountWithStore';
import soknader from '../../data/soknader/soknader';
import { KORRIGERT } from '../../enums/soknadstatuser';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('SykepengesoknadStatuspanel', () => {
    let state;

    beforeEach(() => {
        setLedetekster({
            'statuspanel.status': 'Status',
            'sykepengesoknad.status-2.SENDT.til-arbeidsgiver': 'Sendt til %ARBEIDSGIVER% (org. nr. %ORGNR%): %SENDTTILARBEIDSGIVERDATO%',
            'sykepengesoknad.status-2.SENDT.til-nav': 'Sendt til NAV: %SENDTTILNAVDATO%',
            'sykepengesoknad.status-2.SENDT.til-arbeidsgiver-og-nav': 'Sendt til NAV og %ARBEIDSGIVER% (org. nr. %ORGNR%): %SENDTTILNAVDATO%',
            'sykepengesoknad.status-2.KORRIGERT': 'Korrigert',
            'sykepengesoknad.sykepengeinfo.tittel': 'Utbetaling av sykepenger',
            'sykepengesoknad.sykepengeinfo.til-arbeidsgiver': 'Du får sykepengene utbetalt fra arbeidsgiveren din.',
            'sykepengesoknad.sykepengeinfo.til-nav': 'Sykepenger utbetales etter at NAV har innvilget søknaden. ' +
                '<a href="link" target="_blank">Les om sykepenger og saksbehandlingstider.</a>',
            'sykepengesoknad.sykepengeinfo.til-arbeidsgiver-og-nav': '<a href="link" target="_blank">Les om sykepenger og saksbehandlingstider.</a>',
        });
        state = {
            soknader: soknader(),
        };
    });

    it('Skal vise status når søknad er bare sendt til arbeidsgiver', () => {
        const soknad = getSendtSoknadArbeidstaker({
            sendtTilNAVDato: null,
            innsendtDato: null,
            sendtTilArbeidsgiverDato: new Date('2019-01-16'),
            arbeidsgiver: {
                navn: 'Testbedrift',
                orgnummer: '123456789',
            },
        });
        const component = mountWithStore(<SykepengesoknadStatuspanel soknad={soknad} />, state);
        expect(component.text()).to.contain('Sendt til Testbedrift (org. nr. 123 456 789): 16. januar 2019');
        expect(component.text()).to.contain('Du får sykepengene utbetalt fra arbeidsgiveren din.');
    });

    it('Skal vise status når søknad er bare sendt til NAV', () => {
        const soknad = getSendtSoknadArbeidstaker({
            innsendtDato: new Date('2019-01-16'),
            sendtTilArbeidsgiverDato: null,
            sendtTilNAVDato: new Date('2019-01-16'),
            arbeidsgiver: {
                navn: 'Testbedrift',
                orgnummer: '123456789',
            },
        });
        const component = mountWithStore(<SykepengesoknadStatuspanel soknad={soknad} />, state);
        expect(component.text()).to.contain('Sendt til NAV: 16. januar 2019');
        expect(component.text()).to.contain('Sykepenger utbetales etter at NAV har innvilget søknaden.');
    });

    it('Skal vise status når søknad er sendt til både NAV og arbeidsgiver', () => {
        const soknad = getSendtSoknadArbeidstaker({
            sendtTilNAVDato: new Date('2019-01-16'),
            sendtTilArbeidsgiverDato: new Date('2019-01-16'),
            arbeidsgiver: {
                navn: 'Testbedrift',
                orgnummer: '123456789',
            },
        });
        const component = mountWithStore(<SykepengesoknadStatuspanel soknad={soknad} />, state);
        expect(component.text()).to.contain('Sendt til NAV og Testbedrift (org. nr. 123 456 789): 16. januar 2019');
        expect(component.text()).to.contain('Les om sykepenger og saksbehandlingstider');
    });

    it('Skal vise status når søknad er korrigert', () => {
        const soknad = getSendtSoknadArbeidstaker({
            innsendtDato: new Date('2019-01-16'),
            sendtTilArbeidsgiverDato: null,
            sendtTilNAVDato: new Date('2019-01-16'),
            arbeidsgiver: {
                navn: 'Testbedrift',
                orgnummer: '123456789',
            },
            status: KORRIGERT,
        });
        const component = mountWithStore(<SykepengesoknadStatuspanel soknad={soknad} />, state);
        expect(component.text()).to.contain('Status');
        expect(component.text()).to.contain('Korrigert');
    });
});
