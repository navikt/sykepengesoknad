import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import JaEllerNeiPresisering from './JaEllerNeiPresisering';
import { getNySoknadSelvstendig } from '../../../../test/mock/mockSoknadSelvstendig';
import mockNySoknadArbeidstaker from '../../../../test/mock/mockNySoknadArbeidstaker';
import { INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD_ER_DU_SYKMELDT, UTLANDSOPPHOLD_SOKT_SYKEPENGER } from '../../enums/tagtyper';
import { JA, NEI } from '../../enums/svarEnums';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('JaEllerNeiPresisering', () => {
    it('Skal vise html når tag = INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD_ER_DU_SYKMELDT og søknadstype = ARBEIDSTAKERE og value = JA', () => {
        const component = shallow(<JaEllerNeiPresisering
            tag={INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD_ER_DU_SYKMELDT}
            soknad={mockNySoknadArbeidstaker()}
            value={JA} />);
        expect(component.html()).not.to.equal(null);
    });

    it('Skal vise html når tag = INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD_ER_DU_SYKMELDT og søknadstype = ARBEIDSTAKERE og value = NEI', () => {
        const component = shallow(<JaEllerNeiPresisering
            tag={INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD_ER_DU_SYKMELDT}
            soknad={mockNySoknadArbeidstaker()}
            value={NEI} />);
        expect(component.html()).to.equal(null);
    });

    it('Skal ikke vise html når tag = BLABLABLA og søknadstype = ARBEIDSTAKERE og value = JA', () => {
        const component = shallow(<JaEllerNeiPresisering
            tag="BLABLABLA"
            soknad={mockNySoknadArbeidstaker()}
            value={JA} />);
        expect(component.html()).to.equal(null);
    });

    it('Skal ikke vise html når tag = INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD_ER_DU_SYKMELDT og søknadstype = FRILANSERE', () => {
        const component = shallow(<JaEllerNeiPresisering
            tag={INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD_ER_DU_SYKMELDT}
            soknad={getNySoknadSelvstendig()}
            value={JA} />);
        expect(component.html()).to.equal(null);
    });

    it('Skal vise html når tag = UTLANDSOPPHOLD_SOKT_SYKEPENGER og søknadstype = ARBEIDSTAKERE og value = JA', () => {
        const component = shallow(<JaEllerNeiPresisering
            tag={UTLANDSOPPHOLD_SOKT_SYKEPENGER}
            soknad={mockNySoknadArbeidstaker()}
            value={JA} />);
        expect(component.html()).not.to.equal(null);
    });

    it('Skal vise html når tag = UTLANDSOPPHOLD_SOKT_SYKEPENGER og søknadstype = ARBEIDSTAKERE og value = NEI', () => {
        const component = shallow(<JaEllerNeiPresisering
            tag={UTLANDSOPPHOLD_SOKT_SYKEPENGER}
            soknad={mockNySoknadArbeidstaker()}
            value={NEI} />);
        expect(component.html()).not.to.equal(null);
    });
});
