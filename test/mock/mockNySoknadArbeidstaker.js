import { parseSoknad } from '../../js/sykepengesoknad/data/soknader/soknader';

/* eslint-disable max-len */
export const nySoknadArbeidstaker = {
    id: '05cf3a4a-16b1-4cd7-8096-de03964f5295',
    aktorId: '1328256131648',
    sykmeldingId: '6f4c99ed-7202-4ac0-8abe-879874feed05',
    soknadstype: 'ARBEIDSTAKERE',
    status: 'NY',
    fom: '2019-02-03',
    tom: '2019-02-11',
    opprettetDato: '2019-02-12',
    innsendtDato: null,
    sendtTilNAVDato: null,
    sendtTilArbeidsgiverDato: null,
    avbruttDato: null,
    startSykeforlop: '2019-02-03',
    sykmeldingUtskrevet: '2019-02-03',
    arbeidsgiver: {
        navn: 'Min arbeidsgiver',
        orgnummer: '999777666',
    },
    korrigerer: null,
    korrigertAv: null,
    arbeidssituasjon: 'ARBEIDSTAKER',
    soknadPerioder: [
        {
            fom: '2019-02-03',
            tom: '2019-02-11',
            grad: 100,
        },
    ],
    sporsmal: [
        {
            id: '59659',
            tag: 'ANSVARSERKLARING',
            sporsmalstekst: 'Jeg vet at dersom jeg gir uriktige opplysninger, eller holder tilbake opplysninger som har betydning for min rett til sykepenger, kan pengene holdes tilbake eller kreves tilbake, og/eller det kan medføre straffeansvar. Jeg er også klar over at jeg må melde fra til NAV dersom jeg i sykmeldingsperioden satt i varetekt, sonet straff eller var under forvaring.',
            undertekst: null,
            svartype: 'CHECKBOX_PANEL',
            min: null,
            max: null,
            pavirkerAndreSporsmal: false,
            kriterieForVisningAvUndersporsmal: null,
            svar: [

            ],
            undersporsmal: [

            ],
        },
        {
            id: '59660',
            tag: 'EGENMELDINGER',
            sporsmalstekst: 'Vi har registrert at du ble sykmeldt søndag 3. februar 2019. Brukte du egenmeldinger og/eller var du sykmeldt i perioden 18. januar - 2. februar 2019?',
            undertekst: null,
            svartype: 'JA_NEI',
            min: null,
            max: null,
            pavirkerAndreSporsmal: false,
            kriterieForVisningAvUndersporsmal: 'JA',
            svar: [

            ],
            undersporsmal: [
                {
                    id: '59661',
                    tag: 'EGENMELDINGER_NAR',
                    sporsmalstekst: 'Hvilke dager før 3. februar 2019 var du borte fra jobb?',
                    undertekst: null,
                    svartype: 'PERIODER',
                    min: '2018-08-03',
                    max: '2019-02-02',
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [

                    ],
                    undersporsmal: [

                    ],
                },
            ],
        },
        {
            id: '59662',
            tag: 'TILBAKE_I_ARBEID',
            sporsmalstekst: 'Var du tilbake i fullt arbeid hos Min arbeidsgiver før 12. februar 2019?',
            undertekst: null,
            svartype: 'JA_NEI',
            min: null,
            max: null,
            pavirkerAndreSporsmal: false,
            kriterieForVisningAvUndersporsmal: 'JA',
            svar: [

            ],
            undersporsmal: [
                {
                    id: '59663',
                    tag: 'TILBAKE_NAR',
                    sporsmalstekst: 'Fra hvilken dato ble arbeidet gjenopptatt?',
                    undertekst: null,
                    svartype: 'DATO',
                    min: '2019-02-03',
                    max: '2019-02-11',
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [

                    ],
                    undersporsmal: [

                    ],
                },
            ],
        },
        {
            id: '59664',
            tag: 'JOBBET_DU_100_PROSENT_0',
            sporsmalstekst: 'I perioden 3. - 11. februar 2019 var du 100 % sykmeldt fra Min arbeidsgiver. Jobbet du noe i denne perioden?',
            undertekst: null,
            svartype: 'JA_NEI',
            min: null,
            max: null,
            pavirkerAndreSporsmal: false,
            kriterieForVisningAvUndersporsmal: 'JA',
            svar: [

            ],
            undersporsmal: [
                {
                    id: '59665',
                    tag: 'HVOR_MANGE_TIMER_PER_UKE_0',
                    sporsmalstekst: 'Hvor mange timer jobbet du per uke før du ble sykmeldt?',
                    undertekst: 'timer per uke',
                    svartype: 'TALL',
                    min: '1',
                    max: '150',
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [

                    ],
                    undersporsmal: [

                    ],
                },
                {
                    id: '59666',
                    tag: 'HVOR_MYE_HAR_DU_JOBBET_0',
                    sporsmalstekst: 'Hvor mye jobbet du totalt 3. - 11. februar 2019 hos Min arbeidsgiver?',
                    undertekst: null,
                    svartype: 'RADIO_GRUPPE_TIMER_PROSENT',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [

                    ],
                    undersporsmal: [
                        {
                            id: '59667',
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
                                    id: '59668',
                                    tag: 'HVOR_MYE_PROSENT_VERDI_0',
                                    sporsmalstekst: null,
                                    undertekst: 'prosent',
                                    svartype: 'TALL',
                                    min: '1',
                                    max: '99',
                                    pavirkerAndreSporsmal: false,
                                    kriterieForVisningAvUndersporsmal: null,
                                    svar: [

                                    ],
                                    undersporsmal: [

                                    ],
                                },
                            ],
                        },
                        {
                            id: '59669',
                            tag: 'HVOR_MYE_TIMER_0',
                            sporsmalstekst: 'timer',
                            undertekst: null,
                            svartype: 'RADIO',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [

                            ],
                            undersporsmal: [
                                {
                                    id: '59670',
                                    tag: 'HVOR_MYE_TIMER_VERDI_0',
                                    sporsmalstekst: null,
                                    undertekst: 'timer totalt',
                                    svartype: 'TALL',
                                    min: '1',
                                    max: '193',
                                    pavirkerAndreSporsmal: false,
                                    kriterieForVisningAvUndersporsmal: null,
                                    svar: [

                                    ],
                                    undersporsmal: [

                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: '59664',
            tag: 'JOBBET_DU_GRADERT_1',
            sporsmalstekst: 'I perioden 3. - 11. februar 2019 var du 40 % sykmeldt fra Min arbeidsgiver. Jobbet du noe i denne perioden?',
            undertekst: null,
            svartype: 'JA_NEI',
            min: null,
            max: null,
            pavirkerAndreSporsmal: false,
            kriterieForVisningAvUndersporsmal: 'JA',
            svar: [

            ],
            undersporsmal: [
                {
                    id: '59665',
                    tag: 'HVOR_MANGE_TIMER_PER_UKE_1',
                    sporsmalstekst: 'Hvor mange timer jobbet du per uke før du ble sykmeldt?',
                    undertekst: 'timer per uke',
                    svartype: 'TALL',
                    min: '1',
                    max: '150',
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [

                    ],
                    undersporsmal: [

                    ],
                },
                {
                    id: '59666',
                    tag: 'HVOR_MYE_HAR_DU_JOBBET_1',
                    sporsmalstekst: 'Hvor mye jobbet du totalt 3. - 11. februar 2019 hos Min arbeidsgiver?',
                    undertekst: null,
                    svartype: 'RADIO_GRUPPE_TIMER_PROSENT',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [

                    ],
                    undersporsmal: [
                        {
                            id: '59667',
                            tag: 'HVOR_MYE_PROSENT_1',
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
                                    id: '59668',
                                    tag: 'HVOR_MYE_PROSENT_VERDI_1',
                                    sporsmalstekst: null,
                                    undertekst: 'prosent',
                                    svartype: 'TALL',
                                    min: '1',
                                    max: '99',
                                    pavirkerAndreSporsmal: false,
                                    kriterieForVisningAvUndersporsmal: null,
                                    svar: [

                                    ],
                                    undersporsmal: [

                                    ],
                                },
                            ],
                        },
                        {
                            id: '59669',
                            tag: 'HVOR_MYE_TIMER_1',
                            sporsmalstekst: 'timer',
                            undertekst: null,
                            svartype: 'RADIO',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [

                            ],
                            undersporsmal: [
                                {
                                    id: '59670',
                                    tag: 'HVOR_MYE_TIMER_VERDI_1',
                                    sporsmalstekst: null,
                                    undertekst: 'timer totalt',
                                    svartype: 'TALL',
                                    min: '1',
                                    max: '193',
                                    pavirkerAndreSporsmal: false,
                                    kriterieForVisningAvUndersporsmal: null,
                                    svar: [

                                    ],
                                    undersporsmal: [

                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: '59671',
            tag: 'FERIE_PERMISJON_UTLAND',
            sporsmalstekst: 'Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 3. - 11. februar 2019?',
            undertekst: null,
            svartype: 'JA_NEI',
            min: null,
            max: null,
            pavirkerAndreSporsmal: false,
            kriterieForVisningAvUndersporsmal: 'JA',
            svar: [

            ],
            undersporsmal: [
                {
                    id: '59672',
                    tag: 'FERIE_PERMISJON_UTLAND_HVA',
                    sporsmalstekst: 'Kryss av alt som gjelder deg:',
                    undertekst: null,
                    svartype: 'CHECKBOX_GRUPPE',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [

                    ],
                    undersporsmal: [
                        {
                            id: '59673',
                            tag: 'FERIE',
                            sporsmalstekst: 'Jeg tok ut ferie',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [

                            ],
                            undersporsmal: [
                                {
                                    id: '59674',
                                    tag: 'FERIE_NAR',
                                    sporsmalstekst: null,
                                    undertekst: null,
                                    svartype: 'PERIODER',
                                    min: '2019-02-03',
                                    max: '2019-02-11',
                                    pavirkerAndreSporsmal: false,
                                    kriterieForVisningAvUndersporsmal: null,
                                    svar: [

                                    ],
                                    undersporsmal: [

                                    ],
                                },
                            ],
                        },
                        {
                            id: '59675',
                            tag: 'PERMISJON',
                            sporsmalstekst: 'Jeg hadde permisjon',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [

                            ],
                            undersporsmal: [
                                {
                                    id: '59676',
                                    tag: 'PERMISJON_NAR',
                                    sporsmalstekst: null,
                                    undertekst: null,
                                    svartype: 'PERIODER',
                                    min: '2019-02-03',
                                    max: '2019-02-11',
                                    pavirkerAndreSporsmal: false,
                                    kriterieForVisningAvUndersporsmal: null,
                                    svar: [

                                    ],
                                    undersporsmal: [

                                    ],
                                },
                            ],
                        },
                        {
                            id: '59677',
                            tag: 'UTLAND',
                            sporsmalstekst: 'Jeg var utenfor Norge',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [

                            ],
                            undersporsmal: [
                                {
                                    id: '59678',
                                    tag: 'UTLAND_NAR',
                                    sporsmalstekst: null,
                                    undertekst: null,
                                    svartype: 'PERIODER',
                                    min: '2019-02-03',
                                    max: '2019-02-11',
                                    pavirkerAndreSporsmal: false,
                                    kriterieForVisningAvUndersporsmal: null,
                                    svar: [

                                    ],
                                    undersporsmal: [

                                    ],
                                },
                                {
                                    id: '59679',
                                    tag: 'UTLANDSOPPHOLD_SOKT_SYKEPENGER',
                                    sporsmalstekst: 'Har du søkt om å beholde sykepenger under dette oppholdet utenfor Norge?',
                                    undertekst: null,
                                    svartype: 'JA_NEI',
                                    min: null,
                                    max: null,
                                    pavirkerAndreSporsmal: false,
                                    kriterieForVisningAvUndersporsmal: null,
                                    svar: [

                                    ],
                                    undersporsmal: [

                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: '59680',
            tag: 'ANDRE_INNTEKTSKILDER',
            sporsmalstekst: 'Har du andre inntektskilder, eller jobber du for andre enn Min arbeidsgiver?',
            undertekst: null,
            svartype: 'JA_NEI',
            min: null,
            max: null,
            pavirkerAndreSporsmal: false,
            kriterieForVisningAvUndersporsmal: 'JA',
            svar: [

            ],
            undersporsmal: [
                {
                    id: '59681',
                    tag: 'HVILKE_ANDRE_INNTEKTSKILDER',
                    sporsmalstekst: 'Hvilke andre inntektskilder har du?',
                    undertekst: 'Du trenger ikke oppgi andre ytelser fra NAV',
                    svartype: 'CHECKBOX_GRUPPE',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [

                    ],
                    undersporsmal: [
                        {
                            id: '59682',
                            tag: 'INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD',
                            sporsmalstekst: 'Andre arbeidsforhold',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [

                            ],
                            undersporsmal: [
                                {
                                    id: '59683',
                                    tag: 'INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD_ER_DU_SYKMELDT',
                                    sporsmalstekst: 'Er du sykmeldt fra dette?',
                                    undertekst: null,
                                    svartype: 'JA_NEI',
                                    min: null,
                                    max: null,
                                    pavirkerAndreSporsmal: false,
                                    kriterieForVisningAvUndersporsmal: null,
                                    svar: [

                                    ],
                                    undersporsmal: [

                                    ],
                                },
                            ],
                        },
                        {
                            id: '59684',
                            tag: 'INNTEKTSKILDE_SELVSTENDIG',
                            sporsmalstekst: 'Selvstendig næringsdrivende',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [

                            ],
                            undersporsmal: [
                                {
                                    id: '59685',
                                    tag: 'INNTEKTSKILDE_SELVSTENDIG_ER_DU_SYKMELDT',
                                    sporsmalstekst: 'Er du sykmeldt fra dette?',
                                    undertekst: null,
                                    svartype: 'JA_NEI',
                                    min: null,
                                    max: null,
                                    pavirkerAndreSporsmal: false,
                                    kriterieForVisningAvUndersporsmal: null,
                                    svar: [

                                    ],
                                    undersporsmal: [

                                    ],
                                },
                            ],
                        },
                        {
                            id: '59686',
                            tag: 'INNTEKTSKILDE_SELVSTENDIG_DAGMAMMA',
                            sporsmalstekst: 'Selvstendig næringsdrivende dagmamma',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [

                            ],
                            undersporsmal: [
                                {
                                    id: '59687',
                                    tag: 'INNTEKTSKILDE_SELVSTENDIG_DAGMAMMA_ER_DU_SYKMELDT',
                                    sporsmalstekst: 'Er du sykmeldt fra dette?',
                                    undertekst: null,
                                    svartype: 'JA_NEI',
                                    min: null,
                                    max: null,
                                    pavirkerAndreSporsmal: false,
                                    kriterieForVisningAvUndersporsmal: null,
                                    svar: [

                                    ],
                                    undersporsmal: [

                                    ],
                                },
                            ],
                        },
                        {
                            id: '59688',
                            tag: 'INNTEKTSKILDE_JORDBRUKER',
                            sporsmalstekst: 'Jordbruker / Fisker / Reindriftsutøver',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [

                            ],
                            undersporsmal: [
                                {
                                    id: '59689',
                                    tag: 'INNTEKTSKILDE_JORDBRUKER_ER_DU_SYKMELDT',
                                    sporsmalstekst: 'Er du sykmeldt fra dette?',
                                    undertekst: null,
                                    svartype: 'JA_NEI',
                                    min: null,
                                    max: null,
                                    pavirkerAndreSporsmal: false,
                                    kriterieForVisningAvUndersporsmal: null,
                                    svar: [

                                    ],
                                    undersporsmal: [

                                    ],
                                },
                            ],
                        },
                        {
                            id: '59690',
                            tag: 'INNTEKTSKILDE_FRILANSER',
                            sporsmalstekst: 'Frilanser',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [

                            ],
                            undersporsmal: [
                                {
                                    id: '59691',
                                    tag: 'INNTEKTSKILDE_FRILANSER_ER_DU_SYKMELDT',
                                    sporsmalstekst: 'Er du sykmeldt fra dette?',
                                    undertekst: null,
                                    svartype: 'JA_NEI',
                                    min: null,
                                    max: null,
                                    pavirkerAndreSporsmal: false,
                                    kriterieForVisningAvUndersporsmal: null,
                                    svar: [

                                    ],
                                    undersporsmal: [

                                    ],
                                },
                            ],
                        },
                        {
                            id: '59692',
                            tag: 'INNTEKTSKILDE_ANNET',
                            sporsmalstekst: 'Annet',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: null,
                            svar: [

                            ],
                            undersporsmal: [

                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: '59693',
            tag: 'UTDANNING',
            sporsmalstekst: 'Har du vært under utdanning i løpet av perioden 3. - 11. februar 2019?',
            undertekst: null,
            svartype: 'JA_NEI',
            min: null,
            max: null,
            pavirkerAndreSporsmal: false,
            kriterieForVisningAvUndersporsmal: 'JA',
            svar: [

            ],
            undersporsmal: [
                {
                    id: '59694',
                    tag: 'UTDANNING_START',
                    sporsmalstekst: 'Når startet du på utdanningen?',
                    undertekst: null,
                    svartype: 'DATO',
                    min: null,
                    max: '2019-02-11',
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [

                    ],
                    undersporsmal: [

                    ],
                },
                {
                    id: '59695',
                    tag: 'FULLTIDSSTUDIUM',
                    sporsmalstekst: 'Er utdanningen et fulltidsstudium?',
                    undertekst: null,
                    svartype: 'JA_NEI',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [

                    ],
                    undersporsmal: [

                    ],
                },
            ],
        },
        {
            id: '59696',
            tag: 'VAER_KLAR_OVER_AT',
            sporsmalstekst: 'Vær klar over at:',
            undertekst: '<ul><li>rett til sykepenger forutsetter at du er borte fra arbeid på grunn av egen sykdom. Sosiale eller økonomiske problemer gir ikke rett til sykepenger</li><li>du kan miste retten til sykepenger hvis du uten rimelig grunn nekter å opplyse om egen funksjonsevne eller nekter å ta imot tilbud om behandling og/eller tilrettelegging</li><li>sykepenger utbetales i maksimum 52 uker, også for gradert (delvis) sykmelding</li><li>fristen for å søke sykepenger er som hovedregel 3 måneder</li></ul>',
            svartype: 'IKKE_RELEVANT',
            min: null,
            max: null,
            pavirkerAndreSporsmal: false,
            kriterieForVisningAvUndersporsmal: null,
            svar: [

            ],
            undersporsmal: [

            ],
        },
        {
            id: '59697',
            tag: 'BEKREFT_OPPLYSNINGER',
            sporsmalstekst: 'Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.',
            undertekst: null,
            svartype: 'CHECKBOX_PANEL',
            min: null,
            max: null,
            pavirkerAndreSporsmal: false,
            kriterieForVisningAvUndersporsmal: null,
            svar: [

            ],
            undersporsmal: [

            ],
        },
    ],
};

/* eslint-enable max-len */

const mockNySoknadArbeidstaker = (soknad = {}) => {
    return parseSoknad({
        ...nySoknadArbeidstaker,
        ...soknad,
    });
};

export default mockNySoknadArbeidstaker;
