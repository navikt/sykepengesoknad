import React from 'react';
import PropTypes from 'prop-types';
import { getLedetekst, sykepengesoknadstatuser } from '@navikt/digisyfo-npm';
import Alertstripe from 'nav-frontend-alertstriper';
import Sidetopp from '../../components/Sidetopp';
import SoknadTeasere from './SoknaderTeasere';
import { sykepengesoknad as sykepengesoknadPt, soknadPt } from '../../propTypes/index';
import { sorterEtterPerioder, sorterEtterOpprettetDato } from '../utils/sorterSoknader';
import FremtidigSoknadTeaser from './FremtidigSoknadTeaser';
import UtbetalingerLenke from './UtbetalingerLenke';
import { Vis } from '../../utils/index';

const { SENDT, TIL_SENDING, UTGAATT, NY, UTKAST_TIL_KORRIGERING, FREMTIDIG, AVBRUTT } = sykepengesoknadstatuser;

export const filtrerOgSorterNyeSoknader = (soknader) => {
    return [...soknader].filter((soknad) => {
        return soknad.status === NY || soknad.status === UTKAST_TIL_KORRIGERING;
    }).sort(sorterEtterOpprettetDato);
};

const Soknader = ({ sykepengesoknader = [], soknader = [], visFeil }) => {
    const nyeSoknader = filtrerOgSorterNyeSoknader([...sykepengesoknader, ...soknader]);
    const tidligereSoknader = [...sykepengesoknader, ...soknader]
        .filter((soknad) => {
            return soknad.status === SENDT || soknad.status === TIL_SENDING || soknad.status === UTGAATT || soknad.status === AVBRUTT;
        })
        .sort(sorterEtterPerioder);
    const fremtidigeSoknader = [...sykepengesoknader, ...soknader]
        .filter((soknad) => {
            return soknad.status === FREMTIDIG;
        })
        .sort(sorterEtterPerioder)
        .reverse();

    return (<div>
        <Sidetopp
            tittel={getLedetekst('soknader.sidetittel')}
        />
        <Vis
            hvis={visFeil}
            render={() => {
                return (<Alertstripe type="advarsel" className="blokk">
                    <p className="sist"><strong>Oops! </strong> Vi kunne ikke hente alle dine sykepengesøknader.</p>
                </Alertstripe>);
            }} />
        <SoknadTeasere
            soknader={nyeSoknader}
            tittel={getLedetekst('soknader.venter-paa-behandling.tittel')}
            tomListeTekst={getLedetekst('soknader.venter-paa-behandling.ingen-soknader')}
            className="js-til-behandling"
            id="soknader-list-til-behandling"
        />
        {
            fremtidigeSoknader.length > 0 && <SoknadTeasere
                Child={FremtidigSoknadTeaser}
                soknader={fremtidigeSoknader}
                tittel={getLedetekst('soknader.planlagt.tittel')}
                className="js-planlagt"
                id="soknader-planlagt"
            />
        }
        <UtbetalingerLenke />
        {
            tidligereSoknader.length > 0 && (<SoknadTeasere
                soknader={tidligereSoknader}
                tittel={getLedetekst('soknader.sendt.tittel')}
                className="js-sendt"
                id="soknader-sendt"
            />)
        }
    </div>);
};

Soknader.propTypes = {
    sykepengesoknader: PropTypes.arrayOf(sykepengesoknadPt),
    soknader: PropTypes.arrayOf(soknadPt),
    visFeil: PropTypes.bool,
};

export default Soknader;
