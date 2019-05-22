import { connect } from 'react-redux';
import GjenapneSoknad from '../../../components/soknad-felles/GjenapneSoknad';
import { soknadKanGjenapnes } from '../../../sykepengesoknad-gammel-plattform/soknad/soknad-avbrutt/GjenapneSoknadContainer';
import { gjenapneSoknad } from '../../data/soknader/soknaderActions';

const mapStateToProps = (state, ownProps) => {
    return {
        gjenapner: state.soknader.gjenapner,
        gjenapneFeilet: state.soknader.gjenapneFeilet,
        vis: soknadKanGjenapnes(ownProps.sykepengesoknad.opprettetDato),
    };
};

export default connect(mapStateToProps, { gjenapneSoknad })(GjenapneSoknad);
