import chai from 'chai';
import { parseSoknad } from '../../sykepengesoknad/data/soknader/soknader';
import { sorterEtterOpprettetDato, sorterEtterPerioder, sorterEtterSendtDato } from './sorterSoknader';

const expect = chai.expect;

describe('sykepengesoknadUtils', () => {
    let soknad1;
    let soknad2;
    let soknad3;
    let soknad4;
    let soknad5;
    let sendtSoknadUtland;
    let ikkeSendtSoknadUtland;
    let sendtSoknadUtlandMedFlerePerioder;
    let data;

    beforeEach(() => {
        soknad1 = {
            id: '1',
            status: 'KORRIGERT',
            sendtTilNAVDato: new Date('2017-02-04'),
            opprettetDato: new Date('2017-04-01'),
            fom: new Date('2017-05-01'),
            tom: new Date('2017-06-01'),
        };

        soknad2 = {
            id: '2',
            status: 'SENDT',
            sendtTilNAVDato: new Date('2017-02-06'),
            sendtTilArbeidsgiverDato: new Date('2017-02-08'),
            opprettetDato: new Date('2017-03-01'),
            fom: new Date('2017-04-01'),
            tom: new Date('2017-04-20'),
        };

        soknad3 = {
            id: '3',
            korrigerer: '1',
            status: 'KORRIGERT',
            sendtTilNAVDato: new Date('2017-02-05'),
            sendtTilArbeidsgiverDato: new Date('2017-02-10'),
            opprettetDato: new Date('2017-07-01'),
            fom: new Date('2017-10-01'),
            tom: new Date('2017-10-12'),
        };

        soknad4 = {
            id: '4',
            korrigerer: '3',
            status: 'SENDT',
            sendtTilNAVDato: new Date('2017-02-08'),
            sendtTilArbeidsgiverDato: new Date('2017-02-11'),
            opprettetDato: new Date('2017-02-01'),
            fom: new Date('2016-08-13'),
            tom: new Date('2016-08-19'),
        };

        soknad5 = {
            id: '5',
            status: 'NY',
            sendtTilArbeidsgiverDato: new Date('2017-02-01'),
            opprettetDato: new Date('2017-10-01'),
            fom: new Date('2017-05-01'),
            tom: new Date('2017-06-10'),
        };

        sendtSoknadUtland = parseSoknad({
            status: 'SENDT',
            soknadstype: 'OPPHOLD_UTLAND',
            sporsmal: [
                {
                    id: '24869',
                    tag: 'PERIODEUTLAND',
                    sporsmalstekst: 'Når skal du være utenfor Norge?',
                    undertekst: null,
                    svartype: 'PERIODER',
                    min: '2018-07-22',
                    max: '2019-04-22',
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [
                        {
                            verdi: '{"fom":"2015-08-01","tom":"2017-10-10"}',
                        },
                    ],
                    undersporsmal: [],
                },
            ],
        });

        sendtSoknadUtlandMedFlerePerioder = parseSoknad({
            status: 'SENDT',
            soknadstype: 'OPPHOLD_UTLAND',
            sporsmal: [
                {
                    id: '24869',
                    tag: 'PERIODEUTLAND',
                    sporsmalstekst: 'Når skal du være utenfor Norge?',
                    undertekst: null,
                    svartype: 'PERIODER',
                    min: '2018-07-22',
                    max: '2019-04-22',
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [
                        {
                            verdi: '{"fom":"2013-01-01","tom":"2013-01-02"}',
                        },
                        {
                            verdi: '{"fom":"2015-08-01","tom":"2017-10-10"}',
                        },
                    ],
                    undersporsmal: [],
                },
            ],
        });

        ikkeSendtSoknadUtland = parseSoknad({
            status: 'NY',
            soknadstype: 'OPPHOLD_UTLAND',
            opprettetDato: '2017-10-09',
            sporsmal: [
                {
                    id: '24869',
                    tag: 'PERIODEUTLAND',
                    sporsmalstekst: 'Når skal du være utenfor Norge?',
                    undertekst: null,
                    svartype: 'PERIODER',
                    min: '2018-07-22',
                    max: '2019-04-22',
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [],
                    undersporsmal: [],
                },
            ],
        });
    });


    describe('sorterEtterPerioder', () => {
        beforeEach(() => {
            data = [soknad1, soknad2, soknad3, soknad4];
        });

        it('Skal sortere etter periodene med perioden lengst frem i tid først', () => {
            const res = data.sort(sorterEtterPerioder);
            expect(res).to.deep.equal([soknad3, soknad1, soknad2, soknad4]);
        });

        it('Skal sortere etter periodene med perioden lengst frem i tid først', () => {
            data = [soknad2, soknad4, soknad1, soknad3];
            const res = data.sort(sorterEtterPerioder);
            expect(res).to.deep.equal([soknad3, soknad1, soknad2, soknad4]);
        });

        it('Skal sortere SENDT utenlandssøknad etter perioden', () => {
            data = [soknad1, soknad2, soknad3, soknad4, sendtSoknadUtland];
            const res = data.sort(sorterEtterPerioder);
            expect(res).to.deep.equal([soknad3, sendtSoknadUtland, soknad1, soknad2, soknad4]);
        });

        it('Skal sortere ikke sendt utenlandssøknad etter opprettetDato', () => {
            data = [soknad1, soknad2, soknad3, soknad4, sendtSoknadUtland, ikkeSendtSoknadUtland];
            const res = data.sort(sorterEtterPerioder);
            expect(res).to.deep.equal([soknad3, sendtSoknadUtland, ikkeSendtSoknadUtland, soknad1, soknad2, soknad4]);
        });

        it('Skal sortere sendt utenlandssøknad med flere perioder etter seneste tom', () => {
            data = [soknad1, soknad2, soknad3, soknad4, sendtSoknadUtlandMedFlerePerioder, ikkeSendtSoknadUtland];
            const res = data.sort(sorterEtterPerioder);
            expect(res).to.deep.equal([soknad3, sendtSoknadUtlandMedFlerePerioder, ikkeSendtSoknadUtland, soknad1, soknad2, soknad4]);
        });
    });

    describe('sorterEtterSendtDato', () => {
        beforeEach(() => {
            data = [soknad1, soknad2, soknad3, soknad4, soknad5];
        });

        it('Skal sortere etter tidligste datoer', () => {
            const res = data.sort(sorterEtterSendtDato);
            expect(res).to.deep.equal([soknad4, soknad2, soknad3, soknad1, soknad5]);
        });
    });

    describe('sorterEtterOpprettetDato', () => {
        beforeEach(() => {
            data = [soknad1, soknad2, soknad3, soknad4, soknad5];
        });

        it('Skal sortere etter opprettetDato, med den tidligst opprettede søknaden først', () => {
            const res = data.sort(sorterEtterOpprettetDato);
            expect(res).to.deep.equal([soknad4, soknad2, soknad1, soknad3, soknad5]);
        });

        it('Hvis to søknader har samme opprettetDato, skal det sorteres etter FOM', () => {
            const soknad6 = {
                ...soknad2,
                fom: new Date('2017-01-18'),
            };

            const soknad7 = {
                ...soknad2,
                fom: new Date('2017-01-10'),
            };
            data = [soknad1, soknad3, soknad4, soknad5, soknad6, soknad7];
            const res = data.sort(sorterEtterOpprettetDato);
            expect(res).to.deep.equal([soknad4, soknad7, soknad6, soknad1, soknad3, soknad5]);
        });
    });
});
