import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai from 'chai';
import configureMockStore from 'redux-mock-store';
import createSagaMiddleware from 'redux-saga';
import { mount } from 'enzyme/build/index';
import { Provider } from 'react-redux';
import { Link } from 'react-router';
import { setLedetekster } from '@navikt/digisyfo-npm';
import { KORRIGERT } from '../../enums/soknadstatuser';
import getSykmelding from '../../../../test/mock/mockSykmeldinger';
import RelaterteSoknaderContainer from './RelaterteSoknaderContainer';
import mockLedetekster from '../../../../test/mock/mockLedetekster';
import { SELVSTENDIGE_OG_FRILANSERE } from '../../enums/soknadtyper';
import { getSendtSoknadSelvstendig } from '../../../../test/mock/mockSoknadSelvstendig';


chai.use(chaiEnzyme());
const expect = chai.expect;

const tilhorendeSykmelding = getSykmelding({ id: 'sykmelding1', valgtArbeidssituasjon: SELVSTENDIGE_OG_FRILANSERE });

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const mockStore = configureMockStore(middlewares);

let state;

beforeEach(() => {
    setLedetekster(mockLedetekster);
    state = {
        dineSykmeldinger: {
            data: [tilhorendeSykmelding],
        },
        soknader: {
            data: [getSendtSoknadSelvstendig({ id: 'soknad1', sykmeldingId: 'sykmelding1' })],
        },
        unleashToggles: {
            data: [],
            hentingFeilet: false,
        },
    };
});

describe('RelaterteSoknaderContainerTest', () => {
    it('Er null om det ikke finnes relaterte søknader', () => {
        const sendtSoknad = getSendtSoknadSelvstendig({ id: 'soknad1', sykmeldingId: 'sykmelding1' });
        const component = mount(<Provider store={mockStore(state)}>
            <RelaterteSoknaderContainer soknad={sendtSoknad} />
        </Provider>);
        expect(component.find('.tidligereVersjoner')).to.be.length(0);
    });

    it('Viser relaterte søknader sortert om de finnes', () => {
        const sendtSoknad = getSendtSoknadSelvstendig({
            id: 'soknad1',
            sykmeldingId: 'sykmelding1',
            status: KORRIGERT,
            korrigertAv: 'soknad2',
            innsendtDato: new Date('2018-10-13'),
        });
        const korrigering1 = getSendtSoknadSelvstendig({
            id: 'soknad2',
            sykmeldingId: 'sykmelding1',
            status: KORRIGERT,
            korrigertAv: 'soknad3',
            korrigerer: 'soknad1',
            innsendtDato: new Date('2018-10-14'),
        });
        const korrigering2 = getSendtSoknadSelvstendig({
            id: 'soknad3',
            sykmeldingId: 'sykmelding1',
            status: KORRIGERT,
            korrigertAv: 'soknad4',
            korrigerer: 'soknad2',
            innsendtDato: new Date('2018-10-14'),
        });
        const korrigering3 = getSendtSoknadSelvstendig({
            id: 'soknad4',
            sykmeldingId: 'sykmelding1',
            status: 'SENDT',
            korrigerer: 'soknad3',
            innsendtDato: new Date('2018-10-20'),
        });

        state.soknader.data = [sendtSoknad, korrigering2, korrigering1, korrigering3];

        const component = mount(<Provider store={mockStore(state)}>
            <RelaterteSoknaderContainer soknad={korrigering3} />
        </Provider>);
        const links = component.find(Link);
        expect(links).to.be.length(3);
        expect(links.at(0)).to.contain.text('Sendt 14. oktober 2018');
        expect(links.at(1)).to.contain.text('Sendt 14. oktober 2018');
        expect(links.at(2)).to.contain.text('Sendt 13. oktober 2018');
    });
});
