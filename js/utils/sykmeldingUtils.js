export const getTidligsteStartdatoSykeforloep = (sykepengesoknad) => {
    return sykepengesoknad.oppfoelgingsdato && sykepengesoknad.oppfoelgingsdato < sykepengesoknad.identdato
        ? sykepengesoknad.oppfoelgingsdato
        : sykepengesoknad.identdato;
};

