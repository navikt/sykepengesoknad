import React from 'react';
import { getHtmlLedetekst } from '@navikt/digisyfo-npm';
import IllustrertInnhold from '../../components/IllustrertInnhold';

const SoknadIntro = () => {
    return (
        <div className="blokk">
            <IllustrertInnhold
                ikon={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/foerste-soknad.svg`}
                ikonAlt="Din første digitale søknad om sykepenger"
                liten>
                <div
                    className="redaksjonelt-innhold"
                    dangerouslySetInnerHTML={getHtmlLedetekst('sykepengesoknad.soknad-intro.personvern')} />
            </IllustrertInnhold>
        </div>);
};

export default SoknadIntro;
