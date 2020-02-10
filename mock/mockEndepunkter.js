const express = require('express');
const mockRestoppfolgingsdialog = require('./mockRestoppfolgingsdialog');
const mockSyfomoteadmin = require('./mockSyfomoteadmin');
const mockSyfomotebehov = require('./mockSyfomotebehov');
const mockSyforest = require('./mockSyforest');
const mockSyfoservicestrangler = require('./mockSyfoservicestrangler');
const mockSyfosoknad = require('./mockSyfosoknad');
const mockSyfotekster = require('./mockSyfotekster');
const mockSyfounleash = require('./mockSyfounleash');
const mockVeilarboppfolging = require('./mockVeilarboppfolging');
const mockVeilarbregistrering = require('./mockVeilarbregistrering');
const mockSmSykmeldinger = require('./mockSmSykmeldinger');


function skapBackendProxy(server) {
    // eslint-disable-next-line import/no-extraneous-dependencies,global-require
    const proxy = require('http-proxy-middleware');
    // eslint-disable-next-line global-require
    const fs = require('fs');
    const jwt = fs.readFileSync('mock/jsonwebtoken.txt', 'utf8')
        .replace(/\n/g, '');

    const addHeaders = (proxyReq) => {
        proxyReq.setHeader('Authorization', `Bearer ${jwt}`);
    };

    server.use('/syfoapi/syfosoknad', proxy({
        target: 'http://localhost:7070',
        changeOrigin: true,
        pathRewrite: { '^/syfoapi/syfosoknad': '/syfosoknad' },
        onProxyReq: addHeaders,
    }));

    server.use('/syforest/sykmeldinger', proxy({
        target: 'http://localhost:7070',
        changeOrigin: true,
        pathRewrite: { '^/syforest/sykmeldinger': '/syfosoknad/api/sykmeldingmockup' },
        onProxyReq: addHeaders,
    }));
}

function mockEndepunkter(server, erLokal, brukBackendproxy) {
    const endepunkter = [
        mockRestoppfolgingsdialog,
        mockSyfomoteadmin,
        mockSyfomotebehov,
        mockSyforest,
        mockSyfoservicestrangler,
        mockSyfotekster,
        mockSyfounleash,
        mockVeilarboppfolging,
        mockVeilarbregistrering,
        mockSmSykmeldinger,
    ];
    if (brukBackendproxy) {
        skapBackendProxy(server);
    } else {
        endepunkter.push(mockSyfosoknad);
    }

    server.use(express.json());
    server.use(express.urlencoded());

    server.get('/esso/logout', (req, res) => {
        res.send('<p>Du har blitt sendt til utlogging.</p><p><a href="/sykefravaer">Gå til Ditt sykefravær</a></p>');
    });

    server.get('/dittnav', (req, res) => {
        res.send('<p>Ditt Nav er ikke tilgjengelig - dette er en testside som kun viser Ditt sykefravær.</p><p><a href="/sykefravaer">Gå til Ditt sykefravær</a></p>');
    });
    endepunkter.forEach((func) => {
        func(server, erLokal);
    });
}

module.exports = mockEndepunkter;
