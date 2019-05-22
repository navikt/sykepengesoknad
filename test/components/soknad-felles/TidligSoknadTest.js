import chai from 'chai';
import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import TidligSoknad from '../../../js/components/soknad-felles/TidligSoknad';
import { getNySoknadSelvstendig } from '../../mock/mockSoknadSelvstendig';
import IllustrertInnhold from '../../../js/components/IllustrertInnhold';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Tidlig søknad', () => {
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(new Date('2018-11-15'));
    });

    afterEach(() => {
        clock.restore();
    });

    it('Skal vises hvis søknad er NY og TOM er etter i dag', () => {
        const soknad = getNySoknadSelvstendig({
            tom: new Date('2018-11-18'),
        });
        const component = shallow(<TidligSoknad soknad={soknad} />);
        expect(component.find(IllustrertInnhold)).to.be.length(1);
    });

    it('Skal ikke vises hvis søknad er NY og TOM er i dag', () => {
        const soknad = getNySoknadSelvstendig({
            tom: new Date('2018-11-15'),
        });
        const component = shallow(<TidligSoknad soknad={soknad} />);
        expect(component.find(IllustrertInnhold)).to.be.length(0);
    });

    it('Skal ikke vises hvis søknad er NY og TOM er før i dag', () => {
        const soknad = getNySoknadSelvstendig({
            tom: new Date('2018-11-14'),
        });
        const component = shallow(<TidligSoknad soknad={soknad} />);
        expect(component.find(IllustrertInnhold)).to.be.length(0);
    });

    it('Skal ikke vises hvis søknad er SENDT og TOM er etter i dag', () => {
        const soknad = getNySoknadSelvstendig({
            tom: new Date('2018-11-14'),
            status: 'SENDT',
        });
        const component = shallow(<TidligSoknad soknad={soknad} />);
        expect(component.find(IllustrertInnhold)).to.be.length(0);
    });
});
