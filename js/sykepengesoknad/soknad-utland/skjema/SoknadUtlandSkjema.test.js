import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import { Fareknapp, Hovedknapp } from 'nav-frontend-knapper';

import { getSoknadUtland } from '../../../../test/mock/mockSoknadUtland';
import { SoknadUtlandSkjema } from './SoknadUtlandSkjema';
import Sporsmal from '../../felleskomponenter/sporsmal/Sporsmal';

chai.use(chaiEnzyme());
const expect = chai.expect;


describe('Test at riktig knapp og antall sporsmal blir rendret', () => {
    const soknad = getSoknadUtland();
    const sender = false;
    let ferie = true;
    const componentMedFerieTrue = shallow(<SoknadUtlandSkjema
        handleSubmit={sinon.spy()}
        soknad={soknad}
        sendSoknad={sinon.spy()}
        sender={sender}
        harFerie={ferie}
    />);
    ferie = false;
    const componentMedFerieFalse = shallow(<SoknadUtlandSkjema
        handleSubmit={sinon.spy()}
        soknad={soknad}
        sendSoknad={sinon.spy()}
        sender={sender}
        harFerie={ferie}
    />);


    it('Skal inneholde en fareknapp når ferie er true', () => {
        expect(componentMedFerieTrue.find(Fareknapp)).to.have.length(1);
    });
    it('Skal inneholde en en spørsmålsliste på 3 når ferie er true', () => {
        expect(componentMedFerieTrue.find(Sporsmal)).to.have.length(3);
    });
    it('Skal inneholde en hovedknapp når ferie er false', () => {
        expect(componentMedFerieFalse.find(Hovedknapp)).to.have.length(1);
    });

    it('Skal inneholde en en spørsmålsliste på 4 når ferie er false', () => {
        expect(componentMedFerieFalse.find(Sporsmal)).to.have.length(4);
    });
});
