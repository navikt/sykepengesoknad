import chai from 'chai';
import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import { Field } from 'redux-form';
import Datovelger, { DatoField, genererValidate, MONTHS, WEEKDAYS_LONG, WEEKDAYS_SHORT } from '../../../../js/components/skjema/datovelger/Datovelger';
import DaypickerComponent from '../../../../js/components/skjema/datovelger/DayPickerDato';
import { formaterEnkeltverdi, genererParseForEnkeltverdi } from '../../../../js/sykepengesoknad/felleskomponenter/sporsmal/fieldUtils';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Datovelger', () => {
    let component;
    let input;
    let meta;
    let preventDefault;
    let stopImmediatePropagation;
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(1484524800000); // 16. januar 2017
    });

    afterEach(() => {
        clock.restore();
    });

    describe('Datovelger', () => {
        beforeEach(() => {
            component = shallow(<Datovelger name="halla" prop="minprop" />);
        });

        it('Skal inneholde et Field', () => {
            expect(component.find(Field)).to.have.length(1);
        });

        it('Skal sende en validerFoerDuBegynner-funksjon videre til Field', () => {
            expect(typeof component.find(Field).prop('validate')).to.equal('function');
        });

        it('Skal sende props videre til Field', () => {
            expect(component.find(Field).prop('name')).to.equal('halla');
            expect(component.find(Field).prop('prop')).to.equal('minprop');
        });
    });

    describe('DatoField', () => {
        beforeEach(() => {
            input = {
                value: '',
            };
            meta = {
                touched: false,
                error: '',
            };
            component = shallow(<DatoField input={input} meta={meta} id="olsen" />);
            preventDefault = sinon.spy();
            stopImmediatePropagation = sinon.spy();
        });


        it('Skal sette erApen til false', () => {
            expect(component.state()).to.deep.equal({
                erApen: false,
            });
        });

        it('Skal inneholde et MaskedInput-felt med riktig ID', () => {
            expect(component.find('MaskedInput#olsen[type="tel"]')).to.have.length(1);
        });

        describe('Når man klikker på toggle', () => {
            let dp;

            beforeEach(() => {
                component.find('.js-toggle').simulate('click', {
                    preventDefault,
                });
                dp = component.find(DaypickerComponent);
            });

            it('Skal sette erApen til true', () => {
                expect(component.state()).to.deep.equal({
                    erApen: true,
                });
            });

            it('Skal sende med dager, måneder og år på norsk', () => {
                expect(dp.prop('weekdaysShort')).to.equal(WEEKDAYS_SHORT);
                expect(dp.prop('weekdaysLong')).to.equal(WEEKDAYS_LONG);
                expect(dp.prop('months')).to.equal(MONTHS);
            });
        });

        describe('Når man klikker på toggle to ganger', () => {
            beforeEach(() => {
                component = mount(<DatoField input={input} meta={meta} id="olsen" />);
                component.find('.js-toggle').simulate('click', {
                    preventDefault,
                    stopImmediatePropagation,
                });
                component.find('.js-toggle').simulate('click', {
                    preventDefault,
                    stopImmediatePropagation,
                });
            });

            it('Skal sette erApen til false', () => {
                expect(component.state()).to.deep.equal({
                    erApen: false,
                });
            });
        });

        describe('validate', () => {
            let validate;
            let parse;

            beforeEach(() => {
                validate = genererValidate({
                    tidligsteFom: new Date('2018-01-01'),
                    senesteTom: new Date('2018-01-05'),
                });
            });

            it('Skal klage hvis datoformatet er ugyldig', () => {
                const feilmelding = validate('02.__.____');
                expect(feilmelding).to.equal('Datoen må være på formatet dd.mm.åååå');
            });

            it('Skal klage hvis datoen er etter senesteTom', () => {
                const feilmelding = validate('06.01.2018');
                expect(feilmelding).to.equal('Datoen må være innenfor perioden 1. – 5. januar 2018');
            });

            it('Skal klage hvis datoen før tidligsteFom', () => {
                const feilmelding = validate('31.12.2017');
                expect(feilmelding).to.equal('Datoen må være innenfor perioden 1. – 5. januar 2018');
            });

            it('Skal ikke klage hvis alt er OK', () => {
                const okmelding = validate('03.01.2018');
                expect(okmelding).to.equal(undefined);
            });

            describe('Når det finnes format', () => {
                beforeEach(() => {
                    parse = genererParseForEnkeltverdi();
                    validate = genererValidate({
                        tidligsteFom: new Date('2018-01-01'),
                        senesteTom: new Date('2018-01-05'),
                        format: formaterEnkeltverdi,
                    });
                });

                it('Skal fortsatt funke', () => {
                    const verdi = parse('03.01.2018');
                    const okmelding = validate(verdi);
                    expect(okmelding).to.equal(undefined);
                });

                it('Skal fortsatt funke', () => {
                    const verdi = parse('06.01.2018');
                    const okmelding = validate(verdi);
                    expect(okmelding).to.equal('Datoen må være innenfor perioden 1. – 5. januar 2018');
                });
            });
        });
    });
});
