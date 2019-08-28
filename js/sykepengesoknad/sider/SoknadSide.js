import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { sykepengesoknad as sykepengesoknadPt } from '@navikt/digisyfo-npm';
import * as soknaderActions from '../data/soknader/soknaderActions';
import * as sykepengesoknaderActions from '../../sykepengesoknad-gammel-plattform/data/sykepengesoknader/sykepengesoknader_actions';
import * as dineSykmeldingerActions from '../../data/dine-sykmeldinger/dineSykmeldingerActions';
import Feilmelding from '../../components/Feilmelding';
import SideHvit from '../../sider/SideHvit';
import Side from '../../sider/Side';
import { ARBEIDSTAKERE, OPPHOLD_UTLAND, SELVSTENDIGE_OG_FRILANSERE, ARBEIDSLEDIG } from '../enums/soknadtyper';
import SykepengesoknadUtlandSkjemaContainer from '../soknad-utland/skjema/SoknadUtlandSkjemaContainer';
import {
    ArbeidsledigSoknadTrigger,
    ArbeidstakerSoknadHotjarTrigger,
    FrilanserSoknadHotjarTrigger,
    NyArbeidstakerSoknadHotjarTrigger,
    SykepengerUtlandSoknadTrigger
} from '../../components/HotjarTrigger';
import beregnBrodsmulesti from '../utils/beregnBrodsmulesti';
import SoknadSelvstendigNaeringsdrivendeSkjema from '../soknad-selvstendig-frilanser/SoknadSelvstendigNaeringsdrivende';
import SoknadController from '../../sykepengesoknad-gammel-plattform/soknad/SoknadController';
import NySoknadArbeidstaker from '../soknad-arbeidstaker/NySoknadArbeidstaker';
import { NY, UTKAST_TIL_KORRIGERING } from '../enums/soknadstatuser';
import SykepengesoknadBanner from '../../components/soknad-felles/SykepengersoknadBanner';
import { soknadPt } from '../prop-types/soknadProptype';
import { brodsmule } from '../../propTypes';
import SoknadArbeidsledig from '../soknad-arbeidsledig/SoknadArbeidsledig';
import { selectSykepengesoknaderData } from '../../sykepengesoknad-gammel-plattform/data/sykepengesoknader/sykepengesoknaderSelectors';
import { selectSoknaderData } from '../data/soknader/soknaderSelectors';

const soknadSkalUtfylles = (soknad) => {
    return soknad && (soknad.status === NY || soknad.status === UTKAST_TIL_KORRIGERING);
};

const SoknadWrapper = ({ soknad, children, brodsmuler }) => {
    return soknadSkalUtfylles(soknad)
        ? (
            <React.Fragment>
                <SykepengesoknadBanner soknad={soknad} brodsmuler={brodsmuler} />
                <div className="begrensning begrensning--soknad">
                    {children}
                </div>
            </React.Fragment>
        )
        : children;
};

SoknadWrapper.propTypes = {
    soknad: soknadPt,
    children: PropTypes.node,
    brodsmuler: PropTypes.arrayOf(brodsmule),
};

export class Container extends Component {
    componentDidMount() {
        this.props.actions.hentSykepengesoknader();
        this.props.actions.oppdaterSoknader();
        this.props.actions.hentDineSykmeldinger();
    }

    componentDidUpdate() {
        this.props.actions.hentDineSykmeldinger();
    }

    render() {
        const {
            erArbeidstakersoknad,
            erSelvstendigNaeringsdrivendeSoknad,
            erSoknadOmUtenlandsopphold,
            erNyArbeidstakersoknad,
            erArbeidsledigsoknad,
            skalHenteSykmeldinger,
            henter,
            sti,
            soknad,
            sykepengesoknad,
        } = this.props;

        const brodsmuler = beregnBrodsmulesti(sti, this.props.soknadId);
        const SoknadSide = soknadSkalUtfylles(soknad || sykepengesoknad) ? SideHvit : Side;
        return (
            <SoknadSide brodsmuler={brodsmuler} tittel="Søknad om sykepenger" laster={skalHenteSykmeldinger || henter}>
                <SoknadWrapper soknad={erArbeidstakersoknad ? sykepengesoknad : soknad} brodsmuler={brodsmuler}>
                    {(() => {
                        if (henter) {
                            return <div />;
                        }
                        if (erArbeidstakersoknad) {
                            return (
                                <ArbeidstakerSoknadHotjarTrigger>
                                    <SoknadController {...this.props} />
                                </ArbeidstakerSoknadHotjarTrigger>
                            );
                        } else if (erSelvstendigNaeringsdrivendeSoknad) {
                            return (
                                <FrilanserSoknadHotjarTrigger>
                                    <SoknadSelvstendigNaeringsdrivendeSkjema {...this.props} />
                                </FrilanserSoknadHotjarTrigger>
                            );
                        } else if (erSoknadOmUtenlandsopphold) {
                            return (
                                <SykepengerUtlandSoknadTrigger>
                                    <SykepengesoknadUtlandSkjemaContainer {...this.props} />
                                </SykepengerUtlandSoknadTrigger>
                            );
                        } else if (erNyArbeidstakersoknad) {
                            return (
                                <NyArbeidstakerSoknadHotjarTrigger>
                                    <NySoknadArbeidstaker {...this.props} />
                                </NyArbeidstakerSoknadHotjarTrigger>
                            );
                        } else if (erArbeidsledigsoknad) {
                            return (
                                <ArbeidsledigSoknadTrigger>
                                    <SoknadArbeidsledig {...this.props} />
                                </ArbeidsledigSoknadTrigger>
                            );
                        }
                        return <Feilmelding />;
                    })()}
                </SoknadWrapper>
            </SoknadSide>
        );
    }
}

Container.propTypes = {
    actions: PropTypes.shape({
        hentSykepengesoknader: PropTypes.func,
        hentSoknader: PropTypes.func,
        hentDineSykmeldinger: PropTypes.func,
        oppdaterSoknader: PropTypes.func,
    }),
    skalHenteSykepengesoknader: PropTypes.bool,
    skalHenteSoknader: PropTypes.bool,
    skalHenteSykmeldinger: PropTypes.bool,
    erArbeidstakersoknad: PropTypes.bool,
    erSelvstendigNaeringsdrivendeSoknad: PropTypes.bool,
    erSoknadOmUtenlandsopphold: PropTypes.bool,
    erNyArbeidstakersoknad: PropTypes.bool,
    erArbeidsledigsoknad: PropTypes.bool,
    sti: PropTypes.string,
    henter: PropTypes.bool,
    soknadId: PropTypes.string,
    soknad: soknadPt,
    sykepengesoknad: sykepengesoknadPt,
};

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            ...sykepengesoknaderActions,
            ...soknaderActions,
            ...dineSykmeldingerActions,
        }, dispatch),
    };
}

export const mapStateToProps = (state, ownProps) => {
    const soknadId = ownProps.params.sykepengesoknadId;
    const finnSoknad = (s) => {
        return s.id === soknadId;
    };
    const soknad = selectSoknaderData(state).find(finnSoknad);
    const sykepengesoknad = selectSykepengesoknaderData(state).find(finnSoknad);
    const erSelvstendigNaeringsdrivendeSoknad = soknad !== undefined && soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE;
    const erSoknadOmUtenlandsopphold = soknad !== undefined && soknad.soknadstype === OPPHOLD_UTLAND;
    const erNyArbeidstakersoknad = soknad !== undefined && soknad.soknadstype === ARBEIDSTAKERE;
    const erArbeidsledigsoknad = soknad !== undefined && soknad.soknadstype === ARBEIDSLEDIG;
    const erArbeidstakersoknad = sykepengesoknad !== undefined;
    const skalHenteSykmeldinger = !state.dineSykmeldinger.hentet && !state.dineSykmeldinger.henter;
    const henter = state.soknader.henter
        || state.sykepengesoknader.henter
        || state.ledetekster.henter
        || (skalHenteSykmeldinger);
    const hentingFeilet = state.soknader.hentingFeilet || state.sykepengesoknader.hentingFeilet || state.ledetekster.hentingFeilet;
    const sti = ownProps.location.pathname;
    const stegSomNummer = parseInt(ownProps.params.steg, 10);
    const sidenummer = erNyArbeidstakersoknad || erSelvstendigNaeringsdrivendeSoknad || erArbeidsledigsoknad
        ? (
            isNaN(stegSomNummer)
                ? 1
                : stegSomNummer
        ) : undefined;

    return {
        soknadId,
        erSelvstendigNaeringsdrivendeSoknad,
        erSoknadOmUtenlandsopphold,
        erArbeidstakersoknad,
        erNyArbeidstakersoknad,
        erArbeidsledigsoknad,
        henter,
        hentingFeilet,
        sti,
        soknad,
        sykepengesoknad,
        sidenummer,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
