import chai from 'chai';
import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import { setLedetekster, arbeidssituasjoner } from '@navikt/digisyfo-npm';
import getSykmelding from '../../../../test/mock/mockSykmeldinger';
import SykmeldingUtdragForSelvstendige from './SykmeldingUtdragForSelvstendige';
import mountWithStore from '../../../../test/mountWithStore';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('SykmeldingUtdragForSelvstendige', () => {
    let sykmelding;

    beforeEach(() => {
        setLedetekster({
            'sykepengesoknad.sykmelding-utdrag.egenmelding-papir': 'Egenmelding og/eller sykmelding på papir',
            'sykepengesoknad.sykmelding-utdrag.egenmelding-papir-nei': 'Har ikke hatt egenmelding og/eller sykmelding på papir',
            'sykepengesoknad.sykmelding-utdrag.forsikring': 'Forsikring',
            'sykepengesoknad.sykmelding-utdrag.forsikring-ja-2': 'Ja',
            'sykepengesoknad.sykmelding-utdrag.forsikring-nei': 'Har ikke forsikring som gjelder de første 16 dagene av sykefraværet',
        });
        sykmelding = getSykmelding({
            valgtArbeidssituasjon: arbeidssituasjoner.NAERINGSDRIVENDE,
            sporsmal: {
                fravaersperioder: [{
                    fom: new Date('2018-03-21'),
                    tom: new Date('2018-03-24'),
                }],
                arbeidssituasjon: arbeidssituasjoner.NAERINGSDRIVENDE,
                harAnnetFravaer: true,
                harForsikring: true,
            },
        });
    });

    it('Skal vise informasjon om fraværsperioder dersom dette spørsmålet er besvart', () => {
        const component = mountWithStore(<SykmeldingUtdragForSelvstendige sykmelding={sykmelding} erApen />);
        expect(component.text()).to.contain('Egenmelding og/eller sykmelding på papir');
        expect(component.text()).to.contain('21. – 24. mars 2018');
    });

    it('Skal ikke vise informasjon om fraværsperioder dersom dette spørsmålet ikke er besvart', () => {
        sykmelding.sporsmal.harAnnetFravaer = null;
        sykmelding.sporsmal.fravaersperioder = [];
        const component = mountWithStore(<SykmeldingUtdragForSelvstendige sykmelding={sykmelding} erApen />);
        expect(component.text()).not.to.contain('Egenmelding og/eller sykmelding på papir');
        expect(component.text()).not.to.contain('21. – 24. mars 2018');
    });

    it('Skal vise informasjon om fraværsperioder dersom dette spørsmålet er besvart med NEI', () => {
        sykmelding.sporsmal.harAnnetFravaer = false;
        sykmelding.sporsmal.fravaersperioder = [];
        const component = mountWithStore(<SykmeldingUtdragForSelvstendige sykmelding={sykmelding} erApen />);
        expect(component.text()).to.contain('Egenmelding og/eller sykmelding på papir');
        expect(component.text()).to.contain('Har ikke hatt egenmelding og/eller sykmelding på papir');
    });

    it('Skal vise informasjon om forsikring dersom dette spørsmålet er stilt', () => {
        const component = mountWithStore(<SykmeldingUtdragForSelvstendige sykmelding={sykmelding} erApen />);
        expect(component.text()).to.contain('Forsikring');
        expect(component.text()).to.contain('Ja');
    });

    it('Skal vise informasjon om forsikring dersom dette spørsmålet er stilt og besvart med nei', () => {
        sykmelding.sporsmal.harForsikring = false;
        const component = mountWithStore(<SykmeldingUtdragForSelvstendige sykmelding={sykmelding} erApen />);
        expect(component.text()).to.contain('Forsikring');
        expect(component.text()).to.contain('Har ikke forsikring som gjelder de første 16 dagene av sykefraværet');
    });

    it('Skal ikke vise informasjon om forsikring dersom dette spørsmålet ikke er stilt', () => {
        sykmelding.sporsmal.harForsikring = null;
        const component = mountWithStore(<SykmeldingUtdragForSelvstendige sykmelding={sykmelding} erApen />);
        expect(component.text()).not.to.contain('Forsikring');
        expect(component.text()).not.to.contain('Ja');
    });

    it('Skal vise informasjon om forsikring og fraværsperioder desom begge er besvart med nei', () => {
        sykmelding.sporsmal = {
            arbeidssituasjon: 'NAERINGSDRIVENDE',
            harForsikring: false,
            fravaersperioder: [],
            harAnnetFravaer: false,
        };
        const component = mountWithStore(<SykmeldingUtdragForSelvstendige sykmelding={sykmelding} erApen />);
        expect(component.text()).to.contain('Forsikring');
        expect(component.text()).to.contain('Har ikke forsikring som gjelder de første 16 dagene av sykefraværet');
        expect(component.text()).to.contain('Egenmelding og/eller sykmelding på papir');
        expect(component.text()).to.contain('Har ikke hatt egenmelding og/eller sykmelding på papir');
    });
});
