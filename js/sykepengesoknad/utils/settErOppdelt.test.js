import chai from 'chai';
import deepFreeze from 'deep-freeze';
import chaiEnzyme from 'chai-enzyme';
import getSykmelding from '../../../test/mock/mockSykmeldinger';
import { settErOppdelt } from './settErOppdelt';
import { getParsetSoknad } from '../../../test/mock/mockSykepengesoknader';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('soknadSelvstendigUtils', () => {
    describe('settErOppdelt', () => {
        it('Skal sette _erOppdelt = true hvis søknaden er oppdelt', () => {
            const sykmelding = getSykmelding({
                id: '1',
                mulighetForArbeid: {
                    perioder: [{
                        fom: new Date('2018-01-01'),
                        tom: new Date('2018-02-01'),
                    }, {
                        fom: new Date('2018-02-02'),
                        tom: new Date('2018-02-17'),
                    }],
                },
            });
            const soknad = getParsetSoknad({
                sykmeldingId: '1',
                fom: new Date('2018-01-01'),
                tom: new Date('2018-01-17'),
            });
            const oppdeltSoknad = settErOppdelt(deepFreeze(soknad), deepFreeze(sykmelding));
            expect(oppdeltSoknad._erOppdelt).to.equal(true);
        });

        it('Skal sette _erOppdelt = false hvis søknaden ikke er oppdelt', () => {
            const sykmelding = getSykmelding({
                id: '1',
                mulighetForArbeid: {
                    perioder: [{
                        fom: new Date('2018-01-01'),
                        tom: new Date('2018-01-05'),
                    }, {
                        fom: new Date('2018-01-06'),
                        tom: new Date('2018-01-10'),
                    }],
                },
            });
            const soknad = getParsetSoknad({
                sykmeldingId: '1',
                fom: new Date('2018-01-01'),
                tom: new Date('2018-01-10'),
            });
            const oppdeltSoknad = settErOppdelt(deepFreeze(soknad), deepFreeze(sykmelding));
            expect(oppdeltSoknad._erOppdelt).to.equal(false);
        });

        it('Skal sette _erOppdelt = false hvis søknaden ikke har noe sykmelding', () => {
            const sykmelding = undefined;
            const soknad = getParsetSoknad({
                sykmeldingId: '1',
                fom: new Date('2018-01-01'),
                tom: new Date('2018-01-10'),
            });
            const oppdeltSoknad = settErOppdelt(deepFreeze(soknad), sykmelding);
            expect(oppdeltSoknad._erOppdelt).to.equal(false);
        });
    });
});
