import React from 'react';
import PropTypes from 'prop-types';
import FeiloppsummeringContainer from '../../../containers/skjema/FeiloppsummeringContainer';
import { getSkjemanavnFraSoknad } from '../../utils/getSkjemanavnFraSoknad';
import Sporsmalsliste from '../sporsmal/Sporsmalsliste';
import KnapperadEttSporsmalPerSide from './KnapperadEttSporsmalPerSide';
import AvbrytSoknadContainer from '../avbryt-soknad/AvbrytSoknadContainer';
import { soknadPt } from '../../../propTypes/index';
import { hentSporsmalForDenneSiden } from './ettSporsmalPerSideUtils';
import OppdaterFeiletFeilstripe from './OppdaterFeiletFeilstripe';

export const GenereltEttSporsmalPerSideSkjema = (props) => {
    const { handleSubmit, soknad, actions, sidenummer } = props;
    const sporsmalsliste = hentSporsmalForDenneSiden(soknad, sidenummer);
    const onSubmit = () => {
        actions.lagreSoknad(soknad, sidenummer);
    };

    return (<form className="soknadskjema" id="ett-sporsmal-per-side" onSubmit={handleSubmit(onSubmit)}>
        <FeiloppsummeringContainer skjemanavn={getSkjemanavnFraSoknad(soknad)} />
        <Sporsmalsliste sporsmalsliste={sporsmalsliste} soknad={soknad} />
        <OppdaterFeiletFeilstripe soknad={soknad} />
        <KnapperadEttSporsmalPerSide soknad={soknad} sidenummer={sidenummer} />
        <AvbrytSoknadContainer sykepengesoknad={soknad} />
    </form>);
};

GenereltEttSporsmalPerSideSkjema.propTypes = {
    handleSubmit: PropTypes.func,
    soknad: soknadPt,
    actions: PropTypes.shape({
        lagreSoknad: PropTypes.func,
    }),
    sidenummer: PropTypes.number,
};
