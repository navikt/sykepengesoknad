import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLedetekst } from '@navikt/digisyfo-npm';
import { bindActionCreators } from 'redux';
import JaEllerNei from './JaEllerNei';
import { sporsmal as sporsmalPt, soknadPt } from '../../../propTypes/index';
import {
    CHECKBOX,
    CHECKBOX_GRUPPE,
    DATO,
    FRITEKST,
    JA_NEI,
    PERIODER,
    PROSENT,
    TIMER,
    IKKE_RELEVANT,
    CHECKBOX_PANEL,
    TALL,
    RADIO_GRUPPE, RADIO_GRUPPE_TIMER_PROSENT,
} from '../../enums/svartyper';
import Perioder from './Perioder';
import Checkbox from './Checkbox';
import Tall from './Tall';
import Dato from './Dato';
import CheckboxGruppe from './CheckboxGruppe';
import Tekstinput from './Tekstinput';
import IkkeRelevant from './IkkeRelevant';
import Checkboxpanel from './Checkboxpanel';
import { lagreSoknad, soknadEndret } from '../../data/soknader/soknaderActions';
import UkjentSporsmal from './UkjentSporsmal';
import Undersporsmalsliste from './Undersporsmalsliste';
import RadioGruppe from './RadioGruppe';
import { LAND } from '../../enums/tagtyper';
import Land from './Land';

export const SporsmalComponent = ({ sporsmal, name, hovedsporsmal, ekstraProps, actions, soknad }) => {
    const undersporsmalsliste = <Undersporsmalsliste undersporsmal={sporsmal.undersporsmal} soknad={soknad} />;

    switch (sporsmal.svartype) {
        case DATO: {
            return (<Dato {...sporsmal} name={name} soknad={soknad} actions={actions}>
                { undersporsmalsliste }
            </Dato>);
        }
        case TIMER: {
            return (<Tall {...sporsmal} name={name} label={getLedetekst('soknad.timer-totalt')} soknad={soknad}>
                { undersporsmalsliste }
            </Tall>);
        }
        case PROSENT: {
            return (<Tall {...sporsmal} name={name} label={getLedetekst('soknad.prosent')} soknad={soknad} kunHeltall>
                { undersporsmalsliste }
            </Tall>);
        }
        case TALL: {
            return (<Tall {...sporsmal} name={name} label={sporsmal.undertekst} soknad={soknad}>
                { undersporsmalsliste }
            </Tall>);
        }
        case CHECKBOX: {
            return (<Checkbox {...sporsmal} name={name} soknad={soknad} actions={actions}>
                { undersporsmalsliste }
            </Checkbox>);
        }
        case PERIODER: {
            return (<Perioder {...sporsmal} {...ekstraProps} name={name} soknad={soknad} actions={actions}>
                { undersporsmalsliste }
            </Perioder>);
        }
        case JA_NEI: {
            return (<JaEllerNei
                {...sporsmal}
                name={name}
                hovedsporsmal={hovedsporsmal}
                soknad={soknad}
                actions={actions}>
                { undersporsmalsliste }
            </JaEllerNei>);
        }
        case CHECKBOX_GRUPPE: {
            return (<CheckboxGruppe {...sporsmal} name={name} soknad={soknad} actions={actions}>
                { undersporsmalsliste }
            </CheckboxGruppe>);
        }
        case FRITEKST: {
            return (<Tekstinput {...sporsmal} name={name} soknad={soknad}>
                { undersporsmalsliste }
            </Tekstinput>);
        }
        case IKKE_RELEVANT: {
            return (<IkkeRelevant {...sporsmal} name={name} soknad={soknad}>
                { undersporsmalsliste }
            </IkkeRelevant>);
        }
        case CHECKBOX_PANEL: {
            return (<Checkboxpanel {...sporsmal} name={name} soknad={soknad}>
                { undersporsmalsliste }
            </Checkboxpanel>);
        }
        case RADIO_GRUPPE:
        case RADIO_GRUPPE_TIMER_PROSENT: {
            return (<RadioGruppe
                {...sporsmal}
                name={name}
                soknad={soknad} />);
        }
        case LAND: {
            return (<Land {...sporsmal} name={name} soknad={soknad} />);
        }
        default: {
            return <UkjentSporsmal sporsmal={sporsmal} />;
        }
    }
};

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            soknadEndret,
            lagreSoknad,
        }, dispatch),
    };
}

SporsmalComponent.propTypes = {
    sporsmal: sporsmalPt,
    name: PropTypes.string,
    hovedsporsmal: PropTypes.bool,
    ekstraProps: PropTypes.shape(),
    actions: PropTypes.shape(),
    soknad: soknadPt.isRequired,
};

export default connect(null, mapDispatchToProps)(SporsmalComponent);
