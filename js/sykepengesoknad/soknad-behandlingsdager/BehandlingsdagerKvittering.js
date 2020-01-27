import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import React, { Component } from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { erSynligIViewport, getHtmlLedetekst, scrollTo, getLedetekst, Bjorn } from '@navikt/digisyfo-npm';
import { soknadPt } from '../../propTypes/index';
import { LenkeTilSoknader } from '../../sykepengesoknad/felleskomponenter/LenkeTilSoknader';
import './behandlingsdager-kvittering.less';

class BehandlingsdagerKvittering extends Component {
    componentDidMount() {
        const el = this.kvittering;
        if (!erSynligIViewport(el)) {
            scrollTo(el, 200);
        }
    }

    render() {
        const { soknad } = this.props;
        return (
            <div ref={(c) => {
                this.kvittering = c;
            }}>
                <div className="panel js-kvittering blokk behandlingsdager-kvittering">
                    <img className="kvittering__ikon" src={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/konvolutt-ok.svg`} alt="" />
                    <Innholdstittel className="kvittering__tittel" tag="h2">
                        {getLedetekst('sykepengesoknad.kvittering.til-nav-behandlingsdager.tittel')}
                    </Innholdstittel>
                    <div className="redaksjonelt-innhold"
                        dangerouslySetInnerHTML={getHtmlLedetekst('sykepengesoknad.kvittering.til-nav-behandlingsdager.tekst', {
                            '%DATO%': dayjs(soknad.sendtTilNAVDato).locale('nb').format('D. MMMM YYYY, kl HH:mm'), '%TELEFON%': '55 55 33 33',
                        })}
                    />
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
