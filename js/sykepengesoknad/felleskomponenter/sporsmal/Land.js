import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Sporsmalstekst from './Sporsmalstekst';
import Landvelger from '../../../components/skjema/landvelger/Landvelger';

const Land = ({ sporsmalstekst, name }) => {
    return (<Field
        sporsmalstekst={<Sporsmalstekst Tag="label" tekst={sporsmalstekst} htmlFor={name} />}
        component={Landvelger}
        name={name}
        id={name} />);
};

Land.propTypes = {
    sporsmalstekst: PropTypes.string,
    name: PropTypes.string,
};

export default Land;
