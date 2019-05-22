import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import { setLedetekster } from '@navikt/digisyfo-npm';
import { Fields } from 'redux-form';
import Aktiviteter, { Aktivitet } from './Aktiviteter';
import AngiTid from './OppgiArbeid';
import JaEllerNei from '../../components/skjema/JaEllerNei';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Aktiviteter', () => {
    let ledetekster;
    let component;
    let untouch;
    let autofill;
    let aktiviteter;
    let sykepengesoknad;

    beforeEach(() => {
        autofill = sinon.spy();
        untouch = sinon.spy();
        aktiviteter = [{
            periode: {
                fom: new Date('2017-01-01'),
                tom: new Date('2017-01-15'),
            },
            grad: 100,
            avvik: null,
        }, {
            periode: {
                fom: new Date('2017-01-16'),
                tom: new Date('2017-01-25'),
            },
            grad: 35,
            avvik: null,
        }];
        /* eslint-disable max-len */
        ledetekster = {
            'sykepengesoknad.aktiviteter.gradert.spoersmal-2': 'I perioden %FOM%–%TOM% skulle du ifølge sykmeldingen jobbe %ARBEIDSGRAD% % av din normale arbeidstid hos %ARBEIDSGIVER%. Jobbet du mer enn dette?',
            'sykepengesoknad.aktiviteter.ugradert.spoersmal-2': 'I perioden %FOM%–%TOM% var du 100 % sykmeldt fra %ARBEIDSGIVER%. Jobbet du noe i denne perioden?',
            'sykepengesoknad.aktiviteter.avvik.hvor-mye-har-du-jobbet': 'Hvor hvor mye jobbet du totalt i denne perioden hos %ARBEIDSGIVER%?',
            'sykepengesoknad.utdanning.ja-nei.sporsmal-2': 'Har du vært under utdanning i løpet av perioden %PERIODE%?',
            'sykepengesoknad.aktiviteter.gradert.spoersmal-3': 'I perioden %PERIODE% skulle du jobbe %ARBEIDSGRAD% % av ditt normale arbeid hos %ARBEIDSGIVER%. Jobbet du mer enn dette?',
            'sykepengesoknad.aktiviteter.ugradert.spoersmal-3': 'I perioden %PERIODE% var du 100 % sykmeldt fra %ARBEIDSGIVER%. Jobbet du noe i denne perioden?',
            'sykepengesoknad.egenmeldingsdager.janei.sporsmal-3': 'Vi har registrert at du ble sykmeldt %DATO%. Brukte du egenmeldinger og/eller var du sykmeldt i perioden %PERIODE%?',
            'sykepengesoknad.ferie-permisjon-utenlandsopphold.janei.sporsmal-2': 'Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden %PERIODE%?',
        };
        /* eslint-enable max-len */

        setLedetekster(ledetekster);

        sykepengesoknad = {
            id: 'test',
            arbeidsgiver: {
                navn: 'MORTENS GRØNNSAKER',
            },
        };
    });

    describe('Aktiviteter', () => {
        let dato;

        beforeEach(() => {
            dato = new Date();
            sykepengesoknad = {
                id: 'test',
                arbeidsgiver: {
                    navn: 'Mortens Gitarservice',
                },
            };
            component = shallow(<Aktiviteter
                sykepengesoknad={sykepengesoknad}
                fields={aktiviteter}
                gjenopptattArbeidFulltUtDato={dato}
                ledetekster={ledetekster}
                autofill={autofill}
                untouch={untouch} />);
        });

        it('Skal rendre en Aktivitet per field', () => {
            expect(component.find(Aktivitet)).to.have.length(2);
        });

        it('Skal sende riktige props videre til Aktivitet', () => {
            expect(component.contains(<Aktivitet
                field={aktiviteter[0]}
                index={0}
                sykepengesoknad={sykepengesoknad}
                autofill={autofill}
                untouch={untouch} />)).to.equal(true);

            expect(component.contains(<Aktivitet
                field={aktiviteter[1]}
                index={1}
                sykepengesoknad={sykepengesoknad}
                autofill={autofill}
                untouch={untouch} />)).to.equal(true);
        });
    });

    describe('Aktivitet for gradert sykmelding', () => {
        let ja;

        beforeEach(() => {
            component = shallow(<Aktivitet
                sykepengesoknad={sykepengesoknad}
                field={aktiviteter[1]}
                index={1}
                arbeidsgiver="MORTENS GRØNNSAKER"
                autofill={autofill}
                untouch={untouch} />);
            ja = component.find(JaEllerNei);
        });

        it('Skal inneholde en JaEllerNei', () => {
            expect(ja).to.have.length(1);
            expect(ja.prop('name')).to.equal('aktiviteter[1].jobbetMerEnnPlanlagt');
            expect(ja.prop('spoersmal'))
                .to.equal('I perioden 16. – 25. januar 2017 skulle du jobbe 65 % av ditt normale arbeid hos MORTENS GRØNNSAKER. Jobbet du mer enn dette?');
        });

        it('Skal inneholde en Hjelpetekst', () => {
            expect(ja.prop('hjelpetekst')).not.to.equal(undefined);
        });

        it('Skal inneholde Fields', () => {
            const fields = ja.find(Fields);
            expect(fields).to.have.length(1);
            expect(fields.prop('autofill')).to.deep.equal(autofill);
            expect(fields.prop('untouch')).to.deep.equal(untouch);
            expect(fields.prop('component')).to.deep.equal(AngiTid);
            expect(fields.prop('aktivitetIndex')).to.equal(1);
            expect(fields.prop('names')).to.deep.equal([
                'aktiviteter[1].avvik.arbeidsgrad',
                'aktiviteter[1].avvik.timer',
                'aktiviteter[1].avvik.arbeidstimerNormalUke',
                'aktiviteter[1].avvik.enhet',
            ]);
        });
    });

    describe('Aktivitet for ugradert sykmelding', () => {
        let ja;

        beforeEach(() => {
            component = shallow(<Aktivitet
                field={aktiviteter[0]}
                index={0}
                sykepengesoknad={sykepengesoknad}
                autofill={autofill}
                untouch={untouch} />);
            ja = component.find(JaEllerNei);
        });

        it('Skal inneholde en JaEllerNei', () => {
            expect(ja).to.have.length(1);
            expect(ja.prop('name')).to.equal('aktiviteter[0].jobbetMerEnnPlanlagt');
            expect(ja.prop('spoersmal')).to.equal('I perioden 1. – 15. januar 2017 var du 100 % sykmeldt fra MORTENS GRØNNSAKER. Jobbet du noe i denne perioden?');
        });

        it('Skal ikke inneholde en Hjelpetekst', () => {
            expect(ja.prop('hjelpetekst')).to.equal(null);
        });

        it('Skal inneholde Fields', () => {
            const fields = ja.find(Fields);
            expect(fields).to.have.length(1);
            expect(fields.prop('autofill')).to.deep.equal(autofill);
            expect(fields.prop('untouch')).to.deep.equal(untouch);
            expect(fields.prop('component')).to.deep.equal(AngiTid);
            expect(fields.prop('aktivitetIndex')).to.equal(0);
            expect(fields.prop('names')).to.deep.equal([
                'aktiviteter[0].avvik.arbeidsgrad',
                'aktiviteter[0].avvik.timer',
                'aktiviteter[0].avvik.arbeidstimerNormalUke',
                'aktiviteter[0].avvik.enhet',
            ]);
        });
    });
});
