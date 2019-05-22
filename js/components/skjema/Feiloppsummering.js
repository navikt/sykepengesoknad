import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scrollTo, erSynligIViewport } from '@navikt/digisyfo-npm';
import { Vis } from '../../utils';

const FeillisteMelding = ({ feltnavn, feilmelding }) => {
    return (<li className="feiloppsummering__feil">
        <a href={`#${feltnavn}`}>{feilmelding}</a>
    </li>);
};

FeillisteMelding.propTypes = {
    feltnavn: PropTypes.string,
    feilmelding: PropTypes.string,
};

const getFeilmeldinger = (props) => {
    return props.feilmeldinger || [];
};

class Feiloppsummering extends Component {
    componentDidUpdate(prevProps) {
        const { settFokus, skjemaErGyldig, skjemanavn } = this.props;
        if (settFokus && this.oppsummering) {
            if (!erSynligIViewport(this.oppsummering)) {
                scrollTo(this.oppsummering, 300);
                setTimeout(() => {
                    this.fokuserOppsummering();
                }, 300);
            } else {
                this.fokuserOppsummering();
            }
        }
        if (getFeilmeldinger(this.props).length === 0 && getFeilmeldinger(prevProps).length > 0) {
            skjemaErGyldig(skjemanavn);
        }
    }

    fokuserOppsummering() {
        const { sendSkjemaFeiletHandtert, skjemanavn } = this.props;
        this.oppsummering.focus();
        sendSkjemaFeiletHandtert(skjemanavn);
    }

    render() {
        const feilmeldinger = getFeilmeldinger(this.props);
        return (<div aria-live="polite" role="alert">
            <Vis
                hvis={feilmeldinger.length > 0 && this.props.visFeilliste}
                render={() => {
                    return (<div
                        className="feiloppsummering blokk"
                        ref={(c) => {
                            this.oppsummering = c;
                        }}
                        tabIndex="-1">
                        <h3 className="feiloppsummering__tittel">Det er {feilmeldinger.length} feil i skjemaet</h3>
                        <ul className="feiloppsummering__liste">
                            {
                                feilmeldinger.map((feilmld, index) => {
                                    return <FeillisteMelding key={index} {...feilmld} />;
                                })
                            }
                        </ul>
                    </div>);
                }} />
        </div>);
    }
}

Feiloppsummering.propTypes = {
    settFokus: PropTypes.bool,
    sendSkjemaFeiletHandtert: PropTypes.func.isRequired,
    skjemaErGyldig: PropTypes.func.isRequired,
    skjemanavn: PropTypes.string.isRequired,
    visFeilliste: PropTypes.bool,
    feilmeldinger: PropTypes.arrayOf(PropTypes.shape({
        feltnavn: PropTypes.string,
        feilmelding: PropTypes.string,
    })),
};

export default Feiloppsummering;
