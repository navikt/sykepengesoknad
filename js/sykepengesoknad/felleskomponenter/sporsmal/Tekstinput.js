import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Sporsmalstekst from './Sporsmalstekst';
import { formaterEnkeltverdi, genererParseForEnkeltverdi } from './fieldUtils';
import Tekstfelt from '../../../components/skjema/Tekstfelt';

const Tekstinput = ({ sporsmalstekst, name, max }) => {
    const parse = genererParseForEnkeltverdi();
    return (<div>
        <Sporsmalstekst Tag="label" tekst={sporsmalstekst} htmlFor={name} />
        <Field
            component={Tekstfelt}
            name={name}
            id={name}
            parse={(verdi) => {
                return max
                    ? parse(verdi.substr(0, max))
                    : parse(verdi);
            }}
            format={formaterEnkeltverdi}
            className="input--s" />
    </div>);
};

Tekstinput.propTypes = {
    sporsmalstekst: PropTypes.string,
    name: PropTypes.string,
    max: PropTypes.string,
};

export default Tekstinput;
