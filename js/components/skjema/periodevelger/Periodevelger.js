import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { harOverlappendePerioder } from '../../../utils/periodeUtils';
import Periodeliste from './Periodeliste';

export const PeriodevelgerContext = React.createContext();

const Periodevelger = ({ name, spoersmal, tidligsteFom, senesteTom, Overskrift = 'h3', initiellDato, onChange = null, onAddRemove }) => {
    return (<PeriodevelgerContext.Provider value={{
        namePrefix: name,
        name,
        tidligsteFom,
        senesteTom,
        initiellDato,
        onChange,
    }}>
        <FieldArray
            onAddRemove={onAddRemove}
            onChange={onChange}
            validate={(value) => {
                return harOverlappendePerioder(value)
                    ? 'Du kan ikke legge inn perioder som overlapper med hverandre'
                    : undefined;
            }}
            Overskrift={Overskrift}
            component={Periodeliste}
            name={name}
            namePrefix={name}
            spoersmal={spoersmal}
        />
    </PeriodevelgerContext.Provider>);
};

Periodevelger.propTypes = {
    name: PropTypes.string,
    spoersmal: PropTypes.string,
    tidligsteFom: PropTypes.instanceOf(Date),
    senesteTom: PropTypes.instanceOf(Date),
    initiellDato: PropTypes.instanceOf(Date),
    Overskrift: PropTypes.string,
    onChange: PropTypes.func,
    onAddRemove: PropTypes.func,
};

export default Periodevelger;
