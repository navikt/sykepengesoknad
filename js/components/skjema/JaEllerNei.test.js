import chai from 'chai';
import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import { Field } from 'redux-form';
import { shallow } from 'enzyme';
import SporsmalMedTillegg from './SporsmalMedTillegg';
import JaEllerNei, { RendreJaEllerNei, parseJaEllerNei, JaEllerNeiRadioknapper, jaEllerNeiAlternativer } from './JaEllerNei';
import Radioknapper from './Radioknapper';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('JaEllerNei', () => {
    let component;

    beforeEach(() => {
        component = shallow(<JaEllerNei sporsmal="Liker du frukt?">
            <p>Hvilken frukt liker du?</p>
        </JaEllerNei>);
    });

    it('Skal inneholde en Field med riktig komponent', () => {
        expect(component.find(Field)).to.have.length(1);
        expect(component.find(Field).prop('component')).to.deep.equal(RendreJaEllerNei);
        expect(component.find(Field).prop('parse')).to.deep.equal(parseJaEllerNei);
    });

    describe('parseJaEllerNei', () => {
        it("Skal returnere true hvis verdi === 'true'", () => {
            const res = parseJaEllerNei('true');
            expect(res).to.equal(true);
        });

        it("Skal returnere false hvis verdi === 'false'", () => {
            const res = parseJaEllerNei('false');
            expect(res).to.equal(false);
        });

        it('Skal returnere undefined hvis verdi === undefined', () => {
            const res = parseJaEllerNei(undefined);
            expect(res).to.equal(undefined);
        });

        it("Skal returnere 'minTilfeldigeVerdi' hvis verdi === 'minTilfeldigeVerdi'", () => {
            const res = parseJaEllerNei('minTilfeldigeVerdi');
            expect(res).to.equal('minTilfeldigeVerdi');
        });
    });

    describe('RendreJaEllerNei', () => {
        let props;

        beforeEach(() => {
            props = {
                sporsmal: 'Liker du frukt?',
                input: {},
            };
            component = shallow(<RendreJaEllerNei {...props} />);
        });

        it('Skal inneholde JaEllerNeiRadioknapper', () => {
            expect(component.find(SporsmalMedTillegg).prop('Sporsmal')).to.deep.equal(<JaEllerNeiRadioknapper {...props} />);
        });

        describe('visTillegg', () => {
            it('Skal returnere true hvis verdi === true', () => {
                props.input.value = true;
                props.children = '...';
                component = shallow(<RendreJaEllerNei {...props} />);
                expect(component.prop('visTillegg')(props)).to.equal(true);
            });

            it('Skal returnere false hvis verdi === true og det ikke finnes children', () => {
                props.input.value = true;
                component = shallow(<RendreJaEllerNei {...props} />);
                expect(component.prop('visTillegg')(props)).to.equal(false);
            });

            it('Skal returnere false hvis verdi === false', () => {
                props.input.value = false;
                component = shallow(<RendreJaEllerNei {...props}><p>Test</p></RendreJaEllerNei>);
                expect(component.prop('visTillegg')(props)).to.equal(false);
            });
        });
    });

    describe('jaEllerNeiAlternativer', () => {
        it('Skal se slik ut:', () => {
            expect(jaEllerNeiAlternativer).to.deep.equal([{
                value: true,
                label: 'Ja',
            }, {
                value: false,
                label: 'Nei',
            }]);
        });
    });

    describe('JaEllerNeiRadioknapper', () => {
        let props;

        beforeEach(() => {
            props = {
                input: {
                    name: 'Olsen',
                },
                sporsmal: 'Liker du frukt?',
            };
            component = shallow(<JaEllerNeiRadioknapper {...props} />);
        });

        it('Skal inneholde Radioknapper', () => {
            expect(component.find(Radioknapper)).to.have.length(1);
        });

        it('SKal sende props videre til Radioknapper', () => {
            expect(component.find(Radioknapper).prop('sporsmal')).to.equal('Liker du frukt?');
            expect(component.find(Radioknapper).prop('input')).to.deep.equal(props.input);
        });

        it('Skal inneholde to input', () => {
            expect(component.find('input')).to.have.length(2);
            expect(component.find('input').at(0).prop('value')).to.equal(true);
            expect(component.find('input').at(0).prop('label')).to.equal('Ja');

            expect(component.find('input').at(1).prop('value')).to.equal(false);
            expect(component.find('input').at(1).prop('label')).to.equal('Nei');
        });
    });
});
