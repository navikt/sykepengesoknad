const request = require('request');
const mockData = require('./mockData');
const enums = require('./mockDataEnums');

let teksterFraProd;

function hentTeksterFraProd() {
    const TEKSTER_URL = 'https://syfoapi.nav.no/syfotekster/api/tekster';
    request(TEKSTER_URL, (error, response, body) => {
        if (error) {
            console.log('Kunne ikke hente tekster fra prod', error);
        } else {
            teksterFraProd = JSON.parse(body);
            console.log('Tekster hentet fra prod');
        }
    });
}

function mockTekster(server) {
    const HVERT_FEMTE_MINUTT = 1000 * 60 * 5;
    hentTeksterFraProd();
    setInterval(hentTeksterFraProd, HVERT_FEMTE_MINUTT);

    server.get('/syfotekster/api/tekster', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(teksterFraProd || mockData[enums.TEKSTER]));
    });
}

module.exports = mockTekster;
