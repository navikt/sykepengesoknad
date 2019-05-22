const mockData = require('./mockData');
const enums = require('./mockDataEnums');

function mockSyfomoteadmin(server, erLokal) {
    if (!erLokal) {
        server.get('/syfomoteadmin/api/bruker/arbeidstaker/moter/siste', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(mockData[enums.SISTE]));
        });
    }
}

module.exports = mockSyfomoteadmin;
