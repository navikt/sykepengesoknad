import React from 'react';
import PropTypes from 'prop-types';
import Periodevelger from '../../../components/skjema/periodevelger/Periodevelger';
import Sporsmalstekst from './Sporsmalstekst';
import { getOnChange, getOnChangeForPerioder } from '../../utils/getOnChange';

const Perioder = (props) => {
    const { min, max, name, sporsmalstekst, initiellDato } = props;
    return (
        <div>
            <Sporsmalstekst Tag="label" tekst={sporsmalstekst} htmlFor={name} />
            <Periodevelger
                onAddRemove={getOnChange(props)}
                onChange={getOnChangeForPerioder(props)}
                initiellDato={initiellDato}
                name={name}
                tidligsteFom={min}
                senesteTom={max} />
        </div>);
};

Perioder.propTypes = {
    min: PropTypes.instanceOf(Date),
    max: PropTypes.instanceOf(Date),
    initiellDato: PropTypes.instanceOf(Date),
    name: PropTypes.string,
    sporsmalstekst: PropTypes.string,
};

export default Perioder;
