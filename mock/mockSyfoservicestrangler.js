const mockData = require('./mockData');
const enums = require('./mockDataEnums');

function mockSyfoservicestrangler(server) {
    server.post('/syfoservicestrangler/api/hendelse/:hendelseId/bekreft', (req, res) => {
        // Her er det kodet inn en random fail sånn at vi får testet feilsituasjoner
        const { hendelseId } = req.params;
        const draw = Math.random() * 10;
        if (draw > 8) {
            res.status(500);
        } else {
            mockData.hendelser = mockData[enums.HENDELSER]
                .filter((h) => {
                    return h.id !== hendelseId;
                });
        }

        setTimeout((() => {
            res.send();
        }), 1000);
    });
}

module.exports = mockSyfoservicestrangler;

