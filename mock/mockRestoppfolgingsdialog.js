const mockData = require('./mockData');
const enums = require('./mockDataEnums');

function mockRestoppfolgingsdialog(server) {
    server.get('/restoppfoelgingsdialog/api/sykmeldt/oppfoelgingsdialoger', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.OPPFOELGINGSDIALOGER]));
    });

    server.get('/restoppfoelgingsdialog/api/tilgang', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.TILGANG]));
    });

    server.get('/restoppfoelgingsdialog/api/virksomhet/:virksomhetsnummer', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.VIRKSOMHET]));
    });

    server.get('/restoppfoelgingsdialog/api/naermesteleder/:fnr/forrige', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.FORRIGE_LEDER]));
    });

    server.post('/restoppfoelgingsdialog/api/oppfoelgingsdialoger/actions/:id/sett', (req, res) => {
        res.send();
    });

    server.get('/restoppfoelgingsdialog/api/arbeidsforhold', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.ARBEIDSFORHOLD]));
    });

    server.get('/restoppfoelgingsdialog/api/person/:fnr', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.PERSON]));
    });

    server.get('/restoppfoelgingsdialog/api/kontaktinfo/:fnr', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.KONTAKTINFO]));
    });

    server.get('/restoppfoelgingsdialog/api/naermesteleder/:fnr', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.NAERMESTELEDER]));
    });

    server.get('/restoppfoelgingsdialog/api/person/:fnr?virksomhetsnummer=:vnr', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.PERSONVIRKSOMHETSNUMMER]));
    });
}

module.exports = mockRestoppfolgingsdialog;
