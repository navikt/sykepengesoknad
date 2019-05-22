import chai from 'chai';
import React from 'react';
import { mount, shallow } from 'enzyme';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import chaiEnzyme from 'chai-enzyme';
import Radioknapper, { Radioknapp } from '../../../js/components/skjema/Radioknapper';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Radioknapper', () => {
    it('Viser hjelpetekst om satt', () => {
        const hjelpetekst = <Hjelpetekst id={'1'} tekst={'tekst'} tittel={'tittel'} />;
        const comp = shallow(<Radioknapper hjelpetekst={hjelpetekst} meta={{}} input={{}} spoersmal="spoersmaal" />);
        expect(comp.find(Hjelpetekst)).to.have.length(1);
    });

    it('Viser ikke hjelpetekst om ikke satt', () => {
        const comp = shallow(<Radioknapper meta={{}} input={{}} spoersmal="spoersmaal" />);
        expect(comp.find(Hjelpetekst)).to.have.length(0);
    });

    describe('Radioknapp', () => {
        let input;

        beforeEach(() => {
            input = {
                value: true,
            };
        });

        it('Skal vise barn når visUndertekst er satt', () => {
            const compo = mount(<Radioknapp input={input} value={false} id="radio" visUndertekst><p>Test</p></Radioknapp>);
            expect(compo.text().trim()).to.equal('Test');
        });

        it('Skal vise barn når disabled er satt', () => {
            const compo = mount(<Radioknapp input={input} value={false} id="radio" disabled><p>Test</p></Radioknapp>);
            expect(compo.text().trim()).to.equal('Test');
        });

        it('Skal vise barn når disabled og visUndertekst er satt', () => {
            const compo = mount(<Radioknapp input={input} value={false} id="radio" disabled visUndertekst><p>Test</p></Radioknapp>);
            expect(compo.text().trim()).to.equal('Test');
        });

        it('Skal vise barn når radioknapp er valgt', () => {
            const compo = mount(<Radioknapp input={input} value id="radio"><p>Test</p></Radioknapp>);
            expect(compo.text().trim()).to.equal('Test');
        });

        it('Skal ikke vise barn når radioknapp ikke er valgt', () => {
            const compo = mount(<Radioknapp input={input} value={false} id="radio"><p>Test</p></Radioknapp>);
            expect(compo.text().trim()).to.equal('');
        });
    });
});

