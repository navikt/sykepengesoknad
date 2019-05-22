const mockData = require('./mockData');
const enums = require('./mockDataEnums');

function mockUnleashLokal(server) {
    server.post('/syfounleash/', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const toggles = req.body.reduce((acc, cur) => {
            return Object.assign({}, acc, {
                [cur]: true,
            });
        }, {});
        res.send(JSON.stringify(toggles));
    });
}

function mockUnleashOpplaeringsmiljo(server) {
    server.post('/syfounleash/', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.SYFOUNLEASH]));
    });
}

function mockSyfounleash(server, erLokal) {
    if (erLokal) {
        mockUnleashLokal(server);
    } else {
        mockUnleashOpplaeringsmiljo(server);
    }
}

module.exports = mockSyfounleash;
