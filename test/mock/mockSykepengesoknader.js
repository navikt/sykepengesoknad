import * as actions from '../../js/sykepengesoknad-gammel-plattform/data/sykepengesoknader/sykepengesoknader_actions';
import sykepengesoknader from '../../js/sykepengesoknad-gammel-plattform/data/sykepengesoknader/sykepengesoknader';

export const soknader = [{
    id: '9997ab30-ce08-443c-87fe-e953c8a07cca',
    status: 'NY',
    opprettetDato: '2017-01-19',
    arbeidsgiver: {
        navn: 'BYGGMESTER BLOM AS',
        orgnummer: '123456789',
        naermesteLeder: null,
    },
    identdato: '2016-07-15',
    oppfoelgingsdato: '2017-12-24',
    ansvarBekreftet: false,
    bekreftetKorrektInformasjon: false,
    arbeidsgiverUtbetalerLoenn: false,
    egenmeldingsperioder: [],
    gjenopptattArbeidFulltUtDato: null,
    ferie: [],
    permisjon: [],
    utenlandsopphold: {
        perioder: [],
        soektOmSykepengerIPerioden: null,
    },
    aktiviteter: [{
        periode: {
            fom: '2016-07-15',
            tom: '2017-01-19',
        },
        grad: 100,
        avvik: null,
        id: 1,
    }],
    andreInntektskilder: [],
    utdanning: null,
}, {
    id: 'a0acb034-ea32-43cd-a71a-667ea02d9a9b',
    status: 'NY',
    opprettetDato: '2017-01-18',
    arbeidsgiver: {
        navn: 'BYGGMESTER BLOM AS',
        orgnummer: '123456789',
        naermesteLeder: null,
    },
    identdato: '2016-07-15',
    ansvarBekreftet: false,
    bekreftetKorrektInformasjon: false,
    arbeidsgiverUtbetalerLoenn: false,
    egenmeldingsperioder: [],
    gjenopptattArbeidFulltUtDato: null,
    ferie: [],
    permisjon: [],
    utenlandsopphold: {
        perioder: [],
        soektOmSykepengerIPerioden: null,
    },
    aktiviteter: [{
        periode: {
            fom: '2016-07-15',
            tom: '2016-07-20',
        },
        grad: 100,
        avvik: null,
        id: 2,
    }],
    andreInntektskilder: [],
    utdanning: null,
}, {
    id: '8224090d-d021-4bf3-8144-92439fc05605',
    status: 'NY',
    opprettetDato: '2017-01-18',
    arbeidsgiver: {
        navn: 'BYGGMESTER BLOM AS',
        orgnummer: '123456789',
        naermesteLeder: null,
    },
    identdato: '2016-07-15',
    ansvarBekreftet: false,
    bekreftetKorrektInformasjon: false,
    arbeidsgiverUtbetalerLoenn: false,
    egenmeldingsperioder: [],
    gjenopptattArbeidFulltUtDato: null,
    ferie: [],
    permisjon: [],
    utenlandsopphold: {
        perioder: [],
        soektOmSykepengerIPerioden: null,
    },
    aktiviteter: [{
        periode: {
            fom: '2016-07-15',
            tom: '2016-07-20',
        },
        grad: 100,
        avvik: null,
        id: 3,
    }],
    andreInntektskilder: [],
    utdanning: null,
}, {
    id: '66a8ec20-b813-4b03-916f-7a2f0751b600',
    status: 'NY',
    opprettetDato: '2017-01-18',
    arbeidsgiver: {
        navn: 'BYGGMESTER BLOM AS',
        orgnummer: '123456789',
        naermesteLeder: null,
    },
    identdato: '2016-07-15',
    ansvarBekreftet: false,
    bekreftetKorrektInformasjon: false,
    arbeidsgiverUtbetalerLoenn: false,
    egenmeldingsperioder: [],
    gjenopptattArbeidFulltUtDato: null,
    ferie: [],
    permisjon: [],
    utenlandsopphold: {
        perioder: [],
        soektOmSykepengerIPerioden: null,
    },
    aktiviteter: [{
        periode: {
            fom: '2016-07-15',
            tom: '2016-07-20',
        },
        grad: 100,
        avvik: null,
        id: 4,
    }],
    andreInntektskilder: [],
    utdanning: null,
}];


export const getSoknad = (soknad = {}) => {
    const _soknad = Object.assign({}, {
        id: '66a8ec20-b813-4b03-916f-7a2f0751b600',
        status: 'NY',

        opprettetDato: '2017-01-18',
        arbeidsgiver: {
            navn: 'BYGGMESTER BLOM AS',
            orgnummer: '123456789',
            naermesteLeder: null,
        },
        identdato: '2016-07-15',
        ansvarBekreftet: false,
        bekreftetKorrektInformasjon: false,
        arbeidsgiverUtbetalerLoenn: false,
        egenmeldingsperioder: [],
        gjenopptattArbeidFulltUtDato: null,
        ferie: [],
        permisjon: [],
        utenlandsopphold: {
            perioder: [],
            soektOmSykepengerIPerioden: null,
        },
        aktiviteter: [{
            periode: {
                fom: '2017-01-01',
                tom: '2017-01-15',
            },
            grad: 100,
            avvik: null,
            id: 1,
        }, {
            periode: {
                fom: '2017-01-16',
                tom: '2017-01-25',
            },
            grad: 50,
            avvik: null,
            id: 2,
        }],
        andreInntektskilder: [],
        utdanning: null,
    }, soknad);

    const action = actions.sykepengesoknaderHentet([_soknad]);
    const state = sykepengesoknader(undefined, action);
    return state.data[0];
};

export const getParsetSoknad = (soknad = {}) => {
    return Object.assign({}, {
        id: '66a8ec20-b813-4b03-916f-7a2f0751b600',
        status: 'NY',
        innsendtDato: null,
        opprettetDato: new Date('2017-01-18'),
        arbeidsgiver: {
            navn: 'BYGGMESTER BLOM AS',
            orgnummer: '123456789',
            naermesteLeder: null,
        },
        identdato: new Date('2016-07-15'),
        oppfoelgingsdato: new Date('2017-12-24'),
        ansvarBekreftet: false,
        bekreftetKorrektInformasjon: false,
        arbeidsgiverUtbetalerLoenn: false,
        egenmeldingsperioder: [],
        gjenopptattArbeidFulltUtDato: null,
        ferie: [],
        permisjon: [],
        utenlandsopphold: {
            perioder: [],
            soektOmSykepengerIPerioden: null,
        },
        aktiviteter: [{
            periode: {
                fom: new Date('2017-01-01'),
                tom: new Date('2017-01-15'),
            },
            grad: 100,
            avvik: null,
        }, {
            periode: {
                fom: new Date('2017-01-01'),
                tom: new Date('2017-01-25'),
            },
            grad: 50,
            avvik: null,
        }],
        andreInntektskilder: [],
        utdanning: null,
        sykmeldingSkrevetDato: new Date('2017-08-05'),
        fom: new Date('2017-01-01'),
        tom: new Date('2017-01-25'),
        sykmeldingId: 'ca18a51b-02da-4b17-bf6c-8819a8dc8c9a',
        del: 1,
        forrigeSykeforloepTom: null,
        forrigeSendteSoknadTom: null,
        sendtTilArbeidsgiverDato: new Date('2017-07-21'),
        sendtTilNAVDato: new Date('2017-07-21'),
        avbruttDato: null,
    }, soknad);
};
