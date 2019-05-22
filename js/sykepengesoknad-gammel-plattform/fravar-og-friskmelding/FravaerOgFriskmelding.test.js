import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import { FravaerOgFriskmeldingSkjema } from './FravaerOgFriskmelding';
import AvbrytSoknadContainer from '../avbryt-soknad/AvbrytSoknadContainer';
import { getSoknad } from '../../../test/mock/mockSykepengesoknader';

chai.use(chaiEnzyme());
const expect = chai.expect;


describe('EttSporsmalPerSide', () => {
    let component;
    let sykepengesoknad;

    beforeEach(() => {
        sykepengesoknad = getSoknad();
        component = shallow(<FravaerOgFriskmeldingSkjema handleSubmit={sinon.spy()} sykepengesoknad={sykepengesoknad} />);
    });

    it('Skal inneholde en AvbrytSoknadContainer', () => {
        expect(component.contains(<AvbrytSoknadContainer sykepengesoknad={sykepengesoknad} />)).to.equal(true);
    });
});
