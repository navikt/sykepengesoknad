import React from 'react';
import PropTypes from 'prop-types';
import { getLedetekst, Utvidbar } from '@navikt/digisyfo-npm';
import { Hovedknapp } from 'nav-frontend-knapper';
import { soknadPt, skjemasvar as skjemasvarPt } from '../../../propTypes/index';
import Feilstripe from '../../../components/Feilstripe';
import Knapperad from '../../../components/skjema/Knapperad';
import populerSoknadMedSvar from '../../utils/populerSoknadMedSvar';
import Oppsummeringsvisning from '../../felleskomponenter/oppsummering/Oppsummeringsvisning';
import { BEKREFT_OPPLYSNINGER, VAER_KLAR_OVER_AT } from '../../enums/tagtyper';
import Checkboxpanel from '../../felleskomponenter/sporsmal/Checkboxpanel';
import OppsummeringUndertekst from '../../felleskomponenter/oppsummering/OppsummeringUndertekst';
import AvbrytSoknadContainer from '../../felleskomponenter/avbryt-soknad/AvbrytSoknadContainer';

const OppsummeringUtvidbar = ({ soknad }) => {
    const _soknad = {
        ...soknad,
        sporsmal: soknad.sporsmal.filter((s) => {
            return s.tag !== VAER_KLAR_OVER_AT;
        }),
    };
    return (<Utvidbar className="blokk js-soknad-oppsummering" tittel={getLedetekst('sykepengesoknad.oppsummering.tittel')} erApen={false}>
        <Oppsummeringsvisning soknad={_soknad} />
    </Utvidbar>);
};

OppsummeringUtvidbar.propTypes = {
    soknad: soknadPt,
};

export const hentSporsmalForOppsummering = (soknad) => {
    return soknad.sporsmal.filter((s) => {
        return s.tag === BEKREFT_OPPLYSNINGER;
    });
};

export const SykepengesoknadSelvstendigOppsummeringSkjema = (props) => {
    const { handleSubmit, soknad, skjemasvar, actions, sender, sendingFeilet } = props;
    const populertSoknad = populerSoknadMedSvar(soknad, skjemasvar);
    const sporsmal = hentSporsmalForOppsummering(soknad)[0];
    const vaerKlarOverAtSpm = soknad.sporsmal.find((s) => { return s.tag === VAER_KLAR_OVER_AT; });

    const onSubmit = () => {
        actions.sendSoknad(populertSoknad);
    };
    return (<form className="soknadskjema" id="oppsummering-skjema" onSubmit={handleSubmit(onSubmit)}>
        { skjemasvar && <OppsummeringUtvidbar soknad={populertSoknad} /> }
        <div className="blokk redaksjonelt-innhold oppsummering__vaerKlarOverAt">
            <OppsummeringUndertekst {...vaerKlarOverAtSpm} />
        </div>
        <div className="blokk">
            <Checkboxpanel {...sporsmal} name={sporsmal.tag} soknad={soknad} />
        </div>
        <Feilstripe vis={sendingFeilet} />
        <Knapperad variant="knapperad--medAvbryt">
            <Hovedknapp className="js-send" spinner={sender} disabled={sender}>{getLedetekst('sykepengesoknad.send')}</Hovedknapp>
        </Knapperad>
        <AvbrytSoknadContainer sykepengesoknad={soknad} />
    </form>);
};

SykepengesoknadSelvstendigOppsummeringSkjema.propTypes = {
    handleSubmit: PropTypes.func,
    soknad: soknadPt,
    skjemasvar: skjemasvarPt,
    actions: PropTypes.shape({
        sendSoknad: PropTypes.func,
    }),
    sender: PropTypes.bool,
    sendingFeilet: PropTypes.bool,
};
