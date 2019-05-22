import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import populerSoknadMedSvar, { populerSoknadMedSvarUtenKonvertertePerioder } from './populerSoknadMedSvar';
import { getNySoknadSelvstendig } from '../../../test/mock/mockSoknadSelvstendig';
import {
    ANDRE_INNTEKTSKILDER,
    ANSVARSERKLARING, FERIE,
    HVOR_MANGE_TIMER,
    HVOR_MYE_HAR_DU_JOBBET, INNTEKTSKILDE_ARBEIDSFORHOLD, INNTEKTSKILDE_ARBEIDSFORHOLD_ER_DU_SYKMELDT,
    JOBBET_DU_GRADERT, PERIODEUTLAND,
    TILBAKE_I_ARBEID,
    TILBAKE_NAR,
    UTLAND,
} from '../enums/tagtyper';
import { genererParseForCheckbox, genererParseForEnkeltverdi } from '../felleskomponenter/sporsmal/fieldUtils';
import { CHECKED, JA, NEI } from '../enums/svarEnums';
import { PERIODER } from '../enums/svartyper';
import { getSoknadUtland } from '../../../test/mock/mockSoknadUtland';
import mockNySoknadArbeidstaker from '../../../test/mock/mockNySoknadArbeidstaker';

chai.use(chaiEnzyme());
const expect = chai.expect;

const finnSporsmal = (sporsmalsliste, tag) => {
    return sporsmalsliste.reduce((acc, spm) => {
        const match = spm.tag === tag;
        return match
            ? [...acc, spm]
            : [...acc, ...finnSporsmal(spm.undersporsmal, tag)];
    }, []);
};

describe('populerSoknadMedSvar', () => {
    let soknad;
    let values;
    let parseEnkeltverdi;
    let parseCheckbox;

    beforeEach(() => {
        soknad = getNySoknadSelvstendig();
        values = {
            id: soknad.id,
        };
        parseEnkeltverdi = genererParseForEnkeltverdi();
        parseCheckbox = genererParseForCheckbox();
    });

    it('Skal populere checkbox-svar på nivå 1', () => {
        const jaSvar = parseCheckbox(true);
        values[ANSVARSERKLARING] = jaSvar;
        const populertSoknad = populerSoknadMedSvar(soknad, values);
        expect(populertSoknad.sporsmal[0].svar).to.deep.equal([
            {
                verdi: CHECKED,
            },
        ]);
    });

    it('Skal populere JA/NEI-svar på nivå 1', () => {
        const jaSvar = parseEnkeltverdi(JA);
        values[TILBAKE_I_ARBEID] = jaSvar;
        const populertSoknad = populerSoknadMedSvar(soknad, values);
        expect(populertSoknad.sporsmal[1].svar).to.deep.equal([
            {
                verdi: JA,
            },
        ]);
    });

    it('Når man har svart JA på et toppnivå-spørsmål, skal underspørsmål også populeres', () => {
        const toppnivaaSvar = parseEnkeltverdi(JA);
        const undersporsmalSvar = parseEnkeltverdi('25.03.2018');
        values[TILBAKE_I_ARBEID] = toppnivaaSvar;
        values[TILBAKE_NAR] = undersporsmalSvar;
        const populertSoknad = populerSoknadMedSvar(soknad, values);
        expect(populertSoknad.sporsmal[1].undersporsmal[0].svar).to.deep.equal([
            {
                verdi: '2018-03-25',
            },
        ]);
    });

    it('Når man har svart NEI på et toppnivå-spørsmål, skal underspørsmål ikke populeres selv om de er besvart', () => {
        const toppnivaaSvar = parseEnkeltverdi(NEI);
        const undersporsmalSvar = parseEnkeltverdi('25.03.2018');
        values[TILBAKE_I_ARBEID] = toppnivaaSvar;
        values[TILBAKE_NAR] = undersporsmalSvar;
        const populertSoknad = populerSoknadMedSvar(soknad, values);
        const tilbakeNarSporsmal = finnSporsmal(populertSoknad.sporsmal, TILBAKE_NAR)[0];
        expect(tilbakeNarSporsmal.svar).to.deep.equal([]);
    });

    it('Når man har svart JA på et toppnivå-spørsmål, skal underspørsmål også populeres, også når det er flere underspørsmål', () => {
        const sporsmalForDenneTesten = (s) => {
            return s.tag === `${JOBBET_DU_GRADERT}_1`;
        };
        const toppnivaaSvar = parseEnkeltverdi(JA);
        const undersporsmalSvar1 = parseEnkeltverdi('20');
        const undersporsmalSvar2 = parseEnkeltverdi('65');
        values[`${JOBBET_DU_GRADERT}_1`] = toppnivaaSvar;
        values[`${HVOR_MANGE_TIMER}_1`] = undersporsmalSvar1;
        values[`${HVOR_MYE_HAR_DU_JOBBET}_1`] = undersporsmalSvar2;
        const populertSoknad = populerSoknadMedSvar(soknad, values);
        const populerteUndersporsmal = populertSoknad.sporsmal.find(sporsmalForDenneTesten).undersporsmal;
        expect(populerteUndersporsmal[0].svar).to.deep.equal([
            {
                verdi: '20',
            },
        ]);
        expect(populerteUndersporsmal[1].svar).to.deep.equal([
            {
                verdi: '65',
            },
        ]);
    });

    it('Skal populere perioder', () => {
        const toppnivaaSvar = parseEnkeltverdi(JA);
        const undersporsmalSvar = [{
            fom: '20.03.2018',
            tom: '21.03.2018',
        }, {
            fom: '23.03.2018',
            tom: '23.03.2018',
        }];
        values[UTLAND] = toppnivaaSvar;
        values[PERIODER] = undersporsmalSvar;
        const populertSoknad = populerSoknadMedSvar(soknad, values);
        const periodesporsmal = populertSoknad.sporsmal[5].undersporsmal[0];
        expect(periodesporsmal.svar).to.deep.equal([{
            verdi: JSON.stringify({
                fom: '2018-03-20',
                tom: '2018-03-21',
            }),
        }, {
            verdi: JSON.stringify({
                fom: '2018-03-23',
                tom: '2018-03-23',
            }),
        }]);
        expect(periodesporsmal.min).to.equal('2018-05-20');
        expect(periodesporsmal.max).to.equal('2018-05-28');
    });

    it('Skal populere CHECKBOX_GRUPPE', () => {
        const toppnivaaSvar = parseEnkeltverdi(JA);
        const inntektskildeArbeidsforholdSvar = parseCheckbox(true);
        const sykmeldtFraArbeidsforholdSvar = parseEnkeltverdi(NEI);
        values[ANDRE_INNTEKTSKILDER] = toppnivaaSvar;
        values[INNTEKTSKILDE_ARBEIDSFORHOLD] = inntektskildeArbeidsforholdSvar;
        values[INNTEKTSKILDE_ARBEIDSFORHOLD_ER_DU_SYKMELDT] = sykmeldtFraArbeidsforholdSvar;
        const populertSoknad = populerSoknadMedSvar(soknad, values);
        const populertHarInntektskildeSporsmal = finnSporsmal(populertSoknad.sporsmal, ANDRE_INNTEKTSKILDER)[0];
        const populertHarInntektskildeArbeidsforholdSporsmal = finnSporsmal(populertSoknad.sporsmal, INNTEKTSKILDE_ARBEIDSFORHOLD)[0];
        const populertSykmeldtFraArbeidsforholdSporsmal = finnSporsmal(populertSoknad.sporsmal, INNTEKTSKILDE_ARBEIDSFORHOLD_ER_DU_SYKMELDT)[0];
        expect(populertHarInntektskildeSporsmal.svar).to.deep.equal([{
            verdi: JA,
        }]);
        expect(populertHarInntektskildeArbeidsforholdSporsmal.svar).to.deep.equal([{
            verdi: CHECKED,
        }]);
        expect(populertSykmeldtFraArbeidsforholdSporsmal.svar).to.deep.equal([{
            verdi: NEI,
        }]);
    });

    it('Skal populere DATO', () => {
        const toppnivaaSvar = parseEnkeltverdi(JA);
        const tilBakeNarSvar = genererParseForEnkeltverdi()('23.05.2018');
        values[TILBAKE_I_ARBEID] = toppnivaaSvar;
        values[TILBAKE_NAR] = tilBakeNarSvar;
        const populertSoknad = populerSoknadMedSvar(soknad, values);

        const populertDatoSporsmal = finnSporsmal(populertSoknad.sporsmal, TILBAKE_NAR)[0];
        expect(populertDatoSporsmal.svar).to.deep.equal([{
            verdi: '2018-05-23',
        }]);
    });

    it('Skal konvertere datoformater i MIN/MAX', () => {
        const toppnivaaSvar = parseEnkeltverdi(JA);
        const tilBakeNarSvar = parseEnkeltverdi('23.05.2018');
        values[TILBAKE_I_ARBEID] = toppnivaaSvar;
        values[TILBAKE_NAR] = tilBakeNarSvar;
        const populertSoknad = populerSoknadMedSvar(soknad, values);
        const undersporsmal = finnSporsmal(populertSoknad.sporsmal, TILBAKE_NAR)[0];
        expect(undersporsmal.min).to.equal('2018-05-20');
        expect(undersporsmal.max).to.equal('2018-05-28');
    });


    it('Skal gjøre alle min/max om til strenger, også for spørsmål som ikke er besvart', () => {
        const populertSoknad = populerSoknadMedSvar(soknad, values);
        const undersporsmal = finnSporsmal(populertSoknad.sporsmal, TILBAKE_NAR)[0];
        const utenlandssporsmal = finnSporsmal(populertSoknad.sporsmal, PERIODER)[0];
        expect(undersporsmal.min).to.equal('2018-05-20');
        expect(undersporsmal.max).to.equal('2018-05-28');
        expect(utenlandssporsmal.min).to.equal('2018-05-20');
        expect(utenlandssporsmal.max).to.equal('2018-05-28');
    });

    it('Skal funke selv om det ikke finnes svar for alle spørsmål', () => {
        const soknadUtland = getSoknadUtland();
        const valuesUtland = {
            [PERIODEUTLAND]: [{}],
        };
        populerSoknadMedSvar(soknadUtland, valuesUtland);
    });

    it('Skal populere RADIO_GRUPPE', () => {
        const arbeidstakersoknad = mockNySoknadArbeidstaker();
        const hentSporsmal = (sporsmalsliste, tag) => {
            return sporsmalsliste.find((s) => {
                return s.tag === tag;
            });
        };
        const toppnivaSporsmal = hentSporsmal(arbeidstakersoknad.sporsmal, 'JOBBET_DU_100_PROSENT_0');

        const undersporsmalHvorMangeTimerPerUkeNormalt = hentSporsmal(toppnivaSporsmal.undersporsmal, 'HVOR_MANGE_TIMER_PER_UKE_0');

        const underspormalHvorMyeHarDuJobbet = hentSporsmal(toppnivaSporsmal.undersporsmal, 'HVOR_MYE_HAR_DU_JOBBET_0');

        const undersporsmalHvorMyeTimer = hentSporsmal(underspormalHvorMyeHarDuJobbet.undersporsmal, 'HVOR_MYE_TIMER_0');

        const undersporsmalHvorMyeProsent = hentSporsmal(underspormalHvorMyeHarDuJobbet.undersporsmal, 'HVOR_MYE_PROSENT_0');

        const undersporsmalAntallTimerJobbet = hentSporsmal(undersporsmalHvorMyeTimer.undersporsmal, 'HVOR_MYE_TIMER_VERDI_0');

        const undersporsmalProsentJobbet = hentSporsmal(undersporsmalHvorMyeProsent.undersporsmal, 'HVOR_MYE_PROSENT_VERDI_0');

        values[toppnivaSporsmal.tag] = parseEnkeltverdi(JA);
        values[undersporsmalHvorMangeTimerPerUkeNormalt.tag] = parseEnkeltverdi('37,5');
        values[underspormalHvorMyeHarDuJobbet.tag] = parseEnkeltverdi('timer');
        values[undersporsmalHvorMyeTimer.tag] = parseEnkeltverdi('CHECKED');
        values[undersporsmalHvorMyeProsent.tag] = parseEnkeltverdi('');
        values[undersporsmalAntallTimerJobbet.tag] = parseEnkeltverdi('10');
        values[undersporsmalProsentJobbet.tag] = parseEnkeltverdi('35');

        const populertSoknad = populerSoknadMedSvar(arbeidstakersoknad, values);
        const populertUndersporsmalNormalJobbing = finnSporsmal(populertSoknad.sporsmal, 'HVOR_MANGE_TIMER_PER_UKE_0')[0];
        const populertUndersporsmalHvorMyeHarDuJobbet = finnSporsmal(populertSoknad.sporsmal, 'HVOR_MYE_HAR_DU_JOBBET_0')[0];
        const populertUndersporsmalSvarITimer = finnSporsmal(populertSoknad.sporsmal, 'HVOR_MYE_TIMER_0')[0];
        const populertUndersporsmalSvarIProsent = finnSporsmal(populertSoknad.sporsmal, 'HVOR_MYE_PROSENT_0')[0];
        const populertUndersporsmalAntallTimerJobbet = finnSporsmal(populertSoknad.sporsmal, 'HVOR_MYE_TIMER_VERDI_0')[0];
        const populertUndersporsmalProsentJobbet = finnSporsmal(populertSoknad.sporsmal, 'HVOR_MYE_PROSENT_VERDI_0')[0];

        expect(populertUndersporsmalNormalJobbing.svar).to.deep.equal([{
            verdi: '37,5',
        }]);
        expect(populertUndersporsmalHvorMyeHarDuJobbet.svar).to.deep.equal([]);
        expect(populertUndersporsmalAntallTimerJobbet.svar).to.deep.equal([{
            verdi: '10',
        }]);
        expect(populertUndersporsmalProsentJobbet.svar).to.deep.equal([]);

        expect(populertUndersporsmalSvarIProsent.svar).to.deep.equal([]);
        expect(populertUndersporsmalSvarITimer.svar).to.deep.equal([{
            verdi: CHECKED,
        }]);
    });

    describe('populerSoknadMedSvarUtenKonvertertePerioder', () => {
        it('Skal populere perioder', () => {
            const toppnivaaSvar = parseEnkeltverdi(JA);
            const undersporsmalSvar = [{
                fom: '20.03.2018',
                tom: '21.03.2018',
            }, {
                fom: '23.03.2018',
                tom: '23.03.2018',
            }];
            values[UTLAND] = toppnivaaSvar;
            values[PERIODER] = undersporsmalSvar;
            const populertSoknad = populerSoknadMedSvarUtenKonvertertePerioder(soknad, values);
            const periodesporsmal = finnSporsmal(populertSoknad.sporsmal, PERIODER)[0];
            expect(periodesporsmal.svar).to.deep.equal([{
                verdi: JSON.stringify({
                    fom: '20.03.2018',
                    tom: '21.03.2018',
                }),
            }, {
                verdi: JSON.stringify({
                    fom: '23.03.2018',
                    tom: '23.03.2018',
                }),
            }]);
            expect(periodesporsmal.min).to.equal('2018-05-20');
            expect(periodesporsmal.max).to.equal('2018-05-28');
        });

        it('Skal populere perioder når det bare er fylt ut fom', () => {
            const toppnivaaSvar = parseEnkeltverdi(JA);
            const undersporsmalSvar = [{
                fom: '20.03.2018',
            }];
            values[UTLAND] = toppnivaaSvar;
            values[PERIODER] = undersporsmalSvar;
            const populertSoknad = populerSoknadMedSvarUtenKonvertertePerioder(soknad, values);
            const periodesporsmal = finnSporsmal(populertSoknad.sporsmal, PERIODER)[0];
            expect(periodesporsmal.svar).to.deep.equal([{
                verdi: JSON.stringify({
                    fom: '20.03.2018',
                }),
            }]);
            expect(periodesporsmal.min).to.equal('2018-05-20');
            expect(periodesporsmal.max).to.equal('2018-05-28');
        });

        it('Skal whipe svar på underspørsmål dersom underspørsmål ikke er stilt', () => {
            const soknad2 = {
                sporsmal: [{
                    id: '2981',
                    tag: 'JOBBET_DU_100_PROSENT_0',
                    sporsmalstekst: 'I perioden 3. - 11. februar 2019 var du 100 % sykmeldt fra TESTBEDRIFT AS. Jobbet du noe i denne perioden?',
                    undertekst: null,
                    svartype: 'JA_NEI',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: 'JA',
                    svar: [{
                        verdi: 'NEI',
                    }],
                    undersporsmal: [{
                        id: '77023',
                        tag: 'HVOR_MANGE_TIMER_PER_UKE_0',
                        sporsmalstekst: 'Hvor mange timer jobbet du per uke før du ble sykmeldt?',
                        undertekst: 'timer per uke',
                        svartype: 'TALL',
                        min: 1,
                        max: 150,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    }, {
                        id: '32120',
                        tag: 'HVOR_MYE_HAR_DU_JOBBET_0',
                        sporsmalstekst: 'Hvor mye jobbet du totalt 3. - 11. februar 2019 hos TESTBEDRIFT AS?',
                        undertekst: null,
                        svartype: 'RADIO_GRUPPE_TIMER_PROSENT',
                        min: null,
                        max: null,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [{
                            id: '744',
                            tag: 'HVOR_MYE_PROSENT_0',
                            sporsmalstekst: 'prosent',
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
                                id: '6895',
                                tag: 'HVOR_MYE_PROSENT_VERDI_0',
                                sporsmalstekst: null,
                                undertekst: 'prosent',
                                svartype: 'TALL',
                                min: 1,
                                max: 99,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }, {
                            id: '65242',
                            tag: 'HVOR_MYE_TIMER_0',
                            sporsmalstekst: 'timer',
                            undertekst: null,
                            svartype: 'RADIO',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [],
                            undersporsmal: [{
                                id: '44673',
                                tag: 'HVOR_MYE_TIMER_VERDI_0',
                                sporsmalstekst: null,
                                undertekst: 'timer totalt',
                                svartype: 'TALL',
                                min: 1,
                                max: 193,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }],
                    }],
                }, {
                    id: '31265',
                    tag: 'FERIE_PERMISJON_UTLAND',
                    sporsmalstekst: 'Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 3. - 11. februar 2019?',
                    undertekst: null,
                    svartype: 'JA_NEI',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: true,
                    kriterieForVisningAvUndersporsmal: 'JA',
                    svar: [{
                        verdi: 'JA',
                    }],
                    undersporsmal: [{
                        id: '48120',
                        tag: 'FERIE_PERMISJON_UTLAND_HVA',
                        sporsmalstekst: 'Kryss av alt som gjelder deg:',
                        undertekst: null,
                        svartype: 'CHECKBOX_GRUPPE',
                        min: null,
                        max: null,
                        pavirkerAndreSporsmal: true,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [{
                            id: '38443',
                            tag: 'FERIE',
                            sporsmalstekst: 'Jeg tok ut ferie',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: true,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [{
                                verdi: 'CHECKED',
                            }],
                            undersporsmal: [{
                                id: '59364',
                                tag: 'FERIE_NAR',
                                sporsmalstekst: null,
                                undertekst: null,
                                svartype: 'PERIODER',
                                min: '2019-02-03T00:00:00.000Z',
                                max: '2019-02-11T00:00:00.000Z',
                                pavirkerAndreSporsmal: true,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [{
                                    verdi: '{"fom":"04.02.2019","tom":"11.02.2019"}',
                                }],
                                undersporsmal: [],
                            }],
                        }, {
                            id: '29533',
                            tag: 'PERMISJON',
                            sporsmalstekst: 'Jeg hadde permisjon',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [],
                            undersporsmal: [{
                                id: '36919',
                                tag: 'PERMISJON_NAR',
                                sporsmalstekst: null,
                                undertekst: null,
                                svartype: 'PERIODER',
                                min: '2019-02-03T00:00:00.000Z',
                                max: '2019-02-11T00:00:00.000Z',
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }, {
                            id: '52269',
                            tag: 'UTLAND',
                            sporsmalstekst: 'Jeg var utenfor Norge',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: true,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [],
                            undersporsmal: [{
                                id: '94743',
                                tag: 'UTLAND_NAR',
                                sporsmalstekst: null,
                                undertekst: null,
                                svartype: 'PERIODER',
                                min: '2019-02-03T00:00:00.000Z',
                                max: '2019-02-11T00:00:00.000Z',
                                pavirkerAndreSporsmal: true,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }, {
                                id: '59061',
                                tag: 'UTLANDSOPPHOLD_SOKT_SYKEPENGER',
                                sporsmalstekst: 'Har du søkt om å beholde sykepenger under dette oppholdet utenfor Norge?',
                                undertekst: null,
                                svartype: 'JA_NEI',
                                min: null,
                                max: null,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }],
                    }],
                }],
            };
            const verdier = {
                ANSVARSERKLARING: {
                    svarverdier: [{
                        verdi: 'CHECKED',
                    }],
                },
                EGENMELDINGER: {
                    svarverdier: [{
                        verdi: 'NEI',
                    }],
                },
                EGENMELDINGER_NAR: [{
                    fom: '01.02.2019',
                    tom: '02.02.2019',
                }, {
                    fom: '02.02.2019',
                    tom: '02.02.2019',
                }],
                TILBAKE_I_ARBEID: {
                    svarverdier: [{
                        verdi: 'NEI',
                    }],
                },
                JOBBET_DU_100_PROSENT_0: {
                    svarverdier: [{
                        verdi: 'NEI',
                    }],
                },
                HVOR_MYE_HAR_DU_JOBBET_0: {
                    svarverdier: [{
                        verdi: 'prosent',
                    }],
                },
                HVOR_MYE_PROSENT_0: {
                    svarverdier: [{
                        verdi: 'CHECKED',
                    }],
                },
                FERIE_PERMISJON_UTLAND: {
                    svarverdier: [{
                        verdi: 'NEI',
                    }],
                },
                FERIE: {
                    svarverdier: [{
                        verdi: 'CHECKED',
                    }],
                },
                FERIE_NAR: [{
                    fom: '04.02.2019',
                    tom: '11.02.2019',
                }],
                PERMISJON_NAR: [{}],
                UTLAND_NAR: [{}],
                ANDRE_INNTEKTSKILDER: {
                    svarverdier: [{
                        verdi: 'NEI',
                    }],
                },
                UTDANNING: {
                    svarverdier: [{
                        verdi: 'JA',
                    }],
                },
                UTDANNING_START: {
                    svarverdier: [{
                        verdi: '07.02.2019',
                    }],
                },
                FULLTIDSSTUDIUM: {
                    svarverdier: [{
                        verdi: 'JA',
                    }],
                },
            };
            const populertSoknad = populerSoknadMedSvarUtenKonvertertePerioder(soknad2, verdier);
            const harHattFerieSporsmal = finnSporsmal(populertSoknad.sporsmal, FERIE)[0];
            const harHattFerieNarSporsmal = finnSporsmal(populertSoknad.sporsmal, 'FERIE_NAR')[0];
            const jobbetDuProsent = finnSporsmal(populertSoknad.sporsmal, 'HVOR_MYE_PROSENT_0')[0];
            expect(harHattFerieNarSporsmal.svar).to.deep.equal([]);
            expect(harHattFerieSporsmal.svar).to.deep.equal([]);
            expect(jobbetDuProsent.svar).to.deep.equal([{
                verdi: 'CHECKED',
            }]);
        });
    });
});
