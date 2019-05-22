import chai from 'chai';
import {
    periodeErHelg,
    perioderErHelg,
    periodeOverlapperMedPerioder,
    perioderOverlapperMedPerioder,
    harOverlappendePerioder,
    antallVirkedagerIPeriode,
    antallVirkedagerIPerioder,
} from '../../js/utils/periodeUtils';

const expect = chai.expect;

describe('periodeUtils', () => {
    describe('periodeErHelg', () => {
        it('Returnerer true hvis perioden er en helg', () => {
            const periode = {
                fom: '16.07.2016',
                tom: '17.07.2016',
            };
            expect(periodeErHelg(periode)).to.equal(true);
        });

        it('Returnerer false hvis perioden er delvis en helg', () => {
            const periode = {
                fom: '16.07.2016',
                tom: '18.07.2016',
            };
            expect(periodeErHelg(periode)).to.equal(false);
        });

        it('Returnerer false hvis perioden er midt i uken', () => {
            const periode = {
                fom: '19.07.2016',
                tom: '20.07.2016',
            };
            expect(periodeErHelg(periode)).to.equal(false);
        });

        it('Returnerer false hvis perioden mangler tom', () => {
            const periode = {
                fom: '19.07.2016',
            };
            expect(periodeErHelg(periode)).to.equal(false);
        });

        it('Returnerer false hvis perioden mangler fom', () => {
            const periode = {
                tom: '19.07.2016',
            };
            expect(periodeErHelg(periode)).to.equal(false);
        });

        it('Returnerer true hvis perioden er Ã©n dag i en helg', () => {
            const periodeLordag = {
                fom: '16.07.2016',
                tom: '16.07.2016',
            };
            const periodeSondag = {
                fom: '17.07.2016',
                tom: '17.07.2016',
            };
            expect(periodeErHelg(periodeLordag)).to.equal(true);
            expect(periodeErHelg(periodeSondag)).to.equal(true);
        });

        it('Returnerer false hvis perioden er Ã©n dag utenfor en helg (mandag)', () => {
            const periodeMandag = {
                fom: '18.07.2016',
                tom: '18.07.2016',
            };
            expect(periodeErHelg(periodeMandag)).to.equal(false);
        });

        it('Returnerer false hvis perioden er Ã©n dag utenfor en helg (fredag)', () => {
            const periodeFredag = {
                fom: '22.07.2016',
                tom: '22.07.2016',
            };
            expect(periodeErHelg(periodeFredag)).to.equal(false);
        });

        it('Returnerer false hvis perioden starter og slutter pÃ¥ en helgedag men i forskjellig helg', () => {
            const periode = {
                fom: '16.07.2016',
                tom: '23.07.2016',
            };
            expect(periodeErHelg(periode)).to.equal(false);
        });

        it('Returnerer false hvis perioden verken har fom eller tom', () => {
            const periode = {};
            expect(periodeErHelg(periode)).to.equal(false);
        });
    });

    describe('perioderErHelg', () => {
        const periodeHelg = {
            fom: '16.07.2016',
            tom: '17.07.2016',
        };

        const periodeIkkeHelg = {
            fom: '16.07.2016',
            tom: '23.07.2016',
        };

        it('Returnerer true hvis det sendes inn Ã©n periode og den er helg', () => {
            const perioder = [periodeHelg];
            expect(perioderErHelg(perioder)).to.equal(true);
        });

        it('Returnerer false hvis det sendes inn Ã©n periode og den ikke er helg', () => {
            const perioder = [periodeIkkeHelg];
            expect(perioderErHelg(perioder)).to.equal(false);
        });

        it('Returnerer false hvis det sendes inn to perioder og bare den ene er helg', () => {
            const perioder = [periodeHelg, periodeIkkeHelg];
            expect(perioderErHelg(perioder)).to.equal(false);
        });

        it('Returnerer false hvis det sendes inn ingen perioder', () => {
            expect(perioderErHelg([])).to.equal(false);
        });

        it('Returnerer false hvis det sendes inn en tom periode', () => {
            expect(perioderErHelg([{}])).to.equal(false);
        });
    });

    describe('periodeOverlapperMedPerioder', () => {
        let periodeA;
        let periodeB;
        let periodeC;
        let periodeD;
        let periodeTom;
        let periodeFom;

        beforeEach(() => {
            periodeA = {
                fom: '12.12.2012',
                tom: '15.12.2012',
            };
            periodeB = {
                fom: '16.12.2012',
                tom: '20.12.2012',
            };
            periodeC = {
                fom: '21.12.2012',
                tom: '25.12.2012',
            };
            periodeD = {
                fom: '13.12.2012',
                tom: '23.12.2012',
            };
            periodeTom = {
                tom: '23.12.2012',
            };
            periodeFom = {
                fom: '23.12.2012',
            };
        });

        it('Returnerer true hvis perioden overlapper med periodene', () => {
            const perioder = [periodeA];
            expect(periodeOverlapperMedPerioder(periodeA, perioder)).to.equal(true);
        });

        it('Returnerer false hvis perioden ikke overlapper med periodene', () => {
            const perioder = [periodeB];
            expect(periodeOverlapperMedPerioder(periodeA, perioder)).to.equal(false);
        });

        it('Returnerer true hvis perioden overlapper med Ã©n av periodene', () => {
            const perioder = [periodeC, periodeD];
            expect(periodeOverlapperMedPerioder(periodeB, perioder)).to.equal(true);
        });

        it('Returnerer false hvis perioden er ugyldig', () => {
            const perioder = [periodeC, periodeD];
            expect(periodeOverlapperMedPerioder(periodeFom, perioder)).to.equal(false);
        });

        it('Returnerer false hvis en av periodene er ugyldig', () => {
            const perioder = [periodeTom, periodeD];
            expect(periodeOverlapperMedPerioder(periodeC, perioder)).to.equal(false);
        });

        it('Returnerer true hvis senesteTom i ene perioden er samme dag som tidligsteFom i første perioden', () => {
            const a = {
                fom: '01.02.2017',
                tom: '22.02.2017',
            };
            const b = {
                fom: '22.02.2017',
                tom: '25.02.2017',
            };
            expect(periodeOverlapperMedPerioder(a, [b])).to.equal(true);
        });

        it('Hjelpetest 1', () => {
            const a = {
                fom: '06.07.2016',
                tom: '09.07.2016',
            };
            const b = {
                fom: '07.07.2016',
                tom: '10.07.2016',
            };
            expect(periodeOverlapperMedPerioder(a, [b])).to.equal(true);
        });
    });

    describe('perioderOverlapperMedPerioder', () => {
        let periodeA;
        let periodeB;
        let periodeD;

        beforeEach(() => {
            periodeA = {
                fom: '12.12.2012',
                tom: '15.12.2012',
            };
            periodeB = {
                fom: '16.12.2012',
                tom: '20.12.2012',
            };
            periodeD = {
                fom: '13.12.2012',
                tom: '23.12.2012',
            };
        });

        it('Returnerer true hvis periodeneA overlapper med periodeneB', () => {
            expect(perioderOverlapperMedPerioder([periodeA], [periodeA])).to.equal(true);
        });

        it('Returnerer true hvis periodeneA er innenfor periodeneB', () => {
            expect(perioderOverlapperMedPerioder([periodeB], [periodeD])).to.equal(true);
        });

        it('Returnerer false hvis periodene ikke overlapper med periodene', () => {
            expect(perioderOverlapperMedPerioder([periodeA], [periodeB])).to.equal(false);
        });

        it('Returnerer true hvis periodene overlapper med en av periodene', () => {
            expect(perioderOverlapperMedPerioder([periodeB], [periodeD, periodeA])).to.equal(true);
        });

        it('Skal hÃ¥ndtere at det sendes inn undefined', () => {
            expect(perioderOverlapperMedPerioder(undefined, undefined)).to.equal(false);
            expect(perioderOverlapperMedPerioder(undefined, [periodeA])).to.equal(false);
            expect(perioderOverlapperMedPerioder([periodeA], undefined)).to.equal(false);
        });

        it('Skal hÃ¥ndtere at det sendes tomme perioder-array', () => {
            expect(perioderOverlapperMedPerioder([], [])).to.equal(false);
            expect(perioderOverlapperMedPerioder([], [periodeA])).to.equal(false);
            expect(perioderOverlapperMedPerioder([periodeA], [])).to.equal(false);
        });
    });

    describe('harOverlappendePerioder', () => {
        let periodeA;
        let periodeB;
        let periodeC;
        let periodeD;
        let periodeTom;
        let periodeFom;

        beforeEach(() => {
            periodeA = {
                fom: '12.12.2012',
                tom: '15.12.2012',
            };
            periodeB = {
                fom: '16.12.2012',
                tom: '20.12.2012',
            };
            periodeC = {
                fom: '21.12.2012',
                tom: '25.12.2012',
            };
            periodeD = {
                fom: '13.12.2012',
                tom: '23.12.2012',
            };
            periodeTom = {
                tom: '23.12.2012',
            };
            periodeFom = {
                fom: '23.12.2012',
            };
        });

        it('Skal returnere false hvis det bare sendes inn én periode', () => {
            const perioder = [periodeA];
            expect(harOverlappendePerioder(perioder)).to.equal(false);
        });


        it('Skal returnere false hvis det sendes inn perioder som ikke overlapper', () => {
            const perioder = [periodeA, periodeB];
            expect(harOverlappendePerioder(perioder)).to.equal(false);
        });

        it('Skal returnere true hvis det sendes inn perioder som delvis overlapper', () => {
            const perioder = [periodeC, periodeD, periodeB];
            expect(harOverlappendePerioder(perioder)).to.equal(true);
        });

        it('Skal returnere false hvis det sendes inn en gyldig og en ugyldig periode', () => {
            const perioder = [periodeC, periodeTom];
            expect(harOverlappendePerioder(perioder)).to.equal(false);
        });

        it('Skal returnere false hvis det sendes inn to ugyldige perioder', () => {
            const perioder = [periodeFom, periodeTom];
            expect(harOverlappendePerioder(perioder)).to.equal(false);
        });

        it('Skal returnere true hvis det sendes inn perioder som delvis overlapper og en ugyldig periode', () => {
            const perioder = [periodeC, periodeD, periodeB, periodeTom];
            expect(harOverlappendePerioder(perioder)).to.equal(true);
        });

        it('Skal returnere true hvis det sendes inn to overlappende perioder (2)', () => {
            const a = {
                fom: '06.07.2016',
                tom: '09.07.2016',
            };
            const b = {
                fom: '07.07.2016',
                tom: '10.07.2016',
            };
            const perioder = [a, b];
            expect(harOverlappendePerioder(perioder)).to.equal(true);
        });
    });

    describe('antallVirkedagerIPeriode()', () => {
        let mandag1;
        let mandag3;
        let fredag1;
        let sondag1;

        beforeEach(() => {
            mandag1 = new Date('2017-08-14');
            fredag1 = new Date('2017-08-18');
            sondag1 = new Date('2017-08-20');
            mandag3 = new Date('2017-08-28');
        });

        it('Skal returnere antall virkedager fra og med startdato til og med sluttdato', () => {
            const periode = {
                fom: mandag1,
                tom: fredag1,
            };
            expect(antallVirkedagerIPeriode(periode)).to.equal(5);
        });

        it('Skal returnere antall virkedager fra og med startdato til og med sluttdato når perioden inkluderer 1 helg', () => {
            const periode = {
                fom: mandag1,
                tom: sondag1,
            };
            expect(antallVirkedagerIPeriode(periode)).to.equal(5);
        });

        it('Skal returnere antall virkedager fra og med startdato til og med sluttdato når perioden inkluderer 2 helger', () => {
            const periode = {
                fom: mandag1,
                tom: mandag3,
            };
            expect(antallVirkedagerIPeriode(periode)).to.equal(11);
        });
    });

    describe('antallVirkedagerIPerioder', () => {
        let mandag1;
        let mandag3;
        let fredag1;
        let sondag1;
        let tirsdag1;

        beforeEach(() => {
            mandag1 = new Date('2017-08-14');
            tirsdag1 = new Date('2017-08-15');
            fredag1 = new Date('2017-08-18');
            sondag1 = new Date('2017-08-20');
            mandag3 = new Date('2017-08-28');
        });

        it('Skal returnere antall virkerdager i perioder som ikke overlapper', () => {
            // 5 dager
            const periode1 = {
                fom: mandag1,
                tom: fredag1,
            };

            // 6 dager
            const periode2 = {
                fom: sondag1,
                tom: mandag3,
            };

            const perioder = [periode1, periode2];
            expect(antallVirkedagerIPerioder(perioder)).to.equal(11);
        });

        it('Skal returnere antall virkedager i perioder som overlapper', () => {
            // 5 dager
            const periode1 = {
                fom: mandag1,
                tom: fredag1,
            };

            // 11 dager, men 5 av dem overlapper
            const periode2 = {
                fom: mandag1,
                tom: mandag3,
            };

            // 4 dager, men alle overlappoer med periode1
            const periode3 = {
                fom: tirsdag1,
                tom: fredag1,
            };

            const perioder = [periode1, periode2, periode3];
            expect(antallVirkedagerIPerioder(perioder)).to.equal(11);
        });

        it('Skal returnere antall virkedager i perioder som overlapper - uavhengig av rekkefølgen periodene sendes inn i', () => {
            // 5 virkedager
            const periode1 = {
                fom: new Date('2017-08-14'), // mandag1
                tom: new Date('2017-08-18'), // fredag1
                name: 'periode1',
            };

            // 11 virkedager, men 5 av dem overlapper
            const periode2 = {
                fom: new Date('2017-08-14'), // mandag1
                tom: new Date('2017-08-28'), // mandag3
                name: 'periode2',
            };

            // 4 virkedager, men alle overlapper med periode1
            const periode3 = {
                fom: new Date('2017-08-15'), // tirsdag1
                tom: new Date('2017-08-18'), // fredag1
                name: 'periode3',
            };

            // 6 virkedager, alle overlapper med periode 2
            const periode4 = {
                fom: new Date('2017-08-21'), // mandag2
                tom: new Date('2017-08-28'), // mandag3
                name: 'periode4',
            };

            const perioder = [periode4, periode2, periode1, periode3];
            expect(antallVirkedagerIPerioder(perioder)).to.equal(11);
        });

        it('Skal kun telle dager som er etter innsendt startdato', () => {
            const startdato = new Date('2017-08-15');

            // 4 virkedager er fom startdato
            const periode1 = {
                fom: new Date('2017-08-14'), // mandag1
                tom: new Date('2017-08-18'), // fredag1
                name: 'periode1',
            };

            // 11 virkedager, men 5 av dem overlapper
            const periode2 = {
                fom: new Date('2017-08-14'), // mandag1
                tom: new Date('2017-08-28'), // mandag3
                name: 'periode2',
            };

            // 4 virkedager, men alle overlapper med periode1
            const periode3 = {
                fom: new Date('2017-08-15'), // tirsdag1
                tom: new Date('2017-08-18'), // fredag1
                name: 'periode3',
            };

            // 6 virkedager, alle overlapper med periode 2
            const periode4 = {
                fom: new Date('2017-08-21'), // mandag2
                tom: new Date('2017-08-28'), // mandag3
                name: 'periode4',
            };

            const perioder = [periode4, periode2, periode1, periode3];
            expect(antallVirkedagerIPerioder(perioder, startdato)).to.equal(10);
        });
    });
});
