const MILLISEKUNDER_PER_DAG = 86400000;

export const leggTilDagerPaaDato = (dato, dager) => {
    const nyDato = new Date(dato);
    nyDato.setTime(nyDato.getTime() + (dager * MILLISEKUNDER_PER_DAG));
    return new Date(nyDato);
};

export const leggTilMnderPaaDato = (dato, mnder) => {
    const nyDato = new Date(dato);
    nyDato.setMonth(nyDato.getMonth() + mnder);
    return new Date(nyDato);
};

export const leggTilMnderOgDagerPaaDato = (dato, mnder, dager) => {
    let nyDato = leggTilMnderPaaDato(dato, mnder);
    nyDato = leggTilDagerPaaDato(nyDato, dager);
    return new Date(nyDato);
};
