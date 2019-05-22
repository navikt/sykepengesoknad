const mockData = require('./mockData');
const enums = require('./mockDataEnums');

const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

function mockOppdaterSporsmalLokal(server) {
    const tilNyId = (sporsmal) => {
        return {
            ...sporsmal,
            id: Math.round(Math.random() * 100000) + '',
            undersporsmal: sporsmal.undersporsmal.map(tilNyId),
        };
    };

    server.post('/syfoapi/syfosoknad/api/oppdaterSporsmal', (req, res) => {
        const soknad = req.body;
        const soknadMedNyeSporsmalIder = {
            ...soknad,
            sporsmal: soknad.sporsmal.map(tilNyId),
        };

        mockData[enums.SOKNADER] = mockData[enums.SOKNADER].map((s) => {
            return s.id === soknad.id
                ? soknad
                : s;
        });

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(soknadMedNyeSporsmalIder));
    });

}

function mockOppdaterSporsmalOpplaeringsmiljo(server) {
    server.post('/syfoapi/syfosoknad/api/oppdaterSporsmal', (req, res) => {
        const soknad = req.body;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(soknad));
    });
}

function mockSyfosoknadLokalt(server) {
    server.post('/syfoapi/syfosoknad/api/opprettSoknadUtland', (req, res) => {
        if (!mockData[enums.SOKNADER].find((soknad) => {
            return soknad.id === mockData[enums.NY_SOKNAD_UTLAND].id;
        })) {
            mockData[enums.SOKNADER] = [...mockData[enums.SOKNADER], mockData[enums.NY_SOKNAD_UTLAND]];
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.NY_SOKNAD_UTLAND]));
    });

    server.post('/syfoapi/syfosoknad/api/soknader/:id/avbryt', (req, res) => {
        const soknadId = req.params.id;
        const soknad = mockData[enums.SOKNADER].find((s) => {
            return s.id === soknadId;
        });
        if (soknad.soknadstype === 'OPPHOLD_UTLAND' || soknad.status === 'UTKAST_TIL_KORRIGERING') {
            mockData[enums.SOKNADER] = mockData[enums.SOKNADER].filter((s) => {
                return s.id !== soknad.id;
            });
        } else {
            mockData[enums.SOKNADER] = mockData[enums.SOKNADER].map((s) => {
                return s.id === soknad.id
                    ? {
                        ...s,
                        avbruttDato: new Date(),
                        status: 'AVBRUTT',
                    }
                    : s;
            });
        }

        res.send(JSON.stringify({}));
    });

    server.post('/syfoapi/syfosoknad/api/soknader/:id/ettersendTilNav', (req, res) => {
        const soknadId = req.params.id;
        const soknad = mockData[enums.SOKNADER].find((s) => {
            return s.id === soknadId;
        });

        mockData[enums.SOKNADER] = mockData[enums.SOKNADER].map((s) => {
            return s.id === soknad.id
                ? {
                    ...s,
                    sendtTilNAVDato: new Date(),
                }
                : s;
        });

        res.send(200);
    });

    server.post('/syfoapi/syfosoknad/api/soknader/:id/ettersendTilArbeidsgiver', (req, res) => {
        const soknadId = req.params.id;
        const soknad = mockData[enums.SOKNADER].find((s) => {
            return s.id === soknadId;
        });

        mockData[enums.SOKNADER] = mockData[enums.SOKNADER].map((s) => {
            return s.id === soknad.id
                ? {
                    ...s,
                    sendtTilArbeidsgiverDato: new Date(),
                }
                : s;
        });

        res.send(200);
    });

    server.post('/syfoapi/syfosoknad/api/soknader/:id/gjenapne', (req, res) => {
        const soknadId = req.params.id;
        mockData[enums.SOKNADER] = mockData[enums.SOKNADER].map((s) => {
            return s.id === soknadId
                ? {
                    ...s,
                    avbruttDato: null,
                    status: 'NY',
                }
                : s;
        });
        res.send(JSON.stringify({}));
    });

    server.post('/syfoapi/syfosoknad/api/sendSoknad', (req, res) => {
        const { id, sporsmal } = req.body;

        const soknadTilInnsending = mockData[enums.SOKNADER].find((soknad) => {
            return soknad.id === id;
        });

        mockData[enums.SOKNADER] = mockData[enums.SOKNADER].map((soknad) => {
            const _soknad = Object.assign({}, soknad);

            if (soknad.id === id) {
                _soknad.status = 'SENDT';
                _soknad.sporsmal = sporsmal;
                _soknad.sendtTilArbeidsgiverDato = new Date().toJSON()
                    .substr(0, 10);
            }

            if (soknad.id === soknadTilInnsending.korrigerer) {
                _soknad.korrigertAv = soknadTilInnsending.id;
                _soknad.status = 'KORRIGERT';
            }

            return _soknad;
        });

        res.send(JSON.stringify({}));
    });

    server.post('/syfoapi/syfosoknad/api/soknader/:id/korriger', (req, res) => {
        const { id } = req.params;
        const soknadSomKorrigeres = mockData[enums.SOKNADER].find((soknad) => {
            return soknad.id === id;
        });
        let utkast = mockData[enums.SOKNADER].find((soknad) => {
            return soknad.korrigerer === id;
        });

        if (!utkast) {
            utkast = Object.assign({}, soknadSomKorrigeres, {
                id: uuid(),
                status: 'UTKAST_TIL_KORRIGERING',
                opprettetDato: new Date().toJSON()
                    .substr(0, 10),
                sendtTilArbeidsgiverDato: null,
                korrigerer: soknadSomKorrigeres.id,
            });
            mockData[enums.SOKNADER].push(utkast);
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(utkast));
    });
}

function mockSyfosoknadOpplaringsmiljoOgLokalt(server) {
    server.get('/syfoapi/syfosoknad/api/soknader', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mockData[enums.SOKNADER]));
    });

    server.post('/syfoapi/syfosoknad/api/soknader/:id/mottaker', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            mottaker: 'ARBEIDSGIVER_OG_NAV',
        }));
    });
}

const mockSyfosoknad = (server, erLokal) => {
    if (erLokal) {
        mockOppdaterSporsmalLokal(server);
        mockSyfosoknadLokalt(server);
    } else {
        mockOppdaterSporsmalOpplaeringsmiljo(server);
    }
    mockSyfosoknadOpplaringsmiljoOgLokalt(server);
};

module.exports = mockSyfosoknad;
