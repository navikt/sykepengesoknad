import getContextRoot from './getContextRoot';

const url = window && window.location && window.location.href
    ? window.location.href
    : '';

export const getUrlTilSoknader = () => {
    return getContextRoot();
};

export const getUrlTilSoknad = (soknadId, side) => {
    const baseUrl = `${getUrlTilSoknader()}/soknader/${soknadId}`;
    return side
        ? `${baseUrl}/${side}`
        : baseUrl;
};

export const getUrlTilFravaerOgFriskmelding = (soknadId) => {
    return getUrlTilSoknad(soknadId, 'fravaer-og-friskmelding');
};

export const getUrlTilAktiviteterISykmeldingsperioden = (soknadId) => {
    return getUrlTilSoknad(soknadId, 'aktiviteter-i-sykmeldingsperioden');
};

export const getUrlTilOppsummering = (soknadId) => {
    return getUrlTilSoknad(soknadId, 'oppsummering');
};

export const getUrlTilKvittering = (soknadId) => {
    return getUrlTilSoknad(soknadId, 'kvittering');
};

export const getUrlTilSykmelding = (sykmeldingId) => {
    return `${process.env.REACT_APP_SYKEFRAVAER_CONTEXT_ROOT}/sykmeldinger/${sykmeldingId}/`;
};
export const erDemoApp = () => {
    return url.indexOf('labs.nais.io') > -1;
};

export const erLocalhost = () => {
    return url.indexOf('localhost') > -1;
};

export const erProduksjon = () => {
    return url.indexOf('tjenester.nav') > -1;
};

export const erQ1 = () => {
    return url.indexOf('tjenester-q1') > -1;
};

export const erProduksjonEllerQ1 = () => {
    return erProduksjon() || erQ1();
};

export const getSykefravaerUrl = () => {
    return erDemoApp()
        ? 'https://sykefravaer.labs.nais.io/'
        : process.env.REACT_APP_SYKEFRAVAER_CONTEXT_ROOT;
};
