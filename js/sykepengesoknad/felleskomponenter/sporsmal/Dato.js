import React from 'react';
import PropTypes from 'prop-types';
import Datovelger from '../../../components/skjema/datovelger/Datovelger';
import Sporsmalstekst from './Sporsmalstekst';
import { formaterEnkeltverdi, genererParseForEnkeltverdi } from './fieldUtils';
import { getOnChangeForDato } from '../../utils/getOnChange';

const Dato = (props) => {
    const { sporsmalstekst, min, max, name } = props;
    const parse = genererParseForEnkeltverdi();
    const onChange = getOnChangeForDato(props);
    return (<div>
        <Sporsmalstekst tekst={sporsmalstekst} Tag="label" htmlFor={name} />
        <Datovelger
            oppdaterSporsmal={onChange}
            format={formaterEnkeltverdi}
            parse={parse}
            parseVerdi={parse}
            name={name}
            id={name}
            tidligsteFom={min}
            senesteTom={max} />
    </div>);
};

Dato.propTypes = {
    sporsmalstekst: PropTypes.string,
    min: PropTypes.instanceOf(Date),
    max: PropTypes.instanceOf(Date),
    name: PropTypes.string,
};

export default Dato;
