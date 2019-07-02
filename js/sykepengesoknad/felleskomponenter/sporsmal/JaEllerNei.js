/* eslint arrow-body-style: ["error", "as-needed"] */
import React from 'react';
import { getLedetekst, Bjorn } from '@navikt/digisyfo-npm';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Radioknapper from '../../../components/skjema/Radioknapper';
import SporsmalMedTillegg from '../../../components/skjema/SporsmalMedTillegg';
import { childEllerChildren, fieldPropTypes, soknadPt, sporsmal as sporsmalPt } from '../../../propTypes/index';
import { formaterEnkeltverdi, genererParseForEnkeltverdi } from './fieldUtils';
import { JA, NEI } from '../../enums/svarEnums';
import SporsmalBjornKondisjonell from './SporsmalBjornKondisjonell';
import SporsmalBjorn from './SporsmalBjorn';
import { getOnChange } from '../../utils/getOnChange';
import SporsmalHjelpetekst from './SporsmalHjelpetekst';
import JaEllerNeiPresisering from './JaEllerNeiPresisering';
import JaEllerNeiRadiopanelgruppe from './JaEllerNeiRadiopanelgruppe';
import { TIDLIGERE_SOKNAD } from '../../enums/avgittavEnums';

export const jaEllerNeiAlternativer = [JA, NEI];

export const JaEllerNeiRadioknapper = props => (
    <Radioknapper {...props} name={props.input.name} spoersmal={props.sporsmalstekst}>
        {jaEllerNeiAlternativer
            .map((alternativ, index) => (
                <i value={alternativ}
                    label={getLedetekst(`soknad.${alternativ.toLowerCase()}`)}
                    key={index}>
                    <JaEllerNeiPresisering tag={props.tag} value={props.input.value} soknad={props.soknad} />
                </i>
            ))
        }
    </Radioknapper>
);

JaEllerNeiRadioknapper.propTypes = {
    input: fieldPropTypes.input,
    intro: PropTypes.string,
    sporsmalstekst: PropTypes.string,
    tag: PropTypes.string,
    soknad: soknadPt,
};

const visAvgittAvBjorn = (props) => {
    const underspprsmal = props.undersporsmal.find(usporsmal => usporsmal.tag === 'EGENMELDINGER_NAR');
    if (underspprsmal) {
        return underspprsmal.svar.some(svaret => svaret.avgittAv === TIDLIGERE_SOKNAD);
    }
    return false;
};

export const RendreJaEllerNei = (props) => {
    const classNames = props.hovedsporsmal ? 'hovedsporsmal' : null;
    const classNamesTilleggssporsmal = props.hovedsporsmal ? 'hovedsporsmal__tilleggssporsmal' : null;
    const hjelpetekst = <SporsmalHjelpetekst tag={props.tag} />;

    const Sporsmal = props.hovedsporsmal
        ? (<JaEllerNeiRadiopanelgruppe {...props} hjelpetekst={hjelpetekst} />)
        : (<JaEllerNeiRadioknapper {...props} hjelpetekst={hjelpetekst} />);

    return props.undersporsmal.length === 0
        ? <div className={classNames}>{Sporsmal}</div>
        : <React.Fragment>
            <SporsmalMedTillegg
                {...props}
                Sporsmal={Sporsmal}
                className={classNames}
                visTillegg={_props => _props.input.value === _props.kriterieForVisningAvUndersporsmal}
            >
                {
                    visAvgittAvBjorn(props)
                        ? <Bjorn className="press" nokkel="sykepengesoknad.egenmeldingsdager.preutfylt-melding" />
                        : null
                }
                <div className={classNamesTilleggssporsmal}>{props.children}</div>
                <SporsmalBjorn tag={props.tag} soknad={props.soknad} className="press" />
            </SporsmalMedTillegg>
        </React.Fragment>;
};

RendreJaEllerNei.propTypes = {
    children: childEllerChildren,
    undersporsmal: PropTypes.arrayOf(sporsmalPt),
    hovedsporsmal: PropTypes.bool,
    tag: PropTypes.string,
    soknad: soknadPt,
};

const JaEllerNei = props => ([
    <Field
        onChange={getOnChange(props)}
        key={`${props.tag}-field`}
        format={formaterEnkeltverdi}
        parse={genererParseForEnkeltverdi()}
        component={RendreJaEllerNei}
        {...props}
    />,
    <SporsmalBjornKondisjonell
        soknad={props.soknad}
        key={`${props.tag}-sporsmalbjorn`}
        tag={props.tag}
    />,
]);

JaEllerNei.propTypes = {
    tag: PropTypes.string,
    soknad: soknadPt.isRequired,
};

export default JaEllerNei;
