import React from 'react';
import PropTypes from 'prop-types';
import {
    Bjorn,
    getLedetekst,
    SykmeldingNokkelOpplysning,
    SykmeldingPerioder,
    tilLesbarDatoMedArstall,
    tilLesbarPeriodeMedArstall,
    Utvidbar,
} from '@navikt/digisyfo-npm';
import EndreArbeidssituasjon from '../endre-arbeidssituasjon/EndreArbeidssituasjon';
import { sykmelding as sykmeldingPt } from '../../../propTypes';

export const SykmeldingopplysningForsikring = ({ sykmelding, className }) => {
    const nokkel = sykmelding.sporsmal.harForsikring
        ? 'sykepengesoknad.sykmelding-utdrag.forsikring-ja-2'
        : 'sykepengesoknad.sykmelding-utdrag.forsikring-nei';
    return sykmelding.sporsmal.harForsikring !== null
        ? (<SykmeldingNokkelOpplysning
            className={className}
            tittel={getLedetekst('sykepengesoknad.sykmelding-utdrag.forsikring')}>
            <p>{getLedetekst(nokkel)}</p>
        </SykmeldingNokkelOpplysning>)
        : null;
};

SykmeldingopplysningForsikring.propTypes = {
    sykmelding: sykmeldingPt,
    className: PropTypes.string,
};

export const SykmeldingopplysningFravaersperioder = ({ sykmelding, className }) => {
    return sykmelding.sporsmal.harAnnetFravaer !== null
        ? (<SykmeldingNokkelOpplysning
            className={className}
            tittel={getLedetekst('sykepengesoknad.sykmelding-utdrag.egenmelding-papir')}>
            {
                sykmelding.sporsmal.fravaersperioder.length > 0
                    ? (<ul className="nokkelopplysning__liste">
                        {
                            sykmelding.sporsmal.fravaersperioder.map((p) => {
                                return <li key={tilLesbarDatoMedArstall(p.fom)}>{tilLesbarPeriodeMedArstall(p.fom, p.tom)}</li>;
                            })
                        }
                    </ul>)
                    : (<p>{getLedetekst('sykepengesoknad.sykmelding-utdrag.egenmelding-papir-nei')}</p>)
            }
        </SykmeldingNokkelOpplysning>)
        : null;
};

SykmeldingopplysningFravaersperioder.propTypes = {
    sykmelding: sykmeldingPt,
    className: PropTypes.string,
};

const SykmeldingUtdragForSelvstendige = ({ erApen, sykmelding, erOppdelt }) => {
    return (
        <Utvidbar
            className="blokk js-sykmelding-utdrag"
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
                <SykmeldingNokkelOpplysning tittel={getLedetekst('sykepengesoknad.sykmelding-utdrag.dato-sykmeldingen-ble-skrevet')}>
                    <p className="js-utstedelsesdato">{tilLesbarDatoMedArstall(sykmelding.bekreftelse.utstedelsesdato)}</p>
                </SykmeldingNokkelOpplysning>
                <SykmeldingNokkelOpplysning tittel={getLedetekst('din-sykmelding.arbeidssituasjon.tittel.2')}>
                    <div>
                        <p className="js-arbeidssituasjon blokk--s">
                            {getLedetekst(`din-sykmelding.arbeidssituasjon.alternativ.${sykmelding.valgtArbeidssituasjon.toLowerCase()}`)}
                        </p>
                        <EndreArbeidssituasjon sykmelding={sykmelding} />
                    </div>
                </SykmeldingNokkelOpplysning>
                <SykmeldingopplysningFravaersperioder sykmelding={sykmelding} />
                <SykmeldingopplysningForsikring sykmelding={sykmelding} />
            </div>
        </Utvidbar>
    );
};

SykmeldingUtdragForSelvstendige.propTypes = {
    erApen: PropTypes.bool,
    erOppdelt: PropTypes.bool,
    sykmelding: sykmeldingPt,
};

export default SykmeldingUtdragForSelvstendige;
