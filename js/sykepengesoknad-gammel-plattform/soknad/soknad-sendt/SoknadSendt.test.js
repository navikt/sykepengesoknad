import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { SoknadOppsummering, VaerKlarOverAt, BekreftetKorrektInformasjon, setLedetekster } from '@navikt/digisyfo-npm';
import sinon from 'sinon';
import SoknadSendt from './SoknadSendt';
import KorrigertAvContainer from './KorrigertAvContainer';
import Soknadstatuspanel from '../../statuspanel/Soknadstatuspanel';
import { getSoknad } from '../../../../test/mock/mockSykepengesoknader';
import ledetekster from '../../../../test/mock/mockLedetekster';
import SykepengesoknadHeader from '../../../components/soknad-felles/SykepengesoknadHeader';
import SykmeldingUtdragContainer from '../../SykmeldingUtdragContainer';
import Knapperad, { KnapperadComponent } from '../../statuspanel/KnapperadStatuspanel';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('SoknadSendt', () => {
    let component;
    let sykepengesoknad = getSoknad({
        status: 'SENDT',
        sendtTilArbeidsgiverDato: new Date(),
    });

    beforeEach(() => {
        setLedetekster(Object.assign({}, ledetekster, {
            'sykepengesoknad.oppsummering.status.label': 'Status',
            'sykepengesoknad.status.TIL_SENDING': 'Sendes...',
            'sykepengesoknad.status.KORRIGERT': 'Korrigert',
        }));
        component = shallow(<SoknadSendt sykepengesoknad={sykepengesoknad} />);
    });

    it('Skal inneholde en SykepengesoknadBanner', () => {
        expect(component.contains(<SykepengesoknadHeader sykepengesoknad={sykepengesoknad} />)).to.equal(true);
    });

    it('Skal inneholde et SykmeldingUtdragForSelvstendige', () => {
        expect(component.contains(<SykmeldingUtdragContainer sykepengesoknad={sykepengesoknad} />)).to.equal(true);
    });

    it('Skal inneholde en SoknadOppsummering, VaerKlarOverAt og BekreftetKorrektInformasjon', () => {
        const oppsummeringsoknad = {
            test: 'test',
        };
        sykepengesoknad.oppsummering = oppsummeringsoknad;
        component = shallow(<SoknadSendt sykepengesoknad={sykepengesoknad} />);
        expect(component.contains(<SoknadOppsummering oppsummeringsoknad={oppsummeringsoknad} />)).to.equal(true);
        expect(component.contains(<VaerKlarOverAt oppsummeringsoknad={oppsummeringsoknad} />)).to.equal(true);
        expect(component.contains(<BekreftetKorrektInformasjon oppsummeringsoknad={oppsummeringsoknad} />)).to.equal(true);
    });

    it('Skal inneholde Soknadstatuspanel', () => {
        component = shallow(<SoknadSendt sykepengesoknad={sykepengesoknad} />);
        expect(component.find(Soknadstatuspanel)).to.have.length(1);
    });

    it('Skal ikke inneholde en KnapperadStatuspanel hvis søknaden har status KORRIGERT', () => {
        sykepengesoknad.status = 'KORRIGERT';
        component = shallow(<SoknadSendt sykepengesoknad={sykepengesoknad} />);
        expect(component.find(Knapperad)).to.have.length(0);
    });

    it('Skal ikke inneholde en KnapperadStatuspanel hvis søknaden har status TIL_SENDING', () => {
        sykepengesoknad.status = 'TIL_SENDING';
        component = shallow(<SoknadSendt sykepengesoknad={sykepengesoknad} />);
        expect(component.find(Knapperad)).to.have.length(0);
    });

    describe('Når søknaden er korrigert', () => {
        beforeEach(() => {
            sykepengesoknad = getSoknad({
                status: 'KORRIGERT',
            });
            component = shallow(<SoknadSendt sykepengesoknad={sykepengesoknad} />);
        });

        it('Skal inneholde KorrigertAvContainer', () => {
            expect(component.find(KorrigertAvContainer)).to.have.length(1);
        });
    });

    describe('KnapperadComponent', () => {
        let clock;

        beforeEach(() => {
            clock = sinon.useFakeTimers(1484524800000); // 16. januar 2017
        });

        afterEach(() => {
            clock.restore();
        });

        it('1) Skal inneholde en knapp for å endre søknaden hvis det er mindre enn tre måneder siden søknaden ble sendt', () => {
            component = shallow(<KnapperadComponent sykepengesoknad={getSoknad({
                id: '88',
                sendtTilNAVDato: new Date('2017-01-14'),
                sendtTilArbeidsgiverDato: null,
            })} />);
            expect(component.find('.js-endre')).to.have.length(1);
        });

        it('2) Skal ikke inneholde en knapp for å endre søknaden hvis det er mer enn tre måneder siden søknaden ble sendt', () => {
            component = shallow(<KnapperadComponent sykepengesoknad={getSoknad({
                id: '88',
                sendtTilNAVDato: new Date('2016-09-16'),
                sendtTilArbeidsgiverDato: null,
            })} />);
            expect(component.find('.js-endre')).to.have.length(0);
        });

        // eslint-disable-next-line max-len
        it('3) Skal inneholde en knapp for å endre søknaden hvis det er mer enn tre måneder siden søknaden ble sendt til NAV men mindre enn tre måneder siden søknaden ble sendt til arbeidsgiver', () => {
            component = shallow(<KnapperadComponent sykepengesoknad={getSoknad({
                id: '88',
                sendtTilNAVDato: new Date('2016-09-16'),
                sendtTilArbeidsgiverDato: new Date('2016-12-20'),
            })} />);
            expect(component.find('.js-endre')).to.have.length(1);
        });

        it('4) Skal inneholde en knapp for å endre søknaden hvis det er nøyaktig tre måneder siden søknaden ble sendt', () => {
            component = shallow(<KnapperadComponent sykepengesoknad={getSoknad({
                id: '88',
                sendtTilNAVDato: new Date('2016-10-16'),
                sendtTilArbeidsgiverDato: null,
            })} />);
            expect(component.find('.js-endre')).to.have.length(1);
        });

        it('5) Skal ikke inneholde en knapp for å endre søknaden hvis det tre måneder og én dag siden søknaden ble sendt', () => {
            component = shallow(<KnapperadComponent sykepengesoknad={getSoknad({
                id: '88',
                sendtTilNAVDato: new Date('2016-09-15'),
                sendtTilArbeidsgiverDato: null,
            })} />);
            expect(component.find('.js-endre')).to.have.length(0);
        });

        it('Skal starte endring når man klikker på endre', () => {
            const startEndringForespurt = sinon.spy();
            const preventDefault = sinon.spy();
            component = shallow(<KnapperadComponent
                sykepengesoknad={getSoknad({ id: '88', sendtTilNAVDato: new Date('2016-10-16') })}
                startEndringForespurt={startEndringForespurt} />);
            component.find('.js-endre').simulate('click', { preventDefault });
            expect(startEndringForespurt.called).to.equal(true);
            expect(startEndringForespurt.calledWith('88')).to.equal(true);
        });
    });
});
