import amplitude from 'amplitude-js';
import { post } from '../gateway-api';
import { erLocalhost, erProduksjon, erProduksjonEllerQ1 } from './urlUtils';

let amplitudeEnabled = false;
if (erProduksjonEllerQ1() || erLocalhost()) {
    post('/syfounleash/', Object.values(['syfo.amplitude'])).then((unleash) => {
        amplitudeEnabled = unleash['syfo.amplitude'];
    });
}

const apiKey = (erProduksjon())
    ? 'd5b43a81941b61a3b06059197807a25a' // prod
    : '7a887ba3e5a07c755526c6591810101a'; // test

const mockAmplitude = {
    logEvent: (eventName, eventProperties) => {
        if (erLocalhost()) {
            // eslint-disable-next-line no-console
            console.log(`Logger ${eventName} - Event properties: ${JSON.stringify(eventProperties)}!`);
        }
    },
    init: () => {
        // eslint-disable-next-line no-console
        console.log('Initialiserer mockAmplitude');
    },
};

const amplitudeInstance = (erProduksjonEllerQ1())
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

export function logEvent(eventName, eventProperties) {
    if (amplitudeEnabled) {
        amplitudeInstance.logEvent(eventName, eventProperties);
    }
}
