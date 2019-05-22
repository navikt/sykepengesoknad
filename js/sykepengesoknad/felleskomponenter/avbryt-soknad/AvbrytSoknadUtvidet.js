import React from 'react';
import PropTypes from 'prop-types';
import { getLedetekst, getHtmlLedetekst } from '@navikt/digisyfo-npm';
import Feilstripe from '../../../components/Feilstripe';

const AvbrytSoknadUtvidet = ({ avbryter, avbrytFeilet, avbrytHandler, bekreftHandler, sender }) => {
    return (<div className="avbrytDialog__dialog">
        <div className="pekeboble">
            <p className="blokk--s" dangerouslySetInnerHTML={getHtmlLedetekst('sykepengesoknad.avbryt.sporsmal')} />
            <Feilstripe vis={avbrytFeilet} className="blokk" />
            <div className="blokk--xs">
                <button
                    disabled={avbryter || sender}
                    className="js-bekreft knapp knapp--fare"
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        bekreftHandler();
                    }}>{getLedetekst('sykepengesoknad.avbryt.ja')}
                    { avbryter && <span className="knapp__spinner" /> }
                </button>
            </div>
            <p className="sist">
                <button
                    className="lenke js-avbryt"
                    onClick={(e) => {
                        e.preventDefault();
                        avbrytHandler();
                    }}>{getLedetekst('sykepengesoknad.avbryt.angre')}
                </button>
            </p>
        </div>
    </div>);
};

AvbrytSoknadUtvidet.propTypes = {
    avbryter: PropTypes.bool,
    avbrytHandler: PropTypes.func,
    bekreftHandler: PropTypes.func,
    avbrytFeilet: PropTypes.bool,
    sender: PropTypes.bool,
};

export default AvbrytSoknadUtvidet;
