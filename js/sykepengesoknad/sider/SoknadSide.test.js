import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { reducer as formReducer } from 'redux-form';
import SoknadSide, { Container, mapStateToProps } from './SoknadSide';
import AppSpinner from '../../components/AppSpinner';
import sykepengesoknader from '../../sykepengesoknad-gammel-plattform/data/sykepengesoknader/sykepengesoknader';
import soknader from '../data/soknader/soknader';
import dineSykmeldinger from '../../sykmeldinger/data/dine-sykmeldinger/dineSykmeldinger';
import SendtSoknadSelvstendig from '../soknad-selvstendig-frilanser/SendtSoknadSelvstendig';
import mountWithStore from '../../../test/mountWithStore';
import { getSendtSoknadSelvstendig } from '../../../test/mock/mockSoknadSelvstendig';
import reduxFormMeta from '../../data/redux-form-meta/reduxFormMeta';
import mockNySoknadArbeidstaker from '../../../test/mock/mockNySoknadArbeidstaker';
import NySoknadArbeidstaker from '../soknad-arbeidstaker/NySoknadArbeidstaker';
import SoknadKvitteringSjekker from '../felleskomponenter/SoknadKvitteringSjekker';
import soknadMeta from '../data/soknadMeta/soknadMeta';
import { ForDuBegynnerSkjema } from '../felleskomponenter/ett-sporsmal-per-side/ForDuBegynnerSkjema';
import EttSporsmalPerSideContainer from '../felleskomponenter/ett-sporsmal-per-side/EttSporsmalPerSideContainer';
import { getParsetSoknad } from '../../../test/mock/mockSykepengesoknader';
import FravaerOgFriskmeldingContainerGammelPlattform from '../../sykepengesoknad-gammel-plattform/fravar-og-friskmelding/FravaerOgFriskmeldingContainer';
import FoerDuBegynnerGammelPlattform from '../../sykepengesoknad-gammel-plattform/for-du-begynner/FoerDuBegynnerContainer';
import vedlikehold from '../../data/vedlikehold/vedlikehold';

chai.use(chaiEnzyme());

const expect = chai.expect;

describe('SoknadSideTest', () => {
    let state;
    let ownProps;
    let actions;
    let hentSykepengesoknader;
    let oppdaterSoknader;
    let hentDineSykmeldinger;
    let opprettSoknadUtland;
    let initialize;

    beforeEach(() => {
        state = {};

        state.sykepengesoknader = sykepengesoknader();

        state.ledetekster = {};

        state.soknader = soknader();

        state.dineSykmeldinger = dineSykmeldinger();

        ownProps = {
            params: {
                sykepengesoknadId: 'min-soknad-id',
                steg: '',
            },
            location: {
                pathname: '/',
            },
        };

        hentSykepengesoknader = sinon.spy();
        oppdaterSoknader = sinon.spy();
        hentDineSykmeldinger = sinon.spy();
        opprettSoknadUtland = sinon.spy();
        initialize = sinon.spy();

        actions = {
            hentSykepengesoknader,
            oppdaterSoknader,
            hentDineSykmeldinger,
            opprettSoknadUtland,
            initialize,
        };
    });

    describe('Henting av data', () => {
        it('Skal hente søknader hvis søknader ikke er hentet', () => {
            state.soknader = {
                ...state.soknader,
                hentet: false,
            };
            shallow(<Container {...mapStateToProps(state, ownProps)} actions={actions} />);
            expect(oppdaterSoknader.called).to.equal(true);
        });

        it('Skal hente søknader hvis søknader er hentet', () => {
            state.soknader = {
                ...state.soknader,
                hentet: true,
            };
            shallow(<Container {...mapStateToProps(state, ownProps)} actions={actions} />);
            expect(oppdaterSoknader.called).to.equal(true);
        });

        it('Skal hente sykepengesøknader', () => {
            state.soknader = {
                ...state.soknader,
                hentet: false,
                henter: false,
            };
            shallow(<Container {...mapStateToProps(state, ownProps)} actions={actions} />);
            expect(hentSykepengesoknader.called).to.equal(true);
        });

        it('Skal hente søknad hvis det eksisterer en søknad', () => {
            state.soknader = {
                ...state.soknader,
                data: [{
                    id: 'min-soknad-id',
                }],
                henter: false,
            };
            shallow(<Container {...mapStateToProps(state, ownProps)} actions={actions} />);
            expect(oppdaterSoknader.called).to.equal(true);
        });
    });

    describe('Visning', () => {
        beforeEach(() => {
            const hentetOk = {
                hentet: true,
                hentingFeilet: false,
            };
            state.dineSykmeldinger = {
                ...state.dineSykmeldinger,
                ...hentetOk,
            };
            state.soknader = {
                ...state.soknader,
                ...hentetOk,
            };
            state.sykepengesoknader = {
                ...state.sykepengesoknader,
                ...hentetOk,
            };
        });

        it('Skal vise spinner dersom det hentes søknader', () => {
            state.soknader.henter = true;
            const component = mountWithStore(<SoknadSide {...ownProps} />, state);
            expect(component.find(AppSpinner)).to.have.length(1);
        });

        it('Skal vise spinner dersom det hentes sykepengesoknader', () => {
            state.sykepengesoknader.henter = true;
            const component = mountWithStore(<SoknadSide {...ownProps} />, state);
            expect(component.find(AppSpinner)).to.have.length(1);
        });

        describe('SoknadSelvstendigNaeringsdrivendeSkjema', () => {
            describe('Når søknad er sendt', () => {
                beforeEach(() => {
                    state.soknader.data = [getSendtSoknadSelvstendig({
                        id: 'min-soknad-id',
                    })];
                });

                it('Skal vise kvittering dersom man står på kvitteringssiden', () => {
                    ownProps.location.pathname = '/sykepengesoknad/soknader/min-soknad-id/kvittering';
                    const component = mountWithStore(<SoknadSide {...ownProps} />, state);
                    expect(component.find(SoknadKvitteringSjekker)).to.have.length(1);
                });

                it('Skal vise Sendt søknad dersom man står på noe annet enn kvitteringssiden', () => {
                    ownProps.location.pathname = '/sykepengesoknad/soknader/min-soknad-id/olsen';
                    const component = mountWithStore(<SoknadSide {...ownProps} />, state);
                    expect(component.find(SendtSoknadSelvstendig)).to.have.length(1);
                });

                it('Skal vise Sendt søknad dersom man står på side 1', () => {
                    ownProps.location.pathname = '/sykepengesoknad/soknader/min-soknad-id/';
                    const component = mountWithStore(<SoknadSide {...ownProps} />, state);
                    expect(component.find(SendtSoknadSelvstendig)).to.have.length(1);
                });
            });
        });

        describe('Ny søknad for arbeidstakere (ny plattform)', () => {
            describe('Når søknad er NY', () => {
                beforeEach(() => {
                    state.soknader.data = [mockNySoknadArbeidstaker({
                        id: 'min-soknad-id',
                    })];
                    state.reduxFormMeta = reduxFormMeta();
                    state.soknadMeta = soknadMeta();
                    state.form = formReducer();
                });

                it('Skal vise NySoknadArbeidstaker og NyFoerDuBegynnerArbeidstakerContainer på side 1', () => {
                    ownProps.location.pathname = '/sykepengesoknad/soknader/min-soknad-id';
                    const component = mountWithStore(<SoknadSide {...ownProps} />, state);
                    expect(component.find(NySoknadArbeidstaker)).to.have.length(1);
                    expect(component.find(ForDuBegynnerSkjema)).to.have.length(1);
                });

                it('Skal vise EttSporsmalPerSideContainer på side 2', () => {
                    ownProps.location.pathname = '/sykepengesoknad/soknader/min-soknad-id/2/';
                    ownProps.params.steg = '2';
                    const component = mountWithStore(<SoknadSide {...ownProps} />, state);
                    expect(component.find(NySoknadArbeidstaker)).to.have.length(1);
                    expect(component.find(EttSporsmalPerSideContainer)).to.have.length(1);
                });
            });
        });

        describe('Ny søknad for arbeidstakere (gammel plattform)', () => {
            describe('Når søknad er NY', () => {
                beforeEach(() => {
                    state.vedlikehold = vedlikehold();
                    state.sykepengesoknader.data = [getParsetSoknad({
                        id: 'min-soknad-id',
                    })];
                    state.reduxFormMeta = reduxFormMeta();
                    state.soknadMeta = soknadMeta();
                    state.form = formReducer();
                });

                it('Skal vise ForDuBegynner på side 1', () => {
                    ownProps.location.pathname = '/sykepengesoknad/soknader/min-soknad-id';
                    const component = mountWithStore(<SoknadSide {...ownProps} />, state);
                    expect(component.find(FoerDuBegynnerGammelPlattform)).to.have.length(1);
                });

                it('Skal Fravær og friskmelding på side 2', () => {
                    ownProps.location.pathname = '/sykepengesoknad/soknader/min-soknad-id/fravaer-og-friskmelding';
                    const component = mountWithStore(<SoknadSide {...ownProps} />, state);
                    expect(component.find(FravaerOgFriskmeldingContainerGammelPlattform)).to.have.length(1);
                });
            });
        });
    });
});

