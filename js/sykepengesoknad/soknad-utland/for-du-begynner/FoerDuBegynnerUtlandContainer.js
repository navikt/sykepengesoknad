import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLedetekst } from '@navikt/digisyfo-npm';
import SideStrippet from '../../../sider/SideStrippet';
import { FoerDuBegynnerUtland } from './FoerDuBegynnerUtland';
import AppSpinner from '../../../components/AppSpinner';
import Feilmelding from '../../../components/Feilmelding';
import { opprettSoknadUtland } from '../../data/soknader/soknaderActions';

export const Container = ({ henter, hentingFeilet, opprettSoknad, opprettFeilet, oppretterSoknad }) => {
    return (<SideStrippet tittel={getLedetekst('sykepengesoknad-utland.sidetittel')} laster={henter}>
        {(() => {
            if (henter) {
                return <AppSpinner />;
            }
            if (hentingFeilet) {
                return <Feilmelding />;
            }
            return (<FoerDuBegynnerUtland
                opprettSoknad={opprettSoknad}
                opprettFeilet={opprettFeilet}
                oppretterSoknad={oppretterSoknad}
            />);
        })()}
    </SideStrippet>);
};

Container.propTypes = {
    hentingFeilet: PropTypes.bool,
    henter: PropTypes.bool,
    opprettFeilet: PropTypes.bool,
    oppretterSoknad: PropTypes.bool,
    opprettSoknad: PropTypes.func,
};

export function mapStateToProps(state) {
    return {
        henter: state.ledetekster.henter,
        hentingFeilet: state.ledetekster.hentingFeilet,
        opprettFeilet: state.soknader.opprettFeilet,
        oppretterSoknad: state.soknader.oppretterSoknad,
    };
}


export default connect(mapStateToProps, { opprettSoknad: opprettSoknadUtland })(Container);
