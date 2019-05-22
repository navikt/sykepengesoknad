const mockData = require('./mockData');
const enums = require('./mockDataEnums');

function mockPilotEndepunkterForLokalmiljo(server) {
    server.get('/syfomotebehov/api/motebehov', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.MOTEBEHOV]));
    });

    server.post('/syfomotebehov/api/motebehov', (req, res) => {
        const nyttMotebehov = req.body;

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(nyttMotebehov));
    });
}

function mockPilotEndepunkterForOpplaeringsmiljo(server) {
    server.get('/syfomotebehov/api/motebehov', (req, res) => {
        res.status(403);
        res.send();
    });
}

function mockSyfomotebehov(server, erLokal) {
    if (erLokal) {
        mockPilotEndepunkterForLokalmiljo(server);
    } else {
        mockPilotEndepunkterForOpplaeringsmiljo(server);
    }
}

module.exports = mockSyfomotebehov;
