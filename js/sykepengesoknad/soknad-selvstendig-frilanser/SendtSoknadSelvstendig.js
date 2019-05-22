import React from 'react';
import { getLedetekst, sykmelding as sykmeldingPt, Utvidbar } from '@navikt/digisyfo-npm';
import { connect } from 'react-redux';
import SykmeldingUtdragForSelvstendige from './sykmelding-utdrag/SykmeldingUtdragForSelvstendige';
import Oppsummeringsvisning from '../felleskomponenter/oppsummering/Oppsummeringsvisning';
import { soknadPt } from '../../propTypes/index';
import SoknadHeader from '../felleskomponenter/SoknadHeader';
import { finnSykmelding } from '../utils/soknadSetup';
import { VAER_KLAR_OVER_AT } from '../enums/tagtyper';
import RelaterteSoknaderContainer from '../felleskomponenter/relaterte-soknader/RelaterteSoknaderContainer';
import { SENDT } from '../enums/soknadstatuser';
import SykepengesoknadStatuspanel from '../felleskomponenter/statuspanel/SykepengesoknadStatuspanel';

const SendtSoknadSelvstendig = ({ sykmelding, soknad }) => {
    return (<div>
        <SoknadHeader soknad={soknad} />
        <SykepengesoknadStatuspanel soknad={soknad} />
        {sykmelding && <SykmeldingUtdragForSelvstendige sykmelding={sykmelding} />}
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
        <div className="panel js-vaer-klar-over-at redaksjonelt-innhold oppsummering__vaerKlarOverAt">
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

SendtSoknadSelvstendig.propTypes = {
    sykmelding: sykmeldingPt,
    soknad: soknadPt,
};

const mapStateToProps = (state, ownProps) => {
    return {
        sykmelding: finnSykmelding(state, ownProps),
    };
};

export default connect(mapStateToProps)(SendtSoknadSelvstendig);

