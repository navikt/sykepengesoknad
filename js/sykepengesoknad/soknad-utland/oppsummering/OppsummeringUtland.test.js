import chai from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { setLedetekster } from '@navikt/digisyfo-npm';
import Oppsummeringsvisning from '../../felleskomponenter/oppsummering/Oppsummeringsvisning';
import populerSoknadMedSvar from '../../utils/populerSoknadMedSvar';
import { getSoknadUtland } from '../../../../test/mock/mockSoknadUtland';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Oppsummeringvisning', () => {
    let values;

    beforeEach(() => {
        setLedetekster({
            'soknad.ja': 'Ja',
            'soknad.nei': 'Nei',
            'soknad.periode': 'Fra %FOM% til %TOM%',
            'soknad.timer-totalt': 'timer totalt',
            'soknad.prosent': 'prosent',
        });

        values = {
            ARBEIDSGIVER: {
                sporsmalsid: '1',
                svarverdier: [
                    {
                        verdi: 'JA',
                    },
                ],
            },
            LAND: {
                sporsmalsid: '2',
                svarverdier: [
                    {
                        verdi: 'Italia',
                    },
                ],
            },
            SYKMELDINGSGRAD: {
                sporsmalid: '4',
                svarverdier: [
                    {
                        verdi: 'JA',
                    },
                ],
            },
            BEKREFT_OPPLYSNINGER_UTLAND: {
                sporsmalsid: '3',
                svarverdier: [
                    {
                        verdi: 'CHECKED',
                    },
                ],
            },
            PERIODEUTLAND: [
                {
                    fom: '01.01.2019',
                    tom: '03.01.2019',
                },
                {
                    fom: '05.01.2019',
                    tom: '08.01.2019',
                },
            ],
            FERIE: {
                sporsmalid: '5',
                svarverdier: [
                    {
                        verdi: 'NEI',
                    },
                ],
            },
        };
    });

    it('Skal vise besvarte spørsmål på nivå 1', () => {
        const populertSoknad = populerSoknadMedSvar(getSoknadUtland(), values);
        const component = mount(<Oppsummeringsvisning soknad={populertSoknad} />);
        expect(component.text()).to.contain('Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.');
    });

    it('Skal vise besvarte spørsmål på nivå 1 (LAND-spørsmål)', () => {
        const populertSoknad = populerSoknadMedSvar(getSoknadUtland(), values);
        const component = mount(<Oppsummeringsvisning soknad={populertSoknad} />);
        expect(component.text()).to.contain('Italia');
    });

    it('Skal vise besvarte spørsmål på nivå 2 når hovedspørsmål er besvart med JA', () => {
        const populertSoknad = populerSoknadMedSvar(getSoknadUtland(), values);
        const component = mount(<Oppsummeringsvisning soknad={populertSoknad} />);
        expect(component.find('#js-sykmeldingsgrad').text()).to.contain('Er du 100% sykmeldt?');
    });

    it('Skal vise besvarte spørsmål på nivå 1 når spørsmål er av typen PERIODER', () => {
        const populertSoknad = populerSoknadMedSvar(getSoknadUtland(), values);
        const component = mount(<Oppsummeringsvisning soknad={populertSoknad} />);
        expect(component.text()).to.contain('Fra 01.01.2019 til 03.01.2019');
        expect(component.text()).to.contain('Fra 05.01.2019 til 08.01.2019');
    });

    it('Skal ha riktig overskriftsnivå på underspørsmål i checkboxgrupper', () => {
        const populertSoknad = populerSoknadMedSvar(getSoknadUtland(), values);
        const component = mount(<Oppsummeringsvisning soknad={populertSoknad} />);
        expect(component.contains(<h3 className="oppsummering__sporsmal">Har du arbeidsgiver?</h3>)).to.equal(true);
        expect(component.contains(<h4 className="oppsummering__sporsmal">Er du 100% sykmeldt?</h4>)).to.equal(true);
        expect(component.contains(<h4 className="oppsummering__sporsmal">Skal du ha ferie i hele perioden?</h4>)).to.equal(true);
    });
});
