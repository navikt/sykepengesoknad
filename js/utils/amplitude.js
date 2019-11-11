import amplitude from 'amplitude-js';
import { post } from '../gateway-api';

function hentUnleashToggle() {
    try {
        return post('/syfounleash/', Object.values(['syfo.amplitude']));
    } catch (e) {
        return { 'syfo.amplitude': false };
    }
}

const unleash = hentUnleashToggle()['syfo.amplitude'];

const url = window && window.location && window.location.href
    ? window.location.href
    : '';
const apiKey = (url.indexOf('tjenester.nav') > -1)
    ? 'd5b43a81941b61a3b06059197807a25a' // prod
    : '7a887ba3e5a07c755526c6591810101a'; // test

const mockAmplitude = {
    logEvent: (logEvent, eventProperties) => {
        if (url.indexOf('localhost') > -1) {
            // eslint-disable-next-line no-console
            console.log(`Logger ${logEvent} - Event properties: ${JSON.stringify(eventProperties)}!`);
        }
    },
    init: () => {
        // eslint-disable-next-line no-console
        console.log('Initialiserer mockAmplitude');
    },
};

const amplitudeInstance = (url.indexOf('tjenester') > -1 && unleash === true)
    ? amplitude.getInstance() // test/prod
    : mockAmplitude; // lokalt
amplitudeInstance.init(
    apiKey, null, {
        apiEndpoint: 'amplitude.nav.no/collect',
        saveEvents: false,
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
