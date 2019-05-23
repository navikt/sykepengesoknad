import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import cn from 'classnames';
import { getLedetekst, getHtmlLedetekst, sykepengesoknadstatuser, sykmeldingstatuser } from '@navikt/digisyfo-npm';
import GenerellSoknadContainer from '../soknad/GenerellArbeidstakersoknadContainer';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';
import Feilmelding from '../../components/Feilmelding';

const { AVBRUTT, SLETTET_UTKAST } = sykepengesoknadstatuser;

const Avbruttkvittering = (props) => {
    const { tittel, brodtekst } = props;
    const ikon = 'avbryt-sykmelding.svg';

    return (<div className="panel blokk js-kvittering js-kvittering--standard">
        <div className="illustrertTittel">
            <img className="illustrertTittel__img illustrertTittel__img--mikro" src={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/${ikon}`} alt="" />
            <h2 className="illustrertTittel__tittel">
                {tittel}
            </h2>
        </div>
        <div className="redaksjonelt-innhold" dangerouslySetInnerHTML={brodtekst} />
    </div>);
};

Avbruttkvittering.propTypes = {
    tittel: PropTypes.string,
    brodtekst: PropTypes.shape({
        ___html: PropTypes.string,
    }),
};

export const Controller = (props) => {
    if (props.sykepengesoknad.status === AVBRUTT || props.sykepengesoknad.status === SLETTET_UTKAST) {
        return (<div>
            <Avbruttkvittering
                tittel={getLedetekst('sykepengesoknad.avbryt.kvittering.tittel')}
                brodtekst={getHtmlLedetekst('sykepengesoknad.avbryt.kvittering.tekst')} />
            <p className="ikke-print blokk navigasjonsstripe">
                <Link to={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader`} className="tilbakelenke">
                    {getLedetekst('sykepengesoknader.tilbake')}
                </Link>
            </p>
        </div>);
    }
    return <Feilmelding melding="Er du sikker på at du er på riktig side?" />;
};

Controller.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

const KvitteringContainer = ({ params }) => {
    return <GenerellSoknadContainer Component={Controller} params={params} />;
};

KvitteringContainer.propTypes = {
    params: PropTypes.shape({
        sykepengesoknadId: PropTypes.string,
    }),
};

export default KvitteringContainer;
