import amplitude from 'amplitude-js';
import store from '../store';

const url = window && window.location && window.location.href
    ? window.location.href
    : '';
const apiKey = (url.indexOf('tjenester.nav') > -1)
    ? 'd5b43a81941b61a3b06059197807a25a' // prod
    : '7a887ba3e5a07c755526c6591810101a'; // test

const mockAmplitude = {
    logEvent: (eventName, eventProperties) => {
        if (url.indexOf('localhost') > -1) {
            // eslint-disable-next-line no-console
            console.log(`Logger ${eventName} - Event properties: ${JSON.stringify(eventProperties)}!`);
        }
    },
    init: () => {
        // eslint-disable-next-line no-console
        console.log('Initialiserer mockAmplitude');
    },
};

const amplitudeInstance = (url.indexOf('tjenester') > -1)
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
    const state = store.getState();
    if (state.unleashToggles.data['syfo.amplitude'] === true) {
        amplitudeInstance.logEvent(eventName, eventProperties);
    }
}
