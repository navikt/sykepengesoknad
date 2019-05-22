import React from 'react';
import { getLedetekst, getHtmlLedetekst } from '@navikt/digisyfo-npm';
import { Link } from 'react-router';
import Sidetopp from '../../../components/Sidetopp';
import { IllustrertInnholdGronnHake } from '../../../components/IllustrertInnhold';

const Kvittering = () => {
    return (<div>
        <Sidetopp tittel={getLedetekst('sykepengesoknad-selvstendig.kvittering.sendt.tittel')} />
        <div className="panel">
            <IllustrertInnholdGronnHake>
                <h2 className="panel__tittel">
                    {getLedetekst('sykepengesoknad-selvstendig.kvittering.sendt.undertittel')}
                </h2>
                <div
                    className="redaksjonelt-innhold"
                    dangerouslySetInnerHTML={getHtmlLedetekst('sykepengesoknad-selvstendig.kvittering.sendt.informasjon')} />
            </IllustrertInnholdGronnHake>
        </div>
        <p className="ikke-print blokk navigasjonsstripe">
            <Link to={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader`} className="tilbakelenke">
                {getLedetekst('sykepengesoknad.navigasjon.gaa-til')}
            </Link>
        </p>
    </div>);
};

export default Kvittering;

