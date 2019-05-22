import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import FoerDuBegynner, { FoerDuBegynnerSkjema } from './FoerDuBegynner';
import AvbrytSoknadContainer from '../avbryt-soknad/AvbrytSoknadContainer';
import { getSoknad } from '../../../test/mock/mockSykepengesoknader';
import DetFinnesEldreSoknader
    from './DetFinnesEldreSoknader';
import ForsteSoknadIntro from './ForsteSoknadIntro';
import SoknadIntro from './SoknadIntro';
import TidligSoknad from '../../components/soknad-felles/TidligSoknad';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('FoerDuBegynner', () => {
    let component;
    let sykepengesoknad;

    beforeEach(() => {
        sykepengesoknad = getSoknad();
        component = shallow(<FoerDuBegynnerSkjema
            utfyllingStartet={sinon.spy()}
            handleSubmit={sinon.spy()}
            sykepengesoknad={sykepengesoknad} />);
    });

    it('Skal inneholde en AvbrytSoknadContainer', () => {
        expect(component.contains(<AvbrytSoknadContainer sykepengesoknad={sykepengesoknad} />)).to.equal(true);
    });
});

describe('TidligSoknad', () => {
    let component;
    let sykepengesoknad;

    beforeEach(() => {
        sykepengesoknad = getSoknad();
    });

    it('Skal inneholde en TidligSoknad', () => {
        sykepengesoknad.status = 'NY';
        sykepengesoknad.tom = new Date(new Date().setDate(new Date().getDate() + 1));
        component = shallow(<FoerDuBegynner utfyllingStartet={sinon.spy()} sykepengesoknad={sykepengesoknad} />);
        expect(component.contains(<TidligSoknad soknad={sykepengesoknad} />)).to.equal(true);
    });
});

describe('ForsteSoknadIntro', () => {
    let component;
    let sykepengesoknad;

    beforeEach(() => {
        sykepengesoknad = getSoknad();
    });

    it('Skal inneholde en ForsteSoknadIntro hvis erForsteSoknad === true', () => {
        component = shallow(<FoerDuBegynner utfyllingStartet={sinon.spy()} sykepengesoknad={sykepengesoknad} erForsteSoknad />);
        expect(component.contains(<ForsteSoknadIntro />)).to.equal(true);
        expect(component.contains(<SoknadIntro />)).to.equal(false);
    });

    it('Skal inneholde en SoknadIntro hvis erForsteSoknad === false', () => {
        component = shallow(<FoerDuBegynner utfyllingStartet={sinon.spy()} sykepengesoknad={sykepengesoknad} erForsteSoknad={false} />);
        expect(component.contains(<ForsteSoknadIntro />)).to.equal(false);
        expect(component.contains(<SoknadIntro />)).to.equal(true);
    });
});

describe('DetFinnesEldreSoknader', () => {
    let component;
    let sykepengesoknad;

    beforeEach(() => {
        sykepengesoknad = getSoknad();
    });

    it('Skal inneholde en DetFinnesEldreSoknader hvis detFinnesEldreSoknader === true', () => {
        component = shallow(<FoerDuBegynner utfyllingStartet={sinon.spy()} sykepengesoknad={sykepengesoknad} detFinnesEldreSoknader />);
        expect(component.contains(<DetFinnesEldreSoknader />)).to.equal(true);
    });

    it('Skal ikke inneholde en DetFinnesEldreSoknader hvis detFinnesEldreSoknader === false', () => {
        component = shallow(<FoerDuBegynner utfyllingStartet={sinon.spy()} sykepengesoknad={sykepengesoknad} detFinnesEldreSoknader={false} />);
        expect(component.contains(<DetFinnesEldreSoknader />)).to.equal(false);
    });
});
