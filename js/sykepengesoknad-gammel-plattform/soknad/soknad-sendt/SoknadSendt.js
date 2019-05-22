import React, { Component } from 'react';
import { BekreftetKorrektInformasjon, scrollTo, SoknadOppsummering, sykepengesoknadstatuser, Utvidbar, VaerKlarOverAt } from '@navikt/digisyfo-npm';
import Soknadstatuspanel from '../../statuspanel/Soknadstatuspanel';
import { sykepengesoknad as sykepengesoknadPt } from '../../../propTypes/index';
import RelaterteSoknaderContainer from '../../relaterte-soknader/RelaterteSoknaderContainer';
import KorrigertAvContainer from './KorrigertAvContainer';
import SykepengesoknadHeader from '../../../components/soknad-felles/SykepengesoknadHeader';
import SykmeldingUtdragContainer from '../../SykmeldingUtdragContainer';

const { KORRIGERT, SENDT, TIL_SENDING } = sykepengesoknadstatuser;

class SoknadSendt extends Component {
    scrollTilTopp() {
        scrollTo(this.sendtSoknad, 300);
    }

    render() {
        const { sykepengesoknad } = this.props;
        const oppsummeringsoknad = sykepengesoknad.oppsummering;

        return (<div ref={(c) => {
            this.sendtSoknad = c;
        }}>
            <SykepengesoknadHeader sykepengesoknad={sykepengesoknad} />
            {
                sykepengesoknad.status === KORRIGERT
                    && <KorrigertAvContainer sykepengesoknad={sykepengesoknad} />
            }
            <Soknadstatuspanel sykepengesoknad={sykepengesoknad} />
            <SykmeldingUtdragContainer sykepengesoknad={sykepengesoknad} />
            <Utvidbar tittel="Oppsummering" className="blokk">
                <div className="blokk--s">
                    <SoknadOppsummering oppsummeringsoknad={sykepengesoknad.oppsummering} />
                </div>
                <BekreftetKorrektInformasjon oppsummeringsoknad={sykepengesoknad.oppsummering} />
            </Utvidbar>
            <div className="redaksjonelt-innhold oppsummering__vaerKlarOverAt panel blokk">
                <VaerKlarOverAt oppsummeringsoknad={oppsummeringsoknad} />
            </div>
            {(sykepengesoknad.status === SENDT || sykepengesoknad.status === TIL_SENDING) &&
            <RelaterteSoknaderContainer sykepengesoknadId={sykepengesoknad.id} />}
        </div>);
    }
}

SoknadSendt.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

export default SoknadSendt;
