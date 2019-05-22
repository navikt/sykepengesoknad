import React, { Component } from 'react';
import { getLedetekst } from '@navikt/digisyfo-npm';

export default class Lenke extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ikon: 'utbetalinger.svg',
        };
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    onMouseEnter() {
        this.setState({
            ikon: 'utbetalinger--hover.svg',
        });
    }

    onMouseLeave() {
        this.setState({
            ikon: 'utbetalinger.svg',
        });
    }

    render() {
        const URL = 'https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Utbetalinger/Utbetalinger/Utbetalingsdatoer%2C+feriepenger+og+skattetrekk?kap=499628';

        return (<a
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            href={URL}
            target="_blank"
            className="inngangspanel inngangspanel--ekstern blokk--l">
            <span className="inngangspanel__ikon">
                <img alt="" className="js-ikon" src={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/${this.state.ikon}`} />
            </span>
            <div className="inngangspanel__innhold">
                <h2 className="inngangspanel__tittel">{getLedetekst('soknader.sykepenger.tittel')}</h2>
            </div>
        </a>);
    }
}
