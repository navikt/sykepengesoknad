import React from 'react';
import { connect } from 'react-redux';
import { getLedetekst, sykmelding as sykmeldingPt, tilLesbarDatoMedArstall } from '@navikt/digisyfo-npm';
import { soknadPt } from '../../propTypes/index';
import Statuspanel, { StatusNokkelopplysning, Statusopplysninger } from '../../components/Statuspanel';
import SoknadHeader from '../felleskomponenter/SoknadHeader';
import GjenapneSoknad from '../felleskomponenter/gjenapne-soknad/GjenapneSoknadContainer';
import SykmeldingUtdragForBehandlingsdager from './sykmelding-utdrag/SykmeldingUtdragForBehandlingsdager';

const AvbruttSoknadBehandlingsdagerStatuspanel = ({ soknad }) => {
    return (
        <Statuspanel>
            <Statusopplysninger>
                <StatusNokkelopplysning tittel={getLedetekst('statuspanel.status')}>
                    <p>{getLedetekst('sykepengesoknad.status.AVBRUTT')}</p>
                </StatusNokkelopplysning>
                <StatusNokkelopplysning tittel="Dato avbrutt">
                    <p>
                        {tilLesbarDatoMedArstall(soknad.avbruttDato)}
                    </p>
                </StatusNokkelopplysning>
            </Statusopplysninger>
            <GjenapneSoknad sykepengesoknad={soknad} />
        </Statuspanel>
    );
};

AvbruttSoknadBehandlingsdagerStatuspanel.propTypes = {
    soknad: soknadPt,
};

const AvbruttSoknadBehandlingsdager = ({ soknad, sykmelding }) => {
    return (
        <div>
            <SoknadHeader soknad={soknad} />
            <AvbruttSoknadBehandlingsdagerStatuspanel soknad={soknad} />
            <SykmeldingUtdragForBehandlingsdager soknad={soknad} sykmelding={sykmelding} erApen />
        </div>
    );
};

AvbruttSoknadBehandlingsdager.propTypes = {
    soknad: soknadPt,
    sykmelding: sykmeldingPt,
};

const mapStateToProps = (state, { soknad }) => {
    return {
        sykmelding: state.dineSykmeldinger.data.find((sykmld) => {
            return sykmld.id === soknad.sykmeldingId;
        }),
    };
};

export default connect(mapStateToProps)(AvbruttSoknadBehandlingsdager);
