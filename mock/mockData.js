const path = require('path');
const fs = require('fs');
const enums = require('./mockDataEnums');

const mockData = {};

const lastFilTilMinne = (filnavn) => {
    fs.readFile(path.join(__dirname, `/data/${filnavn}.json`), (err, data) => {
        if (err) throw err;
        mockData[filnavn] = JSON.parse(data.toString());
    });
};

lastFilTilMinne(enums.ARBEIDSGIVERS_SYKMELDINGER);
lastFilTilMinne(enums.NY_SOKNAD_UTLAND);
lastFilTilMinne(enums.ARBEIDSGIVERE);
lastFilTilMinne(enums.METADATA);
lastFilTilMinne(enums.MOTEBEHOV);
lastFilTilMinne(enums.NAERMESTELEDERE);
lastFilTilMinne(enums.OPPFOELGINGSDIALOGER);
lastFilTilMinne(enums.SYFOUNLEASH);
lastFilTilMinne(enums.SYKEFORLOEAP);
lastFilTilMinne(enums.SYKEPENGESOKNADER);
lastFilTilMinne(enums.TEKSTER);
lastFilTilMinne(enums.VARSLER);
lastFilTilMinne(enums.VEDLIKEHOLD);
lastFilTilMinne(enums.TILGANG);
lastFilTilMinne(enums.TOGGLES);
lastFilTilMinne(enums.ARBEIDSFORHOLD);
lastFilTilMinne(enums.KONTAKTINFO);
lastFilTilMinne(enums.NAERMESTELEDER);
lastFilTilMinne(enums.PERIODER);
lastFilTilMinne(enums.PERSON);
lastFilTilMinne(enums.PERSONVIRKSOMHETSNUMMER);
lastFilTilMinne(enums.VIRKSOMHET);
lastFilTilMinne(enums.FORRIGE_LEDER);
lastFilTilMinne(enums.SISTE);
lastFilTilMinne(enums.HENDELSER);
lastFilTilMinne(enums.SM_SYKMELDINGER);
lastFilTilMinne(enums.SOKNADER);
lastFilTilMinne(enums.SYKMELDINGER);

module.exports = mockData;
