import chai from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { getSoknad } from '../../../test/mock/mockSykepengesoknader';
import FremtidigSoknadTeaser from './FremtidigSoknadTeaser';
import { getNySoknadSelvstendig as getModerneSoknad } from '../../../test/mock/mockSoknadSelvstendig';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('SoknadTeasere', () => {
    it('Viser arbeidsgivernavn om søknaden skal til arbeidsgiver', () => {
        const soknad = getSoknad({
            arbeidsgiver: {
                navn: 'Arbeidsgiver AS',
            },
        });
        const component = mount(<FremtidigSoknadTeaser soknad={soknad} />);
        expect(component.find('.inngangspanel__undertekst')).to.have.length(1);
        expect(component.find('.inngangspanel__undertekst').text()).to.contain('Arbeidsgiver AS');
    });

    it('Viser ikke arbeidsgivernavn om søknaden er for selvstendig/frilans', () => {
        const soknad = getModerneSoknad();
        const component = mount(<FremtidigSoknadTeaser soknad={soknad} />);
        expect(component.find('.inngangspanel__undertekst')).to.have.length(0);
    });
});
