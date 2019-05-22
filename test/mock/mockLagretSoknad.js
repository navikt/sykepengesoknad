/* eslint-disable max-len */
import { parseSoknad } from '../../js/sykepengesoknad/data/soknader/soknader';

const lagretSoknad = {
    id: '8a8f9811-9b3d-41ad-9f9b-0d07cbc41030',
    aktorId: 'aktorId-123456789',
    sykmeldingId: null,
    soknadstype: 'OPPHOLD_UTLAND',
    status: 'NY',
    fom: null,
    tom: null,
    opprettetDato: '2018-09-03',
    innsendtDato: null,
    sporsmal: [
        {
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
                    verdi: '{"fom":"01.09.2018","tom":"01.10.2018"}',
                },
                {
                    verdi: '{"fom":"12.08.207_","tom":"12.08.2017"}',
                },
            ],
            undersporsmal: [],
        },
        {
            id: '56',
            tag: 'LAND',
            sporsmalstekst: 'Hvor skal du reise?',
            undertekst: null,
            svartype: 'FRITEKST',
            min: null,
            max: null,
            kriterieForVisningAvUndersporsmal: null,
            svar: [
                {
                    verdi: 'Oslo',
                },
            ],
            undersporsmal: [],
        },
        {
            id: '57',
            tag: 'ARBEIDSGIVER',
            sporsmalstekst: 'Har du arbeidsgiver?',
            undertekst: null,
            svartype: 'JA_NEI',
            min: null,
            max: null,
            kriterieForVisningAvUndersporsmal: 'JA',
            svar: [
                {
                    verdi: 'JA',
                },
            ],
            undersporsmal: [
                {
                    id: '58',
                    tag: 'SYKMELDINGSGRAD',
                    sporsmalstekst: 'Er du 100 % sykmeldt?',
                    undertekst: null,
                    svartype: 'JA_NEI',
                    min: null,
                    max: null,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [
                        {
                            verdi: 'JA',
                        },
                    ],
                    undersporsmal: [],
                },
                {
                    id: '59',
                    tag: 'FERIE',
                    sporsmalstekst: 'Har du avtalt med arbeidsgiveren din at du skal ha ferie i hele perioden?',
                    undertekst: null,
                    svartype: 'JA_NEI',
                    min: null,
                    max: null,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [
                        {
                            verdi: 'NEI',
                        },
                    ],
                    undersporsmal: [],
                },
            ],
        },
        {
            id: '60',
            tag: 'BEKREFT_OPPLYSNINGER_UTLAND_INFO',
            sporsmalstekst: 'Før du reiser trenger vi denne bekreftelsen fra deg:',
            undertekst: '<ul>\n    <li>Reisen vil ikke gjøre at jeg blir dårligere </li>\n    <li>Reisen vil ikke gjøre at sykefraværet blir lengre</li>\n    <li>Reisen vil ikke hindre planlagt behandling eller oppfølging med NAV eller arbeidsgiver</li>\n</ul>',
            svartype: 'IKKE_RELEVANT',
            min: null,
            max: null,
            kriterieForVisningAvUndersporsmal: null,
            svar: [],
            undersporsmal: [
                {
                    id: '61',
                    tag: 'BEKREFT_OPPLYSNINGER_UTLAND',
                    sporsmalstekst: 'Jeg bekrefter de tre punktene ovenfor. Jeg har avklart reisen med legen og arbeidsgiveren min.',
                    undertekst: null,
                    svartype: 'CHECKBOX_PANEL',
                    min: null,
                    max: null,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [
                        {
                            verdi: 'CHECKED',
                        },
                    ],
                    undersporsmal: [],
                },
            ],
        },
    ],
};

export default (s = {}) => {
    return parseSoknad({
        ...lagretSoknad,
        ...s,
    });
};
