import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { setLedetekster } from '@navikt/digisyfo-npm';
import Egenmeldingsdager from './Egenmeldingsdager';
import Periodevelger from '../../components/skjema/periodevelger/Periodevelger';
import JaEllerNei from '../../components/skjema/JaEllerNei';
import { getSoknad } from '../../../test/mock/mockSykepengesoknader';
import ledetekster from '../../../test/mock/mockLedetekster';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Egenmeldingsdager', () => {
    beforeEach(() => {
        setLedetekster(ledetekster);
    });

    it('Skal inneholde en JaEllerNei med riktig name', () => {
        const compo = shallow(<Egenmeldingsdager sykepengesoknad={getSoknad()} />);
        expect(compo.find(JaEllerNei)).to.have.length(1);
        expect(compo.find(JaEllerNei).prop('name')).to.equal('bruktEgenmeldingsdagerFoerLegemeldtFravaer');
    });

    it('Skal inneholde en JaEllerNei som inneholder en periodevelger med name = egenmeldingsperioder', () => {
        const compo = shallow(<Egenmeldingsdager sykepengesoknad={getSoknad({
            identdato: new Date('2017-02-01'),
        })} />);

        expect(compo.find(Periodevelger)).to.have.length(1);
        expect(compo.find(Periodevelger).prop('name')).to.equal('egenmeldingsperioder');
    });

    it('Skal sette tidligsteFom til dagen før identdato minus seks måneder og senesteTom til dagen før identdato på periodevelgeren', () => {
        const senesteTom = new Date('2017-01-31');
        const tidligsteFom = new Date(senesteTom);
        tidligsteFom.setMonth(tidligsteFom.getMonth() - 6);

        const compo = shallow(<Egenmeldingsdager sykepengesoknad={getSoknad({
            identdato: new Date('2017-02-01'),
        })} />);

        expect(compo.find(Periodevelger).prop('senesteTom')).to.deep.equal(senesteTom);
        expect(compo.find(Periodevelger).prop('tidligsteFom')).to.deep.equal(tidligsteFom);
    });

    it('Skal vise riktig spørsmål', () => {
        const compo = shallow(<Egenmeldingsdager sykepengesoknad={getSoknad({
            aktiviteter: [{
                periode: {
                    fom: '2017-01-01',
                    tom: '2017-01-15',
                },
                grad: 100,
                avvik: null,
            },
            {
                periode: {
                    fom: '2017-01-16',
                    tom: '2017-01-20',
                },
                grad: 50,
                avvik: null,
            }],
        })} />);
        expect(compo.find(JaEllerNei).prop('spoersmal'))
            .to.equal('Vi har registrert at du ble sykmeldt fredag 15. juli 2016. Brukte du egenmeldinger og/eller var du sykmeldt i perioden 29. juni – 14. juli 2016?');
    });
});
