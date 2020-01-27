import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { Bjorn, scrollTo, getLedetekst } from '@navikt/digisyfo-npm';
import { UTKAST_TIL_KORRIGERING } from '../../enums/soknadstatuser';
import KorrigerVarsel from '../../../components/soknad-felles/KorrigerVarsel';
import TidligSoknad from '../../../components/soknad-felles/TidligSoknad';
import { soknadPt } from '../../prop-types/soknadProptype';
import StegindikatorEttSporsmalPerSide from './StegindikatorEttSporsmalPerSide';
import SykmeldingUtdrag from '../sykmelding-utdrag/SykmeldingUtdrag';
import { getUrlTilSoknad } from '../../../utils/urlUtils';
import { ARBEIDSTAKERE, BEHANDLINGSDAGER } from '../../enums/soknadtyper';

class Soknadskjema extends Component {
    componentDidMount() {
        if (this.props.scroll) {
            scrollTo(this.stegindikator, 0);
        }
    }

    render() {
        const { children, sidenummer = null, tittel, soknad, intro = null } = this.props;
        const forrigeUrl = getUrlTilSoknad(soknad.id, sidenummer - 1);

        return (
            <div>
                {sidenummer > 1 && (
                    <div
                        ref={(stegindikator) => {
                            this.stegindikator = stegindikator;
                        }}>
                        <StegindikatorEttSporsmalPerSide soknad={soknad} sidenummer={sidenummer} />
                    </div>
                )}
                {sidenummer > 1 && (
                    <p>
                        <Link to={forrigeUrl} className="tilbakelenke">
                            Tilbake
                        </Link>
                    </p>
                )}

                {soknad.status === UTKAST_TIL_KORRIGERING && <KorrigerVarsel />}
                <TidligSoknad soknad={soknad} />
                {intro}
                <SykmeldingUtdrag soknad={soknad} erApen={sidenummer === 1} />
                {tittel && <h2 className="soknad__stegtittel">{getLedetekst(tittel)}</h2>}

                {tittel === 'sykepengesoknad.ferie_v2.tittel' && soknad.soknadstype === ARBEIDSTAKERE &&
                <Bjorn className="blokk--s">{getLedetekst('sykepengesoknad.ferie_v2.bjorn')}</Bjorn>
                }

                {tittel === 'sykepengesoknad.fraver_for_behandling.tittel' && soknad.soknadstype === BEHANDLINGSDAGER &&
                <Bjorn className="blokk--l">{getLedetekst('sykepengesoknad.fraver_for_behandling.bjorn')}</Bjorn>
                }

                {tittel === 'sykepengesoknad.enkeltstaende_behandlingsdager.tittel' && soknad.soknadstype === BEHANDLINGSDAGER &&
                <Bjorn className="blokk--l">{getLedetekst('sykepengesoknad.enkeltstaende_behandlingsdager.bjorn')}</Bjorn>
                }

                {children}
            </div>
        );
    }
}

Soknadskjema.propTypes = {
    children: PropTypes.node,
    tittel: PropTypes.string,
    soknad: soknadPt,
    intro: PropTypes.node,
    sidenummer: PropTypes.number,
    scroll: PropTypes.bool,
};

Soknadskjema.defaultProps = {
    scroll: true,
};

export default Soknadskjema;
