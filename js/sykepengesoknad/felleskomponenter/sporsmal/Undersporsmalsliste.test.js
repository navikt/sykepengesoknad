import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import Undersporsmal from './Undersporsmal';
import Undersporsmalsliste from './Undersporsmalsliste';
import { getNySoknadSelvstendig } from '../../../../test/mock/mockSoknadSelvstendig';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Undersporsmalsiste', () => {
    it('Skal rendre Underspørsmål hvis underspørsmålet har svar', () => {
        const soknad = getNySoknadSelvstendig();
        const sporsmal = soknad.sporsmal[1];
        const component = shallow(<Undersporsmalsliste undersporsmal={sporsmal.undersporsmal} />);
        expect(component.find(Undersporsmal)).to.have.length(1);
    });
});
