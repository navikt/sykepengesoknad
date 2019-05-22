/* eslint-disable max-len */

const sykmelding = {
    id: '3456789',
    pasient: {
        fnr: '12345678910',
        fornavn: 'Per',
        etternavn: 'Person',
    },
    arbeidsgiver: 'Selskapet AS',
    orgnummer: '123456781',
    status: 'NY',
    identdato: new Date('2015-12-31'),
    diagnose: {
        hoveddiagnose: {
            diagnose: 'Influensa',
            diagnosesystem: 'ICPC',
            diagnosekode: 'LP2',
        },
    },
    mulighetForArbeid: {
        perioder: [{
            fom: new Date('2015-12-31'),
            tom: new Date('2016-01-06'),
            grad: 67,
        }],
    },
    friskmelding: {
        arbeidsfoerEtterPerioden: true,
    },
    utdypendeOpplysninger: {},
    arbeidsevne: {},
    meldingTilNav: {},
    tilbakedatering: {},
    bekreftelse: {
        sykmelder: 'Ove Olsen',
        utstedelsesdato: new Date('2016-05-02'),
    },
};

const getSykmelding = (skmld = {}) => {
    return Object.assign({}, sykmelding, skmld);
};

export default getSykmelding;
/* eslint-disable max-len */
