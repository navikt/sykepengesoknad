import React, { Component } from 'react';
import { getLedetekst } from '@navikt/digisyfo-npm';
import FeiloppsummeringContainer from '../../../containers/skjema/FeiloppsummeringContainer';
import { getSkjemanavnFraSoknad } from '../../utils/getSkjemanavnFraSoknad';
import Checkboxpanel from '../sporsmal/Checkboxpanel';
import KnapperadEttSporsmalPerSide from './KnapperadEttSporsmalPerSide';
import AvbrytSoknadContainer from '../avbryt-soknad/AvbrytSoknadContainer';
import { GenereltEttSporsmalPerSideSkjema } from './GenereltEttSporsmalPerSideSkjema';
import { hentSporsmalForDenneSiden } from './ettSporsmalPerSideUtils';
import OppdaterFeiletFeilstripe from './OppdaterFeiletFeilstripe';

export class ForDuBegynnerSkjema extends Component {
    componentDidMount() {
        if (this.props.soknad) {
            this.props.actions.utfyllingStartet(this.props.soknad.id);
        }
    }

    render() {
        const { handleSubmit, soknad, actions, sidenummer } = this.props;
        const sporsmal = hentSporsmalForDenneSiden(soknad, sidenummer)[0];
        const onSubmit = () => {
            actions.lagreSoknad(soknad, sidenummer);
        };

        return (<form className="soknadskjema" id="ett-sporsmal-per-side" onSubmit={handleSubmit(onSubmit)}>
            <FeiloppsummeringContainer skjemanavn={getSkjemanavnFraSoknad(soknad)} />
            <div className="redaksjonelt-innhold">
                <p className="blokk">{getLedetekst('sykepengesoknad.bekreft-ansvar.introtekst')}</p>
                <Checkboxpanel {...sporsmal} name={sporsmal.tag} soknad={soknad} />
            </div>
            <OppdaterFeiletFeilstripe soknad={soknad} />
            <KnapperadEttSporsmalPerSide soknad={soknad} sidenummer={sidenummer} />
            <AvbrytSoknadContainer sykepengesoknad={soknad} />
        </form>);
    }
}

ForDuBegynnerSkjema.propTypes = GenereltEttSporsmalPerSideSkjema.propTypes;
