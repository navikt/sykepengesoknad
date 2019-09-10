import { connect } from 'react-redux';
import { soknadPt as sykepengesoknadPt } from '../../../propTypes/index';
import { RelaterteSoknader } from './RelaterteSoknader';
import { selectSoknaderData } from '../../data/soknader/soknaderSelectors';

export const mapStateToProps = (state, ownProps) => {
    const relaterteSoknader = [];
    const sykepengesoknadId = ownProps.soknad.id;
    const sykepengesoknader = selectSoknaderData(state);

    let sykepengesoknad = sykepengesoknader.filter((s) => {
        return s.id === sykepengesoknadId;
    })[0];

    sykepengesoknader.forEach(() => {
        sykepengesoknader.forEach((s) => {
            if (sykepengesoknad.korrigerer === s.id) {
                relaterteSoknader.push(s);
                sykepengesoknad = s;
            }
        });
    });

    return {
        relaterteSoknader: relaterteSoknader.reverse(),
    };
};

const RelaterteSoknaderContainer = connect(mapStateToProps)(RelaterteSoknader);

RelaterteSoknaderContainer.propTypes = {
    soknad: sykepengesoknadPt,
};

export default RelaterteSoknaderContainer;
