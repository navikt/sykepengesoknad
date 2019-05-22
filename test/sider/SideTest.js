import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { TimeoutBox } from '@navikt/digisyfo-npm';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import Feilmelding from '../../js/components/Feilmelding';
import { SideComponent, Utlogget } from '../../js/sider/Side';
import Brodsmuler from '../../js/components/Brodsmuler';

const DocumentTitle = require('react-document-title');

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('SideComponent', () => {
    let component;
    const brodsmuler = [{
        tittel: 'Dine sykmeldinger',
        sti: '/sykmeldinger',
        erKlikkbar: true,
    }, {
        tittel: 'Sykmelding',
    }];
    let props;
    let sjekkInnlogging;

    beforeEach(() => {
        sjekkInnlogging = sinon.spy();
        props = {
            erInnlogget: true,
            sjekkInnlogging,
            brodsmuler,
            tittel: 'Min side',
        };
        component = shallow(<SideComponent {...props}>
            <article>Mitt innhold</article>
        </SideComponent>);
    });

    it('Skal rendre brødsmuler', () => {
        expect(component.contains(<Brodsmuler brodsmuler={brodsmuler} />)).to.equal(true);
    });

    it('Skal rendre TimeoutBox', () => {
        expect(component.contains(<TimeoutBox />)).to.equal(true);
    });

    it('Skal rendre DocumentTitle', () => {
        expect(component.find(DocumentTitle)).to.have.length(1);
    });

    it('Skal rendre innhold som sendes inn', () => {
        expect(component.contains(<article>Mitt innhold</article>)).to.equal(true);
        expect(component.find(Feilmelding)).to.have.length(0);
    });

    it('Skal rendre feilmelding hvis bruker er utlogget', () => {
        props.erInnlogget = false;
        const c = shallow(<SideComponent {...props}>
            <article>Mitt innhold</article>
        </SideComponent>);
        expect(c.find(Utlogget)).to.have.length(1);
    });
});
