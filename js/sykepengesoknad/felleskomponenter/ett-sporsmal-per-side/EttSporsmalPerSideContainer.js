import React from 'react';
import soknadSetup from '../../utils/soknadSetup';
import Soknadstatussjekker from '../Soknadstatussjekker';
import EttSporsmalPerSide from './EttSporsmalPerSide';
import { validerDenneSiden, validerForegaendeSider } from './validerEttSporsmalPerSide';

const EttSporsmalPerSideContainer = (props) => {
    return (<Soknadstatussjekker
        {...props}
        Component={EttSporsmalPerSide}
        valider={validerForegaendeSider} />);
};

export default soknadSetup(validerDenneSiden, EttSporsmalPerSideContainer, true);
