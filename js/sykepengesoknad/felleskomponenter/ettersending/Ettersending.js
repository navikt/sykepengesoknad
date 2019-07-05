/* eslint arrow-body-style: ["error", "as-needed"] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getLedetekst, scrollTo } from '@navikt/digisyfo-npm';
import Knapp from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import Lightbox from '../../../components/Lightbox';
import { soknadPt } from '../../../propTypes/index';
import { EttersendDialogConnected } from './EttersendingDialog';
import { ettersendSoknadTilNavNullstill } from '../../data/ettersending/ettersendingNav';
import { ettersendSoknadTilArbeidsgiverNullstill } from '../../data/ettersending/ettersendingArbeidsgiver';
import { ARBEIDSTAKERE } from '../../enums/soknadtyper';
import logger from '../../../logging';

const sendtTilNAVDato = 'sendtTilNAVDato';
const sendtTilArbeidsgiverDato = 'sendtTilArbeidsgiverDato';
const ledetekstKeySuffixPt = PropTypes.oneOf(['send-til-nav', 'send-til-arbeidsgiver']);
const manglendeDatoPt = PropTypes.oneOf([sendtTilNAVDato, sendtTilArbeidsgiverDato]);

export const EttersendKvittering = ({ onClose, ledetekstKeySuffix }) => (<div>
    <p className="hode hode--suksess">{getLedetekst(`sykepengesoknad.ettersending.kvittering.${ledetekstKeySuffix}`)}</p>
    <div className="knapperad">
        <Knapp
            className="js-lukk"
            onClick={(e) => {
                e.preventDefault();
                onClose();
            }}>Lukk</Knapp>
    </div>
</div>);

EttersendKvittering.propTypes = {
    onClose: PropTypes.func,
    ledetekstKeySuffix: ledetekstKeySuffixPt,
};

export const EttersendLightbox = (props) => {
    const { visKvittering, ledetekstKeySuffix, manglendeDato, doEttersendSoknadTilNavNullstill, doEttersendSoknadTilArbeidsgiverNullstill } = props;
    const onClose = () => {
        if (visKvittering) {
            props.scrollTilTopp();
        }
        doEttersendSoknadTilNavNullstill();
        doEttersendSoknadTilArbeidsgiverNullstill();
        props.onClose();
    };
    return (<Lightbox onClose={onClose} bredde="m">
        {!visKvittering &&
        <EttersendDialogConnected
            sykepengesoknad={props.sykepengesoknad}
            onClose={onClose}
            ledetekstKeySuffix={ledetekstKeySuffix}
            manglendeDato={manglendeDato}
        />}
        {visKvittering && <EttersendKvittering {...props} onClose={onClose} ledetekstKeySuffix={ledetekstKeySuffix} />}
    </Lightbox>);
};

EttersendLightbox.propTypes = {
    scrollTilTopp: PropTypes.func,
    onClose: PropTypes.func,
    visKvittering: PropTypes.bool,
    sykepengesoknad: soknadPt,
    ledetekstKeySuffix: PropTypes.string,
    manglendeDato: PropTypes.string,
    doEttersendSoknadTilNavNullstill: PropTypes.func,
    doEttersendSoknadTilArbeidsgiverNullstill: PropTypes.func,
};

const actionCreators = {
    doEttersendSoknadTilNavNullstill: ettersendSoknadTilNavNullstill,
    doEttersendSoknadTilArbeidsgiverNullstill: ettersendSoknadTilArbeidsgiverNullstill,
};

const EttersendLightboxConnected = connect(null, actionCreators)(EttersendLightbox);

export class Ettersending extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visLightbox: false,
            visKvittering: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        const forrigeSoknad = this.props.sykepengesoknad;
        const { sykepengesoknad, manglendeDato } = nextProps;
        try {
            if (forrigeSoknad[manglendeDato].getTime() !== sykepengesoknad[manglendeDato].getTime()) {
                this.setState({
                    visKvittering: true,
                });
            }
        } catch (e) {
            return false;
        }
        return true;
    }

    scrollTilTopp() {
        scrollTo(this.sendtSoknad, 300);
    }

    render() {
        const { sykepengesoknad, manglendeDato, ledetekstKeySuffix } = this.props;
        logger.info(`EttersendingV2-1 - sykepengesoknad.id: ${sykepengesoknad.id} - manglendeDato: ${manglendeDato}
        - sendtTilNAVDato: ${sykepengesoknad.sendtTilNAVDato !== null} 
        - sendtTilArbeidsgiverDato: ${sykepengesoknad.sendtTilArbeidsgiverDato !== null}`);

        if (sykepengesoknad.soknadstype !== ARBEIDSTAKERE
            || (sykepengesoknad[manglendeDato] && !this.state.visKvittering)) {
            logger.info(`EttersendingV2-2 - sykepengesoknad.id: ${sykepengesoknad.id} - manglendeDato: ${manglendeDato}
        - sendtTilNAVDato: ${sykepengesoknad.sendtTilNAVDato !== null} - visKvittering: ${this.state.visKvittering}
        - sendtTilArbeidsgiverDato: ${sykepengesoknad.sendtTilArbeidsgiverDato !== null}`);
            return null;
        }
        return (
            <div className="verktoylinje__element">
                {
                    !sykepengesoknad[manglendeDato] &&
                    <React.Fragment>
                        <Knapp
                            type="standard"
                            mini
                            onClick={(e) => {
                                e.preventDefault();
                                this.setState({
                                    visLightbox: true,
                                });
                            }}
                            className="js-trigger">
                            {getLedetekst(`sykepengesoknad.ettersending.knapp.${ledetekstKeySuffix}`)}
                        </Knapp>
                        {
                            logger.info(`EttersendingV2-3 - sykepengesoknad.id: ${sykepengesoknad.id} - manglendeDato: ${manglendeDato}
        - sendtTilNAVDato: ${sykepengesoknad.sendtTilNAVDato !== null} - visKvittering: ${this.state.visKvittering}
        - sendtTilArbeidsgiverDato: ${sykepengesoknad.sendtTilArbeidsgiverDato !== null}`)
                        }
                    </React.Fragment>
                }
                {
                    this.state.visLightbox &&
                    <EttersendLightboxConnected
                        sykepengesoknad={sykepengesoknad}
                        ledetekstKeySuffix={ledetekstKeySuffix}
                        manglendeDato={manglendeDato}
                        scrollTilTopp={this.scrollTilTopp}
                        visKvittering={this.state.visKvittering}
                        onClose={() => {
                            if (this.triggEttersending) {
                                this.triggEttersending.focus();
                            }
                            this.setState({
                                visLightbox: false,
                                visKvittering: false,
                            });
                        }}
                    />
                }
            </div>
        );
    }
}

Ettersending.propTypes = {
    manglendeDato: manglendeDatoPt,
    ledetekstKeySuffix: ledetekstKeySuffixPt,
    sykepengesoknad: soknadPt,
};

const ConnectedEttersending = connect()(Ettersending);

export default ConnectedEttersending;
