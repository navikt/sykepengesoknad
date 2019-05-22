const mockData = require('./mockData');
const enums = require('./mockDataEnums');

const mockSyforestLokalt = (server) => {
    server.post('/syforest/naermesteledere/:id/actions/avkreft', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({}));
    });

    server.post('/syforest/soknader/:id/actions/send-til-nav', (req, res) => {
        const { id } = req.params;
        mockData[enums.SYKEPENGESOKNADER] = mockData[enums.SYKEPENGESOKNADER].map((sykpengesoknad) => {
            return sykpengesoknad.id === id
                ? {
                    ...sykpengesoknad,
                    sendtTilNAVDato: new Date(),
                }
                : sykpengesoknad;
        });
        const sykepengesoknad = mockData[enums.SYKEPENGESOKNADER].find((s) => {
            return s.id === id;
        });
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(sykepengesoknad));
    });
};

const mockSyforest = (server, erLokal) => {
    if (erLokal) {
        mockSyforestLokalt(server);
    }

    server.get('/syforest/sykmeldinger?type=arbeidsgiver', (req, res) => {
        res.send(JSON.stringify(mockData[enums.ARBEIDSGIVERS_SYKMELDINGER]));
    });

    server.get('/syforest/sykmeldinger', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.SYKMELDINGER]));
    });

    server.post('/syforest/sykmeldinger/:id/actions/erUtenforVentetid', (req, res) => {
        res.send(JSON.stringify({
            erUtenforVentetid: true,
        }));
    });

    server.get('/syforest/soknader/:uuid/berik', (req, res) => {
        res.send(JSON.stringify({
            forrigeSykeforloepTom: null,
            oppfoelgingsdato: '2018-09-19',
        }));
    });

    server.post('/syforest/soknader/:uuid/actions/beregn-arbeidsgiverperiode', (req, res) => {
        res.send(JSON.stringify({
            erUtenforArbeidsgiverperiode: false,
            antallDagerISykefravaer: 9,
            forrigeSykeforloepTom: null,
            startdato: '2018-09-19',
        }));
    });

    server.get('/syforest/soknader', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.SYKEPENGESOKNADER]));
    });

    server.get('/syforest/naermesteledere', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.NAERMESTELEDERE]));
    });

    server.get('/syforest/sykeforloep/siste/perioder', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.PERIODER]));
    });

    server.get('/syforest/sykeforloep', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.SYKEFORLOEAP]));
    });

    server.get('/syforest/sykeforloep/metadata', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.METADATA]));
    });

    server.post('/syforest/logging', (req, res) => {
        console.log(req.body);
        res.send(JSON.stringify({}));
    });

    server.get('/syforest/informasjon/hendelser', (req, res) => {
        res.send(JSON.stringify(mockData[enums.HENDELSER]));
    });

    server.get('/syforest/informasjon/arbeidsgivere', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.ARBEIDSGIVERE]));
    });

    server.get('/syforest/informasjon/vedlikehold', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.VEDLIKEHOLD]));
    });

    server.get('/syforest/informasjon/bruker', (req, res) => {
        res.send(JSON.stringify({
            strengtFortroligAdresse: false,
        }));
    });

    server.get('/syforest/informasjon/toggles', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.TOGGLES]));
    });
};

module.exports = mockSyforest;
