import React from 'react';
import { getLedetekst } from '@navikt/digisyfo-npm';
import PropTypes from 'prop-types';
import IllustrertInnhold from '../IllustrertInnhold';
import { soknadPt, sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';
import { NY } from '../../sykepengesoknad/enums/soknadstatuser';

const TidligSoknad = ({ soknad }) => {
    const now = new Date();
    return soknad.status === NY && soknad.tom > now ? (<div className="panel panel--komprimert blokk">
        <IllustrertInnhold ikon={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/snomannen.svg`} ikonAlt="Tidlig søknad">
            <p className="sykepenger__tidligSoknad">{getLedetekst('sykepengesoknad.tidlig-soknad')}</p>
        </IllustrertInnhold>
    </div>) : null;
};

TidligSoknad.propTypes = {
    soknad: PropTypes.oneOfType([sykepengesoknadPt, soknadPt]).isRequired,
};

export default TidligSoknad;
