import amplitude from 'amplitude-js';
import { post } from '../gateway-api';

export function hentUnleashToggle() {
    try {
        return post('/syfounleash/', Object.values(['syfo.amplitude']));
    } catch (e) {
        return { 'syfo.amplitude': false };
    }
}

const url = window && window.location && window.location.href
    ? window.location.href
    : '';
const apiKey = (url.indexOf('tjenester.nav') > -1)
    ? 'd5b43a81941b61a3b06059197807a25a'
    : '7a887ba3e5a07c755526c6591810101a';

const mockAmplitude = {
    logEvent: (logEvent, eventProperties) => {
        if (url.indexOf('localhost') > -1) {
            // eslint-disable-next-line no-console
            console.log(`Logger ${logEvent} - Event properties: ${JSON.stringify(eventProperties)}!`);
        }
    },
    init: () => {},
};

const amplitudeInstance = (url.indexOf('tjenester') > -1 && hentUnleashToggle()['syfo.amplitude'] === true)
    ? amplitude.getInstance()
    : mockAmplitude;
amplitudeInstance.init(
    apiKey, null, {
        apiEndpoint: 'amplitude.nav.no/collect',
        saveEvents: false, // midlertidig frem til at nav.amplitude.no oppfører seg som forventet?
        includeUtm: true,
        batchEvents: false,
        includeReferrer: true,
        trackingOptions: {
            city: false,
            ip_address: false,
            version_name: false,
            region: false,
            country: false,
            dma: false,
        },
    },
);

amplitudeInstance._userAgent = '';


export default amplitudeInstance;
