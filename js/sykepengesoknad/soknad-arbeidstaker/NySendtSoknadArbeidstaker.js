import React from 'react';
import { getLedetekst, sykmelding as sykmeldingPt, SykmeldingUtdrag, Utvidbar } from '@navikt/digisyfo-npm';
import { connect } from 'react-redux';
import Oppsummeringsvisning from '../felleskomponenter/oppsummering/Oppsummeringsvisning';
import { soknadPt } from '../../propTypes';
import SoknadHeader from '../felleskomponenter/SoknadHeader';
import { finnSykmelding } from '../utils/soknadSetup';
import { VAER_KLAR_OVER_AT } from '../enums/tagtyper';
import SykepengesoknadStatuspanel from '../felleskomponenter/statuspanel/SykepengesoknadStatuspanel';
import { KORRIGERT, SENDT } from '../enums/soknadstatuser';
import RelaterteSoknaderContainer from '../felleskomponenter/relaterte-soknader/RelaterteSoknaderContainer';
import KorrigertAvContainer from '../../sykepengesoknad-gammel-plattform/soknad/soknad-sendt/KorrigertAvContainer';
import { settErOppdelt } from '../utils/settErOppdelt';

const NySendtSoknadArbeidstaker = ({ sykmelding, soknad }) => {
    const { _erOppdelt } = settErOppdelt(soknad, sykmelding);
    return (<div>
        <SoknadHeader soknad={soknad} />
        { soknad.status === KORRIGERT && <KorrigertAvContainer sykepengesoknad={soknad} /> }
        <SykepengesoknadStatuspanel soknad={soknad} />
        {sykmelding && <SykmeldingUtdrag sykmelding={sykmelding} sykepengesoknad={{ _erOppdelt }} />}
        <Utvidbar
            tittel={getLedetekst('sykepengesoknad.oppsummering.tittel')}
            className="blokk js-soknad-oppsummering"
            erApen>
            <Oppsummeringsvisning
                soknad={{
                    ...soknad,
                    sporsmal: soknad.sporsmal.filter((s) => {
                        return s.tag !== VAER_KLAR_OVER_AT;
                    }),
                }} />
        </Utvidbar>
        <div className="panel oppsummering__vaerKlarOverAt js-vaer-klar-over-at blokk">
            <Oppsummeringsvisning
                soknad={{
                    ...soknad,
                    sporsmal: soknad.sporsmal.filter((s) => {
                        return s.tag === VAER_KLAR_OVER_AT;
                    }),
                }} />
        </div>
        {
            soknad.status === SENDT
            && <RelaterteSoknaderContainer soknad={soknad} />
        }
    </div>);
};

NySendtSoknadArbeidstaker.propTypes = {
    sykmelding: sykmeldingPt,
    soknad: soknadPt,
};

const mapStateToProps = (state, ownProps) => {
    return {
        sykmelding: finnSykmelding(state, ownProps),
    };
};

export default connect(mapStateToProps)(NySendtSoknadArbeidstaker);
