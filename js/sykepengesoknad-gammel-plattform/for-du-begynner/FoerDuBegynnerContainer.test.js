import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import { mapStateToProps, Container } from './FoerDuBegynnerContainer';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('FoerDuBegynnerContainer', () => {
    let state;
    let ownProps;
    let destroy;
    let hentBerikelse;
    let actions;

    beforeEach(() => {
        destroy = sinon.spy();
        hentBerikelse = sinon.spy();
        actions = { destroy, hentBerikelse };
        state = {
            vedlikehold: {
                data: {},
            },
            sykepengesoknader: {
                data: [],
            },
            soknader: {
                data: [],
            },
        };
        ownProps = {
            params: {
                sykepengesoknadId: '123',
            },
        };
    });

    it('Skal hente berikelse hvis søknaden er en sykepengesøknad', () => {
        state.sykepengesoknader.data = [{
            id: '123',
        }];
        const props = mapStateToProps(state, ownProps);
        shallow(<Container {...props} {...actions} />);
        expect(hentBerikelse.called).to.equal(true);
    });

    it('Skal ikke hente berikelse hvis søknaden er en frilansersøknad', () => {
        state.sykepengesoknader.data = [{
            id: '456',
        }];
        state.soknader.data = [{
            id: '123',
        }];
        const props = mapStateToProps(state, ownProps);
        shallow(<Container {...props} {...actions} />);
        expect(hentBerikelse.called).to.equal(false);
    });

    it('Skal returnere erForsteSoknad dersom man har én NY søknad', () => {
        state.sykepengesoknader.data = [{
            status: 'NY',
        }];
        const props = mapStateToProps(state, ownProps);
        expect(props.erForsteSoknad).to.equal(true);
    });

    it('Skal returnere erForsteSoknad === true dersom alle søknader er enten NY eller FREMTIDIG', () => {
        state.sykepengesoknader.data = [{
            status: 'NY',
        }, {
            status: 'FREMTIDIG',
        }];
        const props = mapStateToProps(state, ownProps);
        expect(props.erForsteSoknad).to.equal(true);
    });

    it('Skal returnere erForsteSoknad === false dersom det finnes søknader som ikke er NY eller FREMTIDIG', () => {
        state.sykepengesoknader.data = [{
            status: 'NY',
        }, {
            status: 'SENDT',
        }];
        const props = mapStateToProps(state, ownProps);
        expect(props.erForsteSoknad).to.equal(false);
    });

    it('Skal returnere erForsteSoknad === false hvis ikke alle søknader er NY eller FREMTIDIG', () => {
        state.sykepengesoknader.data = [{
            status: 'NY',
        }, {
            status: 'SENDT',
        }, {
            status: 'FREMTIDIG',
        }];
        const props = mapStateToProps(state, ownProps);
        expect(props.erForsteSoknad).to.equal(false);
    });
});
