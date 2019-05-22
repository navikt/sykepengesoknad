import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import Alertstripe from 'nav-frontend-alertstriper';
import sinon from 'sinon';
import Feilmelding from '../../components/Feilmelding';
import { Container, mapStateToProps } from './SoknaderSide';
import Soknader from '../sykepengesoknader/Soknader';
import AppSpinner from '../../components/AppSpinner';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('SoknaderSide', () => {
    describe('mapStateToProps', () => {
        it('skal returnere soknader', () => {
            const res = mapStateToProps({
                ledetekster: {
                    data: {},
                    henter: false,
                    hentingFeilet: false,
                },
                sykepengesoknader: {
                    data: [{
                        id: 1,
                    }],
                    henter: false,
                    hentingFeilet: false,
                    hentet: true,
                },
                soknader: {
                    data: [],
                },
                unleashToggles: {
                    data: {},
                },
                dineSykmeldinger: {
                    data: [],
                    hentet: true,
                    hentingFeilet: false,
                },
            });
            expect(res.sykepengesoknader).to.deep.equal([
                { id: 1 },
            ]);
        });
    });

    describe('Container', () => {
        let actions;
        let hentSykepengesoknader;
        let hentSoknader;
        let hentDineSykmeldinger;
        let state;

        beforeEach(() => {
            state = {
                sykepengesoknader: {
                    data: [],
                    henter: false,
                    hentingFeilet: false,
                    hentet: false,
                },
                dineSykmeldinger: {
                    data: [],
                    hentet: true,
                    hentingFeilet: false,
                },
                ledetekster: {

                },
                soknader: {
                    data: [],
                    henter: false,
                    hentingFeilet: false,
                    hentet: false,
                },
                unleashToggles: {
                    data: {},
                },
            };
            hentSykepengesoknader = sinon.spy();
            hentSoknader = sinon.spy();
            hentDineSykmeldinger = sinon.spy();
            actions = { hentSykepengesoknader, hentSoknader, hentDineSykmeldinger };
        });

        it('Skal vise Alertstripe om henting av sykepengesøknader feiler', () => {
            state.sykepengesoknader.hentingFeilet = true;
            state.soknader.hentet = true;
            const props = mapStateToProps(state);
            const component = shallow(<Container {...props} actions={actions} />);
            expect(component.find(Soknader)).to.have.length(1);
            expect(component.find(Soknader).prop('visFeil')).to.equal(true);
            expect(component.find(AppSpinner)).to.have.length(0);
        });

        it('Skal vise Alertstripe om henting av søknader feiler', () => {
            state.soknader.hentingFeilet = true;
            state.sykepengesoknader.hentet = true;
            const props = mapStateToProps(state);
            const component = shallow(<Container {...props} actions={actions} />);
            expect(component.find(Soknader)).to.have.length(1);
            expect(component.find(Soknader).prop('visFeil')).to.equal(true);
            expect(component.find(AppSpinner)).to.have.length(0);
        });

        it('Skal vise Feilmelding om henting av søknader og henting av sykepengesøknader feiler', () => {
            state.soknader.hentingFeilet = true;
            state.sykepengesoknader.hentingFeilet = true;
            const props = mapStateToProps(state);
            const component = shallow(<Container {...props} actions={actions} />);
            expect(component.find(Soknader)).to.have.length(0);
            expect(component.find(Feilmelding)).to.have.length(1);
            expect(component.find(AppSpinner)).to.have.length(0);
        });

        it('Skal vise spinner om vi henter søknader', () => {
            state.soknader.henter = true;
            const props = mapStateToProps(state);
            const component = shallow(<Container {...props} actions={actions} />);
            expect(component.find(Soknader)).to.have.length(0);
            expect(component.find(Alertstripe)).to.have.length(0);
            expect(component.find(AppSpinner)).to.have.length(1);
        });

        it('Skal vise spinner om vi henter sykepengersøknader', () => {
            state.sykepengesoknader.henter = true;
            const props = mapStateToProps(state);
            const component = shallow(<Container {...props} actions={actions} />);
            expect(component.find(Soknader)).to.have.length(0);
            expect(component.find(Feilmelding)).to.have.length(0);
            expect(component.find(AppSpinner)).to.have.length(1);
        });

        it('Skal vise Soknaderside om alt er hentet', () => {
            state.sykepengesoknader.hentet = true;
            state.soknader.hentet = true;
            const props = mapStateToProps(state);
            const component = shallow(<Container {...props} actions={actions} />);
            expect(component.find(Soknader)).to.have.length(1);
            expect(component.find(Soknader).prop('visFeil')).to.equal(false);
            expect(component.find(Feilmelding)).to.have.length(0);
            expect(component.find(AppSpinner)).to.have.length(0);
        });

        it('Skal hente sykepengesøknader', () => {
            const props = mapStateToProps(state);
            shallow(<Container {...props} actions={actions} />);
            expect(hentSykepengesoknader.called).to.equal(true);
        });

        it('Skal hente søknader', () => {
            const props = mapStateToProps(state);
            shallow(<Container {...props} actions={actions} />);
            expect(hentSoknader.called).to.equal(true);
        });
    });
});
