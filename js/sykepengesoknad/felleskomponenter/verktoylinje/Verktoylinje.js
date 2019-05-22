import cn from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EndreSoknadContainer, { visEndringSelector } from '../endre-soknad/EndreSoknadContainer';
import ConnectedEttersending from '../ettersending/Ettersending';
import { soknadPt } from '../../prop-types/soknadProptype';
import { ARBEIDSTAKERE } from '../../enums/soknadtyper';
import { SENDT } from '../../enums/soknadstatuser';

const Verktoylinje = ({ feilmelding, vis, soknad }) => {
    const verktoylinjeClassName = cn('verktoylinje', {
        'blokk--mini': feilmelding,
    });
    return vis
        ? (<div>
            <div className={verktoylinjeClassName}>
                <EndreSoknadContainer soknad={soknad} />
                <ConnectedEttersending
                    manglendeDato="sendtTilNAVDato"
                    ledetekstKeySuffix="send-til-nav"
                    sykepengesoknad={soknad} />
                <ConnectedEttersending
                    manglendeDato="sendtTilArbeidsgiverDato"
                    ledetekstKeySuffix="send-til-arbeidsgiver"
                    sykepengesoknad={soknad} />
            </div>
            <div aria-live="polite">
                {
                    feilmelding &&
                    <p className="skjemaelement__feilmelding">{feilmelding}</p>
                }
            </div>
        </div>)
        : null;
};

Verktoylinje.propTypes = {
    feilmelding: PropTypes.string,
    vis: PropTypes.bool,
    soknad: soknadPt,
};

const visEttersending = (soknad) => {
    return soknad.soknadstype === ARBEIDSTAKERE
        && soknad.status === SENDT
        && !(soknad.sendtTilNAVDato && soknad.sendtTilArbeidsgiverDato);
};

const mapStateToProps = (state, ownProps) => {
    return {
        vis: visEndringSelector(state, ownProps.soknad) || visEttersending(ownProps.soknad),
        feilmelding: state.soknader.endringFeilet
            ? 'Beklager, søknaden kunne ikke endres'
            : null,
    };
};

const VerktoylinjeContainer = connect(mapStateToProps)(Verktoylinje);

export default VerktoylinjeContainer;
