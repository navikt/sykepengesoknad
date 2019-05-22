function mockVeilarboppfolging(server) {
    server.get('/veilarboppfolging/api/oppfolging', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send({
            fnr: '10000020000',
            veilederId: null,
            reservasjonKRR: false,
            manuell: false,
            underOppfolging: false,
            underKvp: false,
            vilkarMaBesvares: true,
            oppfolgingUtgang: null,
            gjeldendeEskaleringsvarsel: null,
            kanStarteOppfolging: false,
            avslutningStatus: null,
            oppfolgingsPerioder: [],
            harSkriveTilgang: true,
            inaktivIArena: null,
            kanReaktiveres: null,
            inaktiveringsdato: null,
            erSykmeldtMedArbeidsgiver: null,
            erIkkeArbeidssokerUtenOppfolging: null,
        });
    });
}

module.exports = mockVeilarboppfolging;
