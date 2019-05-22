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

function mockEndepunkter(server, erLokal) {
    server.use(express.json());
    server.use(express.urlencoded());

    server.get('/esso/logout', (req, res) => {
        res.send('<p>Du har blitt sendt til utlogging.</p><p><a href="/sykefravaer">Gå til Ditt sykefravær</a></p>');
    });

    server.get('/dittnav', (req, res) => {
        res.send('<p>Ditt Nav er ikke tilgjengelig - dette er en testside som kun viser Ditt sykefravær.</p><p><a href="/sykefravaer">Gå til Ditt sykefravær</a></p>');
    });

    [
        mockRestoppfolgingsdialog,
        mockSyfomoteadmin,
        mockSyfomotebehov,
        mockSyforest,
        mockSyfoservicestrangler,
        mockSyfosoknad,
        mockSyfotekster,
        mockSyfounleash,
        mockVeilarboppfolging,
        mockVeilarbregistrering,
        mockSmSykmeldinger,
    ].forEach((func) => {
        func(server, erLokal);
    });
}

module.exports = mockEndepunkter;
