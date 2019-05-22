import React from 'react';
import { getLedetekst, getHtmlLedetekst } from '@navikt/digisyfo-npm';
import IllustrertInnhold from '../../components/IllustrertInnhold';

const ForsteSoknadIntro = () => {
    return (<div className="blokk">
        <div className="blokk--s">
            <IllustrertInnhold
                ikon={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/foerste-soknad.svg`}
                ikonAlt="Din første digitale søknad om sykepenger"
                liten>
                <h2 className="panel__tittel sist">{getLedetekst('sykepengesoknad.foerste-soknad.tittel')}</h2>
            </IllustrertInnhold>
        </div>
        <div
            className="redaksjonelt-innhold"
            dangerouslySetInnerHTML={getHtmlLedetekst('sykepengesoknad.foerste-soknad.mer_v2')} />
    </div>);
};

export default ForsteSoknadIntro;
