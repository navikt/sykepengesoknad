import { connect } from 'react-redux';
import RelaterteSoknader from './RelaterteSoknader';
import { selectSykepengesoknaderData } from '../data/sykepengesoknader/sykepengesoknaderSelectors';

export const mapStateToProps = (state, ownProps) => {
    const relaterteSoknader = [];
    const sykepengesoknadId = ownProps.sykepengesoknadId;
    const sykepengesoknader = selectSykepengesoknaderData(state);
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

export default RelaterteSoknaderContainer;
