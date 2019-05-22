import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autofill, touch } from 'redux-form';
import landliste from './landliste';
import { formaterFlereVerdier, genererParseForFlereVerdier } from '../../../sykepengesoknad/felleskomponenter/sporsmal/fieldUtils';
import { fieldPropTypes } from '../../../propTypes';
import NavAutosuggest from '../tagvelger/NavAutosuggest';
import { finnForslag, forslagFinnesIForslagsliste, tilForslagsliste } from '../tagvelger/forslagUtils';
import { ValgteTags } from './ValgteTags';
import Feilomrade from '../Feilomrade';

export const genererHandleAddition = (meta, input, doAutofill, doTouch, forslagsliste = []) => {
    const prevVal = formaterFlereVerdier(input.value);
    const parse = genererParseForFlereVerdier();
    return (forslag) => {
        if (forslagFinnesIForslagsliste(forslagsliste, forslag)) {
            doTouch(meta.form, input.name);
            doAutofill(meta.form, input.name, parse([...prevVal, finnForslag(forslagsliste, forslag)]));
        }
    };
};

export const genererHandleDelete = (meta, input, doAutofill) => {
    return (index) => {
        const verdier = formaterFlereVerdier(input.value);
        const nyeVerdier = verdier.filter((value, valueIndex) => {
            return valueIndex !== index;
        });
        doAutofill(meta.form, input.name, genererParseForFlereVerdier()(nyeVerdier));
    };
};

const LandvelgerComponent = ({ input, meta, doAutofill, doTouch, sporsmalstekst }) => {
    const onAdd = genererHandleAddition(meta, input, doAutofill, doTouch, landliste);
    const handleDelete = genererHandleDelete(meta, input, doAutofill);
    const verdier = formaterFlereVerdier(input.value);

    return (<Feilomrade {...meta}>
        {sporsmalstekst}
        <NavAutosuggest
            meta={meta}
            onAdd={onAdd}
            id={input.name}
            name={input.name}
            forslagsliste={tilForslagsliste(landliste, verdier)}
        />
        <ValgteTags verdier={verdier} handleDelete={handleDelete} />
    </Feilomrade>);
};

LandvelgerComponent.propTypes = {
    input: fieldPropTypes.input,
    meta: fieldPropTypes.meta,
    doAutofill: PropTypes.func,
    doTouch: PropTypes.func,
    sporsmalstekst: PropTypes.node,
};

const Landvelger = connect(null, {
    doAutofill: autofill,
    doTouch: touch,
})(LandvelgerComponent);

export default Landvelger;
