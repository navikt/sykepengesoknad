import { getLedetekst } from '@navikt/digisyfo-npm';
import beregnSteg, { KVITTERING } from './beregnSteg';

const beregnBrodsmulesti = (sti, id) => {
    const dittSykefravaerSmule = {
        tittel: getLedetekst('landingsside.sidetittel'),
        sti: '/sykefravaer',
        erKlikkbar: true,
    };
    const soknaderSmule = {
        tittel: 'Søknader om sykepenger',
        sti: '/soknader/',
        erKlikkbar: true,
    };
    switch (beregnSteg(sti)) {
        case KVITTERING: {
            return [dittSykefravaerSmule, soknaderSmule, {
                tittel: 'Søknad',
                sti: `/soknader/${id}`,
                erKlikkbar: true,
            }, {
                tittel: 'Kvittering',
            }];
        }
        default: {
            return [dittSykefravaerSmule, soknaderSmule, {
                tittel: 'Søknad',
            }];
        }
    }
};

export default beregnBrodsmulesti;
