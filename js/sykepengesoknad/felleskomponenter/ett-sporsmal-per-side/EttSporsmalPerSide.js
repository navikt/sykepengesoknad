import React from 'react';
import PropTypes from 'prop-types';
import { sykmelding as sykmeldingPt } from '@navikt/digisyfo-npm';
import Soknadskjema from './Soknadskjema';
import { skjemasvar as skjemasvarPt, soknadMetaReducerPt, soknadPt } from '../../../propTypes/index';
import AppSpinner from '../../../components/AppSpinner';
import { erSisteSide, hentNokkel } from './ettSporsmalPerSideUtils';
import { SykepengesoknadArbeidstakerOppsummeringSkjema } from '../../soknad-arbeidstaker/oppsummering/Oppsummering';
import { ForDuBegynnerSkjema } from './ForDuBegynnerSkjema';
import { GenereltEttSporsmalPerSideSkjema } from './GenereltEttSporsmalPerSideSkjema';
import { ARBEIDSTAKERE, BEHANDLINGSDAGER } from '../../enums/soknadtyper';
import { SykepengesoknadSelvstendigOppsummeringSkjema } from '../../soknad-selvstendig-frilanser/oppsummering/SykepengesoknadSelvstendigOppsummeringSkjema';
import SoknadIntro from '../soknad-intro/SoknadIntro';
import { ARBEIDSSITUASJON_ARBEIDSTAKER } from '../../enums/arbeidssituasjon';

export const hentSporsmalsvisning = (soknad, sidenummer, sykmelding) => {
    return erSisteSide(soknad, sidenummer)
        ? (
            soknad.soknadstype === ARBEIDSTAKERE || (soknad.soknadstype === BEHANDLINGSDAGER && sykmelding.sporsmal.arbeidssituasjon === ARBEIDSSITUASJON_ARBEIDSTAKER)
                ? SykepengesoknadArbeidstakerOppsummeringSkjema
                : SykepengesoknadSelvstendigOppsummeringSkjema
        )
        : sidenummer === 1
            ? ForDuBegynnerSkjema
            : GenereltEttSporsmalPerSideSkjema;
};

const EttSporsmalPerSide = (props) => {
    const { sykmelding, soknad, handleSubmit, actions, sidenummer, oppdaterer, skjemasvar, sendingFeilet, soknadMeta, sender } = props;
    const Sporsmalsvisning = hentSporsmalsvisning(soknad, sidenummer, sykmelding);
    const intro = sidenummer === 1 ? <SoknadIntro soknad={soknad} /> : null;
    const scroll = sidenummer !== 1 && !erSisteSide(soknad, sidenummer);
    const tittel = hentNokkel(soknad, sidenummer);

    return (<Soknadskjema
        scroll={scroll}
        sidenummer={sidenummer}
        tittel={tittel}
        intro={intro}
        soknad={soknad}>
        {
            oppdaterer
                ? <AppSpinner />
                : <Sporsmalsvisning
                    soknad={soknad}
                    sykmelding={sykmelding}
                    handleSubmit={handleSubmit}
                    skjemasvar={skjemasvar}
                    sendingFeilet={sendingFeilet || soknadMeta.hentingFeilet}
                    sender={sender}
                    actions={actions}
                    sidenummer={sidenummer} />
        }
    </Soknadskjema>);
};

EttSporsmalPerSide.propTypes = {
    sykmelding: sykmeldingPt,
    soknad: soknadPt,
    handleSubmit: PropTypes.func,
    actions: PropTypes.shape({
        lagreSoknad: PropTypes.func,
        sendSoknad: PropTypes.func,
    }),
    sidenummer: PropTypes.number,
    oppdaterer: PropTypes.bool,
    skjemasvar: skjemasvarPt,
    sendingFeilet: PropTypes.bool,
    sender: PropTypes.bool,
    soknadMeta: soknadMetaReducerPt,
};

export default EttSporsmalPerSide;
