import fraBackendsoknadTilInitiellSoknad from './fraBackendsoknadTilInitiellSoknad';
import mockLagretSoknad from '../../../test/mock/mockLagretSoknad';
import expect from '../../../test/expect';
import {
    ARBEIDSGIVER,
    BEKREFT_OPPLYSNINGER_UTLAND,
    PERIODEUTLAND,
    SYKMELDINGSGRAD,
} from '../enums/tagtyper';
import { LAND } from '../enums/svartyper';

describe('fraBackendsoknadTilInitiellSoknad', () => {
    it('Skal mappe perioder på norsk format', () => {
        const initiellSoknad = fraBackendsoknadTilInitiellSoknad(mockLagretSoknad());
        expect(initiellSoknad[PERIODEUTLAND]).to.deep.equal([{
            fom: '01.09.2018',
            tom: '01.10.2018',
        }, {
            fom: '12.08.207_',
            tom: '12.08.2017',
        }]);
    });

    it('Skal mappe perioder på ISO-format', () => {
        const initiellSoknad = fraBackendsoknadTilInitiellSoknad(mockLagretSoknad({
            sporsmal: [{
                id: '55',
                tag: 'PERIODEUTLAND',
                sporsmalstekst: 'Når skal du være utenfor Norge?',
                undertekst: null,
                svartype: 'PERIODER',
                min: '2018-06-03',
                max: '2019-03-03',
                kriterieForVisningAvUndersporsmal: null,
                svar: [
                    {
                        verdi: '{"fom":"01.02.20__","tom":"01.03.2017"}',
                    },
                ],
                undersporsmal: [],
            }],
        }));
        expect(initiellSoknad[PERIODEUTLAND]).to.deep.equal([{
            fom: '01.02.20__',
            tom: '01.03.2017',
        }]);
    });

    it('Skal mappe uferdige perioder ', () => {
        const initiellSoknad = fraBackendsoknadTilInitiellSoknad(mockLagretSoknad({
            sporsmal: [{
                id: '55',
                tag: 'PERIODEUTLAND',
                sporsmalstekst: 'Når skal du være utenfor Norge?',
                undertekst: null,
                svartype: 'PERIODER',
                min: '2018-06-03',
                max: '2019-03-03',
                kriterieForVisningAvUndersporsmal: null,
                svar: [
                    {
                        verdi: '{"fom":"2018-09-10","tom":"2018-09-20"}',
                    },
                ],
                undersporsmal: [],
            }],
        }));
        expect(initiellSoknad[PERIODEUTLAND]).to.deep.equal([{
            fom: '10.09.2018',
            tom: '20.09.2018',
        }]);
    });

    it('Skal opprette en tom periode når det ikke finnes perioder', () => {
        const initiellSoknad = fraBackendsoknadTilInitiellSoknad(mockLagretSoknad({
            sporsmal: [{
                id: '55',
                tag: 'PERIODEUTLAND',
                sporsmalstekst: 'Når skal du være utenfor Norge?',
                undertekst: null,
                svartype: 'PERIODER',
                min: '2018-06-03',
                max: '2019-03-03',
                kriterieForVisningAvUndersporsmal: null,
                svar: [],
                undersporsmal: [],
            }],
        }));
        expect(initiellSoknad[PERIODEUTLAND]).to.deep.equal([{}]);
    });

    it('Skal mappe fritekst', () => {
        const initiellSoknad = fraBackendsoknadTilInitiellSoknad(mockLagretSoknad());
        expect(initiellSoknad[LAND]).to.deep.equal({
            svarverdier: [{
                verdi: 'Oslo',
            }],
        });
    });

    it('Skal mappe land', () => {
        const lagretSoknadMedLand = mockLagretSoknad();
        lagretSoknadMedLand.sporsmal[1].svartype = LAND;
        lagretSoknadMedLand.sporsmal[1].svar = [{
            verdi: 'Norge',
        }, {
            verdi: 'Sverige',
        }];
        const initiellSoknad = fraBackendsoknadTilInitiellSoknad(lagretSoknadMedLand);
        expect(initiellSoknad[LAND]).to.deep.equal({
            svarverdier: [{
                verdi: 'Norge',
            }, {
                verdi: 'Sverige',
            }],
        });
    });

    it('Skal mappe JA_NEI', () => {
        const initiellSoknad = fraBackendsoknadTilInitiellSoknad(mockLagretSoknad());
        expect(initiellSoknad[ARBEIDSGIVER]).to.deep.equal({
            svarverdier: [{
                verdi: 'JA',
            }],
        });
    });

    it('Skal mappe CHECKBOX_PANEL', () => {
        const initiellSoknad = fraBackendsoknadTilInitiellSoknad(mockLagretSoknad());
        expect(initiellSoknad[BEKREFT_OPPLYSNINGER_UTLAND]).to.deep.equal({
            svarverdier: [{
                verdi: 'CHECKED',
            }],
        });
    });

    it('Skal mappe underspørsmål', () => {
        const initiellSoknad = fraBackendsoknadTilInitiellSoknad(mockLagretSoknad());
        expect(initiellSoknad[SYKMELDINGSGRAD]).to.deep.equal({
            svarverdier: [{
                verdi: 'JA',
            }],
        });
    });

    it('Skal mappe underspørsmål til RADIO_GRUPPE_TIMER_PROSENT', () => {
        const soknad = {
            sporsmal: [{
                id: '59320',
                tag: 'JOBBET_DU_100_PROSENT_0',
                sporsmalstekst: 'I perioden 2. - 21. januar 2019 var du 100 % sykmeldt fra TESTBEDRIFT. Jobbet du noe i denne perioden?',
                undertekst: null,
                svartype: 'JA_NEI',
                min: null,
                max: null,
                pavirkerAndreSporsmal: false,
                kriterieForVisningAvUndersporsmal: 'JA',
                svar: [],
                undersporsmal: [
                    {
                        id: '59321',
                        tag: 'HVOR_MANGE_TIMER_PER_UKE_0',
                        sporsmalstekst: 'Hvor mange timer jobbet du per uke før du ble sykmeldt?',
                        undertekst: 'timer per uke',
                        svartype: 'TALL',
                        min: '1',
                        max: '150',
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    },
                    {
                        id: '59322',
                        tag: 'HVOR_MYE_HAR_DU_JOBBET_0',
                        sporsmalstekst: 'Hvor mye jobbet du totalt 2. - 21. januar 2019 hos Min arbeidsgiver?',
                        undertekst: null,
                        svartype: 'RADIO_GRUPPE_TIMER_PROSENT',
                        min: null,
                        max: null,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [
                            {
                                id: '59323',
                                tag: 'HVOR_MYE_PROSENT_0',
                                sporsmalstekst: 'prosent',
                                undertekst: null,
                                svartype: 'RADIO',
                                min: null,
                                max: null,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: 'CHECKED',
                                svar: [
                                    {
                                        verdi: 'CHECKED',
                                    },
                                ],
                                undersporsmal: [
                                    {
                                        id: '59324',
                                        tag: 'HVOR_MYE_PROSENT_VERDI_0',
                                        sporsmalstekst: null,
                                        undertekst: 'prosent',
                                        svartype: 'TALL',
                                        min: '1',
                                        max: '99',
                                        pavirkerAndreSporsmal: false,
                                        kriterieForVisningAvUndersporsmal: null,
                                        svar: [],
                                        undersporsmal: [],
                                    },
                                ],
                            },
                            {
                                id: '59325',
                                tag: 'HVOR_MYE_TIMER_0',
                                sporsmalstekst: 'timer',
                                undertekst: null,
                                svartype: 'RADIO',
                                min: null,
                                max: null,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: 'CHECKED',
                                svar: [],
                                undersporsmal: [
                                    {
                                        id: '59326',
                                        tag: 'HVOR_MYE_TIMER_VERDI_0',
                                        sporsmalstekst: null,
                                        undertekst: 'timer totalt',
                                        svartype: 'TALL',
                                        min: '1',
                                        max: '429',
                                        pavirkerAndreSporsmal: false,
                                        kriterieForVisningAvUndersporsmal: null,
                                        svar: [],
                                        undersporsmal: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            }],
        };
        const initiellSoknad = fraBackendsoknadTilInitiellSoknad(soknad);
        expect(initiellSoknad.HVOR_MYE_HAR_DU_JOBBET_0.svarverdier).to.deep.equal([{ verdi: 'prosent' }]);
    });

    it('Skal mappe RADIO_GRUPPE_TIMER_PROSENT når underspørsmål er besvart med svar nr. 2', () => {
        const soknad = {
            sporsmal: [{
                id: '90601',
                tag: 'JOBBET_DU_100_PROSENT_0',
                sporsmalstekst: 'I perioden 13. - 14. februar 2019 var du 100 % sykmeldt fra VANN- OG AVLØPSETATEN. Jobbet du noe i denne perioden?',
                undertekst: null,
                svartype: 'JA_NEI',
                min: null,
                max: null,
                pavirkerAndreSporsmal: false,
                kriterieForVisningAvUndersporsmal: 'JA',
                svar: [{
                    verdi: 'JA',
                }],
                undersporsmal: [{
                    id: '90602',
                    tag: 'HVOR_MANGE_TIMER_PER_UKE_0',
                    sporsmalstekst: 'Hvor mange timer jobbet du per uke før du ble sykmeldt?',
                    undertekst: 'timer per uke',
                    svartype: 'TALL',
                    min: '1',
                    max: '150',
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [{
                        verdi: '37',
                    }],
                    undersporsmal: [],
                }, {
                    id: '90603',
                    tag: 'HVOR_MYE_HAR_DU_JOBBET_0',
                    sporsmalstekst: 'Hvor mye jobbet du totalt 13. - 14. februar 2019 hos VANN- OG AVLØPSETATEN?',
                    undertekst: null,
                    svartype: 'RADIO_GRUPPE_TIMER_PROSENT',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [],
                    undersporsmal: [{
                        id: '90604',
                        tag: 'HVOR_MYE_PROSENT_0',
                        sporsmalstekst: 'prosent',
                        undertekst: null,
                        svartype: 'RADIO',
                        min: null,
                        max: null,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: 'CHECKED',
                        svar: [],
                        undersporsmal: [{
                            id: '90605',
                            tag: 'HVOR_MYE_PROSENT_VERDI_0',
                            sporsmalstekst: null,
                            undertekst: 'prosent',
                            svartype: 'TALL',
                            min: '1',
                            max: '99',
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: null,
                            svar: [],
                            undersporsmal: [],
                        }],
                    }, {
                        id: '90606',
                        tag: 'HVOR_MYE_TIMER_0',
                        sporsmalstekst: 'timer',
                        undertekst: null,
                        svartype: 'RADIO',
                        min: null,
                        max: null,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: 'CHECKED',
                        svar: [{
                            verdi: 'CHECKED',
                        }],
                        undersporsmal: [{
                            id: '90607',
                            tag: 'HVOR_MYE_TIMER_VERDI_0',
                            sporsmalstekst: null,
                            undertekst: 'timer totalt',
                            svartype: 'TALL',
                            min: '1',
                            max: '43',
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: null,
                            svar: [{
                                verdi: '3',
                            }],
                            undersporsmal: [],
                        }],
                    }],
                }],
            }],
        };
        const initiellSoknad = fraBackendsoknadTilInitiellSoknad(soknad);
        expect(initiellSoknad.HVOR_MYE_HAR_DU_JOBBET_0.svarverdier).to.deep.equal([{ verdi: 'timer' }]);
    });
});
