import React from 'react';
import PropTypes from 'prop-types';
import {
    Bjorn,
    getLedetekst,
    SykmeldingNokkelOpplysning,
    SykmeldingPerioder,
    tilLesbarDatoMedArstall,
    Utvidbar,
} from '@navikt/digisyfo-npm';
import { sykmelding as sykmeldingPt } from '../../../propTypes';

const SykmeldingUtdragForBehandlingsdager = ({ erApen, sykmelding, erOppdelt }) => {
    return (<div className="blokk">
        <Utvidbar
            Overskrift="h2"
            erApen={erApen}
            visLukklenke={!erApen}
            tittel={getLedetekst('sykepengesoknad.sykmelding-utdrag.tittel')}
            variant="lilla"
            ikon="svg/plaster.svg"
            ikonHover="svg/plaster_hover.svg"
            ikonAltTekst="Plaster-ikon">
            <div>
                <SykmeldingPerioder perioder={sykmelding.mulighetForArbeid.perioder} />
                {
                    erOppdelt
                    && <Bjorn className="blokk" nokkel="sykepengesoknad.sykmelding-utdrag.oppdelt.bjorn" />
                }
                <SykmeldingNokkelOpplysning
                    tittel={getLedetekst('sykepengesoknad.sykmelding-utdrag.dato-sykmeldingen-ble-skrevet')}>
                    <p className="js-utstedelsesdato">{tilLesbarDatoMedArstall(sykmelding.bekreftelse.utstedelsesdato)}</p>
                </SykmeldingNokkelOpplysning>
            </div>
        </Utvidbar>
    </div>);
};

SykmeldingUtdragForBehandlingsdager.propTypes = {
    erApen: PropTypes.bool,
    erOppdelt: PropTypes.bool,
    sykmelding: sykmeldingPt,
};

export default SykmeldingUtdragForBehandlingsdager;
