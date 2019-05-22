import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import { Field } from 'redux-form';
import { setLedetekster, SoknadOppsummering, VaerKlarOverAt } from '@navikt/digisyfo-npm';
import { OppsummeringForm } from './OppsummeringSkjema';
import ForskuttererArbeidsgiver from './ForskuttererArbeidsgiver';
import { getSoknad } from '../../../test/mock/mockSykepengesoknader';

import CheckboxSelvstendig from '../../components/skjema/CheckboxSelvstendig';
import AvbrytSoknadContainer from '../avbryt-soknad/AvbrytSoknadContainer';
import Feilstripe from '../../components/Feilstripe';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Oppsummering', () => {
    describe('OppsummeringSide', () => {
        let component;
        let skjemasoknad;
        let sykepengesoknad;
        let handleSubmit;
        let oppsummeringsoknad;
        let backendsoknad;
        let props;

        beforeEach(() => {
            skjemasoknad = getSoknad({
                utdanning: {},
            });
            sykepengesoknad = getSoknad({
                id: 'olsen',
            });
            oppsummeringsoknad = {
                ansvarserklaring: {},
            };
            setLedetekster({ tekst: 'test' });
            handleSubmit = sinon.spy();
            backendsoknad = { backendsoknad: 'backendsoknad' };

            props = {
                backendsoknad,
                handleSubmit,
                skjemasoknad,
                oppsummeringsoknad,
                sykepengesoknad,
            };

            component = shallow(<OppsummeringForm {...props} />);
        });

        it('Skal inneholde et Field med riktig name', () => {
            expect(component.find(Field)).to.have.length(1);
            expect(component.find(Field).prop('component')).to.deep.equal(CheckboxSelvstendig);
            expect(component.find(Field).prop('name')).to.equal('bekreftetKorrektInformasjon');
        });

        it('Skal inneholde en SoknadOppsummering med riktige props', () => {
            expect(component.contains(<SoknadOppsummering oppsummeringsoknad={oppsummeringsoknad} />)).to.equal(true);
            expect(component.contains(<VaerKlarOverAt oppsummeringsoknad={oppsummeringsoknad} />)).to.equal(true);
        });

        it('Skal ikke vise en Feilstripe hvis sendingFeilet', () => {
            const component2 = shallow(<OppsummeringForm
                handleSubmit={handleSubmit}
                oppsummeringsoknad={oppsummeringsoknad}
                skjemasoknad={skjemasoknad}
                sykepengesoknad={sykepengesoknad}
                sendingFeilet />);
            expect(component2.find(Feilstripe)).to.have.length(1);
            expect(component2.find(Feilstripe).prop('vis')).to.equal(true);
        });

        it('Skal ikke vise en Feilstripe hvis sending ikke feilet', () => {
            expect(component.find(Feilstripe)).to.have.length(1);
            expect(component.find(Feilstripe).prop('vis')).to.equal(undefined);
        });

        it('Inneholder mottakertekst om vi ikke spør om forskuttering', () => {
            const component2 = shallow(<OppsummeringForm
                handleSubmit={handleSubmit}
                skjemasoknad={skjemasoknad}
                oppsummeringsoknad={oppsummeringsoknad}
                sykepengesoknad={sykepengesoknad}
                visForskutteringssporsmal={false} />);
            expect(component2.find('.js-mottaker')).to.have.length(1);
            expect(component2.find(ForskuttererArbeidsgiver)).to.have.length(0);
        });

        it('Inneholder forskuttering og ikke mottaker', () => {
            const component2 = shallow(<OppsummeringForm
                handleSubmit={handleSubmit}
                skjemasoknad={skjemasoknad}
                oppsummeringsoknad={oppsummeringsoknad}
                sykepengesoknad={sykepengesoknad}
                visForskutteringssporsmal />);
            expect(component2.find('.js-mottaker')).to.have.length(0);
            expect(component2.find(ForskuttererArbeidsgiver)).to.have.length(1);
        });

        it('Inneholder AvbrytSoknadContainer', () => {
            expect(component.contains(<AvbrytSoknadContainer sykepengesoknad={sykepengesoknad} />)).to.equal(true);
        });
    });
});
