import chai from 'chai';
import { getStillingsprosent } from './BeregnetArbeidsgrad';

const expect = chai.expect;

describe('BeregnetArbeidsgrad', () => {
    describe('getStillingsprosent', () => {
        it('Skal returnere stilingsprosent', () => {
            const antallTimerIArbeid = '10';
            const normalArbeidstid = '20';
            const periode = {
                fom: new Date('2017-07-10'),
                tom: new Date('2017-07-20'),
            };
            expect(getStillingsprosent(antallTimerIArbeid, normalArbeidstid, periode)).to.equal(28);
        });

        it('Skal håndtere antallTimerIArbeid med , ', () => {
            const antallTimerIArbeid = '10,5';
            const normalArbeidstid = '20';
            const periode = {
                fom: new Date('2017-07-10'),
                tom: new Date('2017-07-20'),
            };
            expect(getStillingsprosent(antallTimerIArbeid, normalArbeidstid, periode)).to.equal(29);
        });


        it('Skal håndtere normalArbeidstid med , ', () => {
            const antallTimerIArbeid = '10';
            const normalArbeidstid = '20,5';
            const periode = {
                fom: new Date('2017-07-10'),
                tom: new Date('2017-07-20'),
            };
            expect(getStillingsprosent(antallTimerIArbeid, normalArbeidstid, periode)).to.equal(27);
        });

        it("Skal returnere stilingsprosent === undefined dersom antallTimerIArbeid === ''", () => {
            const antallTimerIArbeid = '';
            const normalArbeidstid = '20';
            const periode = {
                fom: new Date('2017-07-10'),
                tom: new Date('2017-07-20'),
            };
            expect(getStillingsprosent(antallTimerIArbeid, normalArbeidstid, periode)).to.equal(undefined);
        });

        it("Skal returnere stilingsprosent === undefined dersom normalArbeidstid === ''", () => {
            const antallTimerIArbeid = '10';
            const normalArbeidstid = '';
            const periode = {
                fom: new Date('2017-07-10'),
                tom: new Date('2017-07-20'),
            };
            expect(getStillingsprosent(antallTimerIArbeid, normalArbeidstid, periode)).to.equal(undefined);
        });

        it('Skal returnere stilingsprosent === undefined dersom sykmeldingsperioden varer i bare en helg', () => {
            const antallTimerIArbeid = '10';
            const normalArbeidstid = '37,5';
            const periode = {
                fom: new Date('2017-08-19'),
                tom: new Date('2017-08-20'),
            };
            expect(getStillingsprosent(antallTimerIArbeid, normalArbeidstid, periode)).to.equal(undefined);
        });

        it('Skal trekke fra virkedager i ferie og permisjon fra virkedager i perioden', () => {
            const antallTimerIArbeid = '10';
            const normalArbeidstid = '20';
            const periode = {
                fom: new Date('2017-07-10'),
                tom: new Date('2017-07-20'),
            };
            const ferieOgPermisjonPerioder = [{
                fom: new Date('2017-07-18'),
                tom: new Date('2017-07-20'),
            }];
            // I sum 6 virkedager
            expect(getStillingsprosent(antallTimerIArbeid, normalArbeidstid, periode, ferieOgPermisjonPerioder)).to.equal(42);
        });
    });
});
