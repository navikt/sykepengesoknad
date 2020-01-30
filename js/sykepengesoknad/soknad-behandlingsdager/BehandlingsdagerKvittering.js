import 'dayjs/locale/nb';
import React, { Component } from 'react';
import { erSynligIViewport, getHtmlLedetekst, scrollTo, getLedetekst } from '@navikt/digisyfo-npm';
import { soknadPt } from '../../propTypes/index';
import { LenkeTilSoknader } from '../../sykepengesoknad/felleskomponenter/LenkeTilSoknader';
import './behandlingsdager-kvittering.less';
import Sidetopp from '../../components/Sidetopp';
import { getSendtTilSuffix } from '../../sykepengesoknad-gammel-plattform/utils/sykepengesoknadUtils';
import { IllustrertInnholdGronnHake } from '../../components/IllustrertInnhold';

class BehandlingsdagerKvittering extends Component {
    componentDidMount() {
        const el = this.kvittering;
        if (!erSynligIViewport(el)) {
            scrollTo(el, 200);
        }
    }

    render() {
        const { soknad } = this.props;
        return (<div ref={(c) => {
            this.kvittering = c;
        }}>
            <Sidetopp tittel="Kvittering" />
            <div className="panel js-kvittering blokk">
                <IllustrertInnholdGronnHake>
                    <h2 className="panel__tittel">{getLedetekst(`sykepengesoknad.kvittering${getSendtTilSuffix(soknad)}-behandlingsdager.tittel`)}</h2>
                    <div
                        className="redaksjonelt-innhold"
                        dangerouslySetInnerHTML={getHtmlLedetekst(`sykepengesoknad.kvittering${getSendtTilSuffix(soknad)}-behandlingsdager.tekst`, {
                            '%ARBEIDSGIVER%': soknad.arbeidsgiver ? soknad.arbeidsgiver.navn : '',
                        })} />
                </IllustrertInnholdGronnHake>
            </div>
            <p className="ikke-print blokk navigasjonsstripe">
                <LenkeTilSoknader />
            </p>
        </div>
        );
    }
}

BehandlingsdagerKvittering.propTypes = {
    soknad: soknadPt.isRequired,
};

export default BehandlingsdagerKvittering;
