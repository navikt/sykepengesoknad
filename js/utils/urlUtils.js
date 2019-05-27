import getContextRoot from './getContextRoot';

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
export const erHerokuApp = () => {
    const url = window
    && window.location
    && window.location.href
        ? window.location.href
        : '';

    return url.indexOf('herokuapp') > -1;
};
export const getSykefravaerUrl = () => {
    return erHerokuApp()
        ? 'https://sykefravaer.herokuapp.com'
        : process.env.REACT_APP_SYKEFRAVAER_CONTEXT_ROOT;
};
