import chai from 'chai';
import deepFreeze from 'deep-freeze';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { Field } from 'redux-form';
import {
    Sporsmal,
    visSoktOmSykepengerUtenlandsoppholdsporsmal,
} from './SoktOmSykepengerIUtenlandsopphold';
import Radioknapper from '../../components/skjema/Radioknapper';
import { parseJaEllerNei } from '../../components/skjema/JaEllerNei';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('SoktOmSykepenger', () => {
    let component;
    let f;

    beforeEach(() => {
        component = shallow(<Sporsmal vis />);
        f = component.find(Field);
    });

    it('Skal inneholde et Field med riktig name og riktig component', () => {
        expect(f.prop('name')).to.equal('utenlandsopphold.soektOmSykepengerIPerioden');
        expect(f.prop('component')).to.deep.equal(Radioknapper);
        expect(f.prop('parse')).to.deep.equal(parseJaEllerNei);
    });

    it('Skal inneholde to alternativer; ett for ja og ett for nei', () => {
        expect(f.find('i')).to.have.length(2);
        const ja = f.find('i').at(0);
        const nei = f.find('i').at(1);
        expect(ja.prop('value')).to.equal(true);
        expect(nei.prop('value')).to.equal(false);
    });

    describe('visSoktOmSykepengerUtenlandsoppholdsporsmal', () => {
        it('Skal funke hvis periodene ikke er komplette', () => {
            const values = {
                harHattFerie: true,
                ferie: [{}],
                harHattUtenlandsopphold: true,
                utenlandsopphold: {
                    perioder: [{
                        fom: '24.03.2018',
                    }],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(false);
        });

        it('Skal returnere true hvis det er utenlandsopphold som går over mer enn en helg', () => {
            const values = {
                harHattFerie: false,
                harHattUtenlandsopphold: true,
                utenlandsopphold: {
                    perioder: [{
                        fom: '24.03.2018',
                        tom: '26.03.2018',
                    }],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(true);
        });

        it('Skal returnere false hvis det er utenlandsopphold som går over bare en helg', () => {
            const values = {
                harHattFerie: false,
                harHattUtenlandsopphold: true,
                utenlandsopphold: {
                    perioder: [{
                        fom: '24.03.2018',
                        tom: '25.03.2018',
                    }],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(false);
        });

        it('Skal returnere false hvis det er utenlandsopphold som går over bare to helger', () => {
            const values = {
                harHattFerie: false,
                harHattUtenlandsopphold: true,
                utenlandsopphold: {
                    perioder: [{
                        fom: '24.03.2018',
                        tom: '25.03.2018',
                    }, {
                        fom: '31.03.2018',
                        tom: '01.04.2018',
                    }],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(false);
        });

        it('Skal returnere true hvis det er tatt ut ferie i en annen periode enn utenlandsopphold-perioden', () => {
            const values = {
                harHattFerie: true,
                ferie: [{
                    fom: '01.01.2018',
                    tom: '05.01.2018',
                }],
                utenlandsopphold: {
                    perioder: [{
                        fom: '06.01.2018',
                        tom: '10.01.2018',
                    }],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(true);
        });

        it('Skal returnere true hvis det er tatt ut ferie delvis overlappende periode med utenlandsopphold-perioden', () => {
            const values = {
                harHattFerie: true,
                ferie: [{
                    fom: '01.01.2018',
                    tom: '08.01.2018',
                }],
                utenlandsopphold: {
                    perioder: [{
                        fom: '06.01.2018',
                        tom: '10.01.2018',
                    }],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(true);
        });

        it('Skal returnere false hvis det er ferie i utenlandsopphold-perioden', () => {
            const values = {
                harHattFerie: true,
                ferie: [{
                    fom: '01.01.2018',
                    tom: '08.01.2018',
                }],
                utenlandsopphold: {
                    perioder: [{
                        fom: '02.01.2018',
                        tom: '05.01.2018',
                    }],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(false);
        });

        it('Skal returnere false hvis det er ferie i utenlandsopphold-perioden og ferie og utenlandsopphold er sammenhengende, men oppdelt på forskjellige måter', () => {
            const values = {
                harHattFerie: true,
                ferie: [{
                    fom: '01.01.2018',
                    tom: '05.01.2018',
                }, {
                    fom: '06.01.2018',
                    tom: '10.01.2018',
                }],
                utenlandsopphold: {
                    perioder: [{
                        fom: '02.01.2018',
                        tom: '08.01.2018',
                    }],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(false);
        });

        // eslint-disable-next-line max-len
        it('Skal returnere false hvis det er ferie i utenlandsopphold-perioden og ferie og utenlandsopphold er sammenhengende, men oppdelt på forskjellige måter og ferie er oppdelt pga helg', () => {
            const values = {
                harHattFerie: true,
                ferie: [{
                    fom: '01.01.2018',
                    tom: '05.01.2018',
                }, {
                    fom: '08.01.2018',
                    tom: '10.01.2018',
                }],
                utenlandsopphold: {
                    perioder: [{
                        fom: '05.01.2018',
                        tom: '09.01.2018',
                    }],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(false);
        });

        it('Skal returnere false hvis utenlandsopphold-periode ikke er fylt ut', () => {
            const values = {
                harHattFerie: true,
                ferie: [{
                    fom: '01.01.2018',
                    tom: '05.01.2018',
                }, {
                    fom: '08.01.2018',
                    tom: '10.01.2018',
                }],
                utenlandsopphold: {
                    perioder: [{}],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(false);
        });

        it('Skal returnere false hvis utenlandsopphold-periode ikke er fylt ut, men ferie er fylt ut', () => {
            const values = {
                harHattFerie: true,
                ferie: [{
                    fom: '01.01.2018',
                    tom: '05.01.2018',
                }, {
                    fom: '08.01.2018',
                    tom: '10.01.2018',
                }],
                utenlandsopphold: {
                    perioder: [{}],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(false);
        });

        it('Skal returnere false hvis utenlandsopphold-periode ikke er fylt ut, og ferie ikke er fylt ut', () => {
            const values = {
                utenlandsopphold: {
                    perioder: [{}],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(false);
        });

        it('Skal returnere true hvis utenlandsopphold-periode er fylt ut med en gyldig periode som ikke er helg og en ugyldig periode', () => {
            const values = {
                utenlandsopphold: {
                    perioder: [{
                        fom: '15.03.2018',
                        tom: '18.03.2018',
                    }, {}],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(true);
        });

        it('Skal returnere false hvis utenlandsopphold er i to hverdager + en helg, og man har hatt ferie på hverdagene', () => {
            const values = {
                harHattFerie: true,
                ferie: [{
                    fom: '05.04.2018',
                    tom: '06.04.2018',
                }],
                utenlandsopphold: {
                    perioder: [{
                        fom: '05.04.2018',
                        tom: '08.04.2018',
                    }],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(false);
        });

        it('Skal returnere false hvis utenlandsopphold er i to hverdager + en helg + to hverdager til, og man har hatt ferie på hverdagene', () => {
            const values = {
                harHattFerie: true,
                ferie: [{
                    fom: '05.04.2018',
                    tom: '06.04.2018',
                }, {
                    fom: '09.04.2018',
                    tom: '10.04.2018',
                }],
                utenlandsopphold: {
                    perioder: [{
                        fom: '05.04.2018',
                        tom: '10.04.2018',
                    }],
                },
            };
            expect(visSoktOmSykepengerUtenlandsoppholdsporsmal(deepFreeze(values))).to.equal(false);
        });
    });
});
