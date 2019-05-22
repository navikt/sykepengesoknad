import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import { parseSykmelding } from '@navikt/digisyfo-npm';
import soknader from '../../sykepengesoknad/data/soknader/soknader';
import dineSykmeldinger from '../data/dine-sykmeldinger/dineSykmeldinger';
import unleashToggles from '../../reducers/unleashToggles';
import { unleashTogglesHentet } from '../../actions/unleashToggles_actions';
import { setDineSykmeldinger } from '../data/dine-sykmeldinger/dineSykmeldingerActions';
import { soknaderHentet } from '../../sykepengesoknad/data/soknader/soknaderActions';
import { getNySoknadSelvstendig } from '../../../test/mock/mockSoknadSelvstendig';
import getSykmelding from '../../../test/mock/mockSykmeldinger';
import { Container, mapStateToProps } from './AngreBekreftSykmeldingContainer';
import { SYKMELDING_ARBEIDSSITUASJON } from '../../enums/unleashToggles';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Container', () => {
    let clock;
    let state;
    let sykmelding1;
    let sykmelding2;

    beforeEach(() => {
        clock = sinon.useFakeTimers(new Date('2018-06-01').getTime());
        sykmelding1 = getSykmelding({
            id: 'sykmelding-1',
            sendtdato: new Date('2018-01-31'),
        });
        sykmelding2 = getSykmelding({
            id: 'sykmelding-2',
            sendtdato: new Date('2018-02-05'),
        });
        state = {
            dineSykmeldinger: dineSykmeldinger(
                dineSykmeldinger(),
                setDineSykmeldinger([sykmelding1, sykmelding2]),
            ),
            soknader: soknader(soknader(),
                soknaderHentet([
                    getNySoknadSelvstendig({
                        sykmeldingId: 'sykmelding-1',
                        status: 'NY',
                    }),
                ])),
            unleashToggles: unleashToggles(
                unleashToggles(),
                unleashTogglesHentet({
                    [SYKMELDING_ARBEIDSSITUASJON]: true,
                }),
            ),
        };
    });

    afterEach(() => {
        clock.restore();
    });

    it('Skal vise null hvis det er mer enn fire måneder siden sykmelding ble sendt', () => {
        const ownProps = {
            sykmelding: parseSykmelding(sykmelding1),
        };
        const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
        expect(component.html()).to.equal(null);
    });

    it('Skal vise html hvis det er mindre enn fire måneder siden sykmelding ble sendt og det ikke finnes søknader', () => {
        const ownProps = {
            sykmelding: parseSykmelding(sykmelding2),
        };
        const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
        expect(component.html()).not.to.equal(null);
    });

    it('Skal vise html hvis det er mindre enn fire måneder siden sykmelding ble sendt og sykmelding har søknad som er NY og toggle er på', () => {
        const ownProps = {
            sykmelding: parseSykmelding(sykmelding2),
        };
        state.soknader = soknader(
            soknader(),
            soknaderHentet([getNySoknadSelvstendig({ sykmeldingId: 'sykmelding-2', status: 'NY' })]),
        );
        const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
        expect(component.html()).not.to.equal(null);
    });

    it('Skal vise html hvis det er mindre enn fire måneder siden sykmelding ble sendt og sykmelding har søknad som er FREMTIDIG og toggle er på', () => {
        const ownProps = {
            sykmelding: parseSykmelding(sykmelding2),
        };
        state.soknader = soknader(
            soknader(),
            soknaderHentet([getNySoknadSelvstendig({ sykmeldingId: 'sykmelding-2', status: 'FREMTIDIG' })]),
        );
        const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
        expect(component.html()).not.to.equal(null);
    });

    it('Skal ikke vise html hvis det er mindre enn fire måneder siden sykmelding ble sendt og sykmelding har søknad som er SENDT og toggle er på', () => {
        const ownProps = {
            sykmelding: parseSykmelding(sykmelding2),
        };
        state.soknader = soknader(
            soknader(),
            soknaderHentet([getNySoknadSelvstendig({ sykmeldingId: 'sykmelding-2', status: 'SENDT' })]),
        );
        const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
        expect(component.html()).to.equal(null);
    });

    it('Skal vise null hvis det er mindre enn fire måneder siden sykmelding ble sendt og sykmelding har søknad som er NY og toggle er av', () => {
        const ownProps = {
            sykmelding: parseSykmelding(sykmelding2),
        };
        state.unleashToggles.data = {
            [SYKMELDING_ARBEIDSSITUASJON]: false,
        };
        state.soknader = soknader(
            soknader(),
            soknaderHentet([getNySoknadSelvstendig({ sykmeldingId: 'sykmelding-2', status: 'NY' })]),
        );
        const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
        expect(component.html()).to.equal(null);
    });

    it('Skal vise null hvis det er mindre enn fire måneder siden sykmelding ble sendt og sykmelding har søknad som er SENDT og toggle er av', () => {
        const ownProps = {
            sykmelding: parseSykmelding(sykmelding2),
        };
        state.unleashToggles = unleashToggles(
            unleashToggles(),
            unleashTogglesHentet({
                [SYKMELDING_ARBEIDSSITUASJON]: false,
            }),
        );
        state.soknader = soknader(
            soknader(),
            soknaderHentet([getNySoknadSelvstendig({ sykmeldingId: 'sykmelding-2', status: 'SENDT' })]),
        );
        const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
        expect(component.html()).to.equal(null);
    });
});
