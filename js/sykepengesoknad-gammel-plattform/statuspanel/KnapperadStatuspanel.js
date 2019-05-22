import Knapp from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../data/sykepengesoknader/sykepengesoknader_actions';
import ConnectedEttersending from '../ettersending/Ettersending';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';

const getSistSendtDato = (s) => {
    if (s.sendtTilNAVDato && s.sendtTilArbeidsgiverDato) {
        if (s.sendtTilNAVDato.getTime() > s.sendtTilArbeidsgiverDato.getTime()) {
            return s.sendtTilNAVDato;
        }
        return s.sendtTilArbeidsgiverDato;
    }
    if (s.sendtTilNAVDato) {
        return s.sendtTilNAVDato;
    }
    return s.sendtTilArbeidsgiverDato;
};

export const KnapperadComponent = (props) => {
    const { sykepengesoknad, startEndringForespurt, starterEndring, startEndringFeilet } = props;
    const frist = new Date();
    const ANTALL_MAANEDER_KORRIGERING_ER_MULIG = 3;
    frist.setMonth(frist.getMonth() - ANTALL_MAANEDER_KORRIGERING_ER_MULIG);
    const sendtDato = getSistSendtDato(sykepengesoknad);
    return (<div>
        <div className="verktoylinje">
            {
                sendtDato.getTime() >= frist.getTime() && <div className="verktoylinje__element">
                    <Knapp
                        type="standard"
                        mini
                        onClick={(e) => {
                            e.preventDefault();
                            startEndringForespurt(sykepengesoknad.id);
                        }}
                        spinner={starterEndring}
                        disabled={starterEndring}
                        className="js-endre">Endre søknad</Knapp>
                </div>
            }
            <ConnectedEttersending
                {...props}
                manglendeDato="sendtTilNAVDato"
                ledetekstKeySuffix="send-til-nav" />
            <ConnectedEttersending
                {...props}
                manglendeDato="sendtTilArbeidsgiverDato"
                ledetekstKeySuffix="send-til-arbeidsgiver" />
        </div>
        {startEndringFeilet ?
            <p className="skjemaelement__feilmelding">Beklager, det oppstod en feil. Prøv igjen litt senere</p> : null}
    </div>);
};

KnapperadComponent.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
    startEndringForespurt: PropTypes.func,
    startEndringFeilet: PropTypes.bool,
    starterEndring: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        starterEndring: state.sykepengesoknader.starterEndring,
        startEndringFeilet: state.sykepengesoknader.startEndringFeilet,
    };
};

const KnapperadStatuspanel = connect(mapStateToProps, {
    startEndringForespurt: actions.startEndringForespurt,
})(KnapperadComponent);

export default KnapperadStatuspanel;
