import { getLedetekst, sykmelding as sykmeldingPt } from '@navikt/digisyfo-npm';
import Knapp from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import Feilstripe from '../../../components/Feilstripe';
import Lightbox from '../../../components/Lightbox';

const EndreArbeidssituasjonLightbox = ({ isOpen, onClose, angreBekreftSykmelding, angrerBekreftSykmelding, angreBekreftSykmeldingFeilet, sykmelding }) => {
    return isOpen
        ? (<Lightbox bredde="m" onClose={onClose}>
            <h3 className="modal__tittel">{getLedetekst('din-sykmelding.arbeidssituasjon.tittel.2')}</h3>
            <p>{getLedetekst('din-sykmelding.gjenapne.lightboks.tekst')}</p>
            <Feilstripe vis={angreBekreftSykmeldingFeilet} />
            <div className="knapperad">
                <Knapp
                    spinner={angrerBekreftSykmelding}
                    disabled={angrerBekreftSykmelding}
                    onClick={(e) => {
                        e.preventDefault();
                        angreBekreftSykmelding(sykmelding.id);
                    }}
                    type="hoved"
                    className="blokk--s">{getLedetekst('din-sykmelding.gjenapne.lightboks.knapp')}</Knapp>
                <p>
                    <button className="lenke" onClick={onClose}>{getLedetekst('din-sykmelding.gjenapne.lightboks.lukk')}</button>
                </p>
            </div>
        </Lightbox>)
        : null;
};

EndreArbeidssituasjonLightbox.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    angreBekreftSykmelding: PropTypes.func,
    angreBekreftSykmeldingFeilet: PropTypes.bool,
    angrerBekreftSykmelding: PropTypes.bool,
    sykmelding: sykmeldingPt,
};

export default EndreArbeidssituasjonLightbox;
