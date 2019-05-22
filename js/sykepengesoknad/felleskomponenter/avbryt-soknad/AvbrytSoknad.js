import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getLedetekst, scrollTo } from '@navikt/digisyfo-npm';
import AvbrytSoknadUtvidet from './AvbrytSoknadUtvidet';
import { sykepengesoknad as sykepengesoknadPt, soknadPt } from '../../../propTypes/index';

class AvbrytSoknad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            erApen: false,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.erApen && this.state.erApen) {
            scrollTo(this.dialog);
        }
    }

    visAvbrytdialog() {
        this.setState({
            erApen: true,
        });
    }

    skjulAvbrytdialog() {
        this.setState({
            erApen: false,
        });
    }

    toggleAvbrytdialog() {
        this.setState({
            erApen: !this.state.erApen,
        });
    }

    render() {
        return (<div>
            <div className="avbrytDialog blokk--l">
                <p className="avbrytDialog__trigger">
                    <a
                        role="button"
                        href="#"
                        tabIndex="0"
                        aria-pressed={this.state.erApen}
                        ref={(c) => {
                            this.knapp = c;
                        }}
                        className="lenke"
                        onClick={(e) => {
                            e.preventDefault();
                            this.toggleAvbrytdialog();
                        }}>{getLedetekst('sykepengesoknad.avbryt.trigger')}</a>
                </p>
                <div
                    ref={(c) => {
                        this.dialog = c;
                    }}>
                    {
                        this.state.erApen && <AvbrytSoknadUtvidet
                            avbrytFeilet={this.props.avbrytFeilet}
                            avbryter={this.props.avbryter}
                            sender={this.props.sender}
                            avbrytHandler={() => {
                                this.skjulAvbrytdialog();
                                this.knapp.focus();
                            }}
                            bekreftHandler={() => {
                                this.props.avbrytSoknad(this.props.sykepengesoknad);
                            }} />
                    }
                </div>
            </div>
        </div>);
    }
}

AvbrytSoknad.propTypes = {
    avbrytFeilet: PropTypes.bool,
    avbryter: PropTypes.bool,
    sender: PropTypes.bool,
    avbrytSoknad: PropTypes.func,
    sykepengesoknad: PropTypes.oneOfType([soknadPt, sykepengesoknadPt]),
};

export default AvbrytSoknad;
