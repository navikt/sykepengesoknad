import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { setLedetekster } from '@navikt/digisyfo-npm';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import Feilomrade from '../../components/skjema/Feilomrade';
import { ForskuttererSporsmal } from './ForskuttererArbeidsgiver';

chai.use(chaiEnzyme());
const expect = chai.expect;


describe('ForskuttererArbeidsgiver', () => {
    /* eslint-disable max-len */
    const ledetekster = {
        'sykepengesoknad.forskutterer-arbeidsgiver.sporsmal': 'Betaler arbeidsgiveren lønnen din når du er syk?',
        'sykepengesoknad.forskutterer-arbeidsgiver.hjelpetekst.tittel': 'Lønn under sykdom',
        'sykepengesoknad.forskutterer-arbeidsgiver.hjelpetekst.tekst': 'Arbeidsgiveren betaler vanligvis lønnen de første 16 kalenderdagene man er syk. Noen arbeidsgivere fortsetter å utbetale lønn og søker om å få pengene igjen fra NAV senere.',
        'sykepengesoknad.forskutterer-arbeidsgiver.svar.JA': 'Ja',
        'sykepengesoknad.forskutterer-arbeidsgiver.svar.NEI': 'Nei',
        'sykepengesoknad.forskutterer-arbeidsgiver.svar.VET_IKKE': 'Vet ikke',
        'sykepengesoknad.forskutterer-arbeidsgiver.infotekst.JA': 'Arbeidsgiveren din mottar kopi av søknaden du sender til NAV',
        'sykepengesoknad.forskutterer-arbeidsgiver.infotekst.NEI': 'Søknaden sendes til NAV. Arbeidsgiveren din får ikke kopi.',
        'sykepengesoknad.forskutterer-arbeidsgiver.infotekst.VET_IKKE': 'Siden du ikke vet svaret på dette spørsmålet, sender vi kopi av søknaden du sender til arbeidsgiveren din',
    };
    /* eslint-enable max-len */

    beforeEach(() => {
        setLedetekster(ledetekster);
    });

    describe('ForskuttererSporsmal', () => {
        let component;

        beforeEach(() => {
            component = shallow(<ForskuttererSporsmal />);
        });

        it('Inneholder hjelpetekst', () => {
            const h = component.find(Hjelpetekst);
            expect(h).to.have.length(1);
            expect(h.prop('children')).to.equal(ledetekster['sykepengesoknad.forskutterer-arbeidsgiver.hjelpetekst.tekst']);
        });

        it('Inneholder Feilomrade', () => {
            expect(component.find(Feilomrade)).to.have.length(1);
        });
    });
});
