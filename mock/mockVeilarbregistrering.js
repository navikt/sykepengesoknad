function mockVeilarbregistrering(server) {
    server.get('/veilarbregistrering/api/sykmeldtinfodata', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            maksDato: '2018-01-01',
            erArbeidsrettetOppfolgingSykmeldtInngangAktiv: false,
        }));
    });
}

module.exports = mockVeilarbregistrering;
