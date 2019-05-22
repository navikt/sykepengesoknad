import React from 'react';
import { sporsmal as sporsmalPt } from '../../../propTypes/index';

const UkjentSporsmal = ({ sporsmal }) => {
    return (<div>
        <strong className="skjema__sporsmal">Ukjent svartype: <code>{sporsmal.svartype}</code></strong>
        <pre>
            {JSON.stringify(sporsmal, null, 2)}
        </pre>
    </div>);
};

UkjentSporsmal.propTypes = {
    sporsmal: sporsmalPt,
};

export default UkjentSporsmal;
