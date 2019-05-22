import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scrollTo, erSynligIViewport } from '@navikt/digisyfo-npm';
import { Vis } from '../../utils';

class SporsmalMedTillegg extends Component {
    constructor(props) {
        super(props);
        const erApen = this.getErApen(props);
        this.state = {
            erApen,
            containerClassName: '',
            hindreToggle: false,
            hoyde: !erApen ? '0' : 'auto',
            visInnhold: erApen,
            opacity: erApen ? '1' : '0',
        };
    }

    componentDidUpdate(prevProps) {
        const varApen = this.getErApen(prevProps);
        const erApen = this.getErApen(this.props);
        if (erApen !== varApen) {
            if (erApen) {
                this.apne();
            } else {
                this.lukk();
            }
        }
    }

    onHoydeTransitionEnd() {
        if (!this.state.harAnimasjon) {
            return;
        }
        this.setState({
            containerClassName: this.state.containerClassName.replace(' animerer', ''),
        });
        if (this.state.erApen) {
            this.setState({
                hindreToggle: false,
                harAnimasjon: false,
            });
            this.setAutoHoyde();
            this.fadeIn();
            setTimeout(() => {
                this.scrollToHovedsporsmal();
            }, 300);
            return;
        }
        this.setState({
            hindreToggle: false,
            visInnhold: false,
            harAnimasjon: false,
            opacity: '0',
        });
        this.scrollToHovedsporsmal();
    }

    getContainerClass() {
        return `tilleggssporsmal__innholdContainer${this.state.containerClassName}`;
    }

    getErApen(props) {
        return this.props.visTillegg(props);
    }

    setAutoHoyde() {
        /* Fjerner animasjonsklassen slik at Safari ikke
        tegner komponenten på nytt når høyde settes til 'auto': */
        this.setState({
            gammelHoyde: this.state.hoyde,
            containerClassName: '',
        });
        // Setter høyde til auto:
        setTimeout(() => {
            this.setState({
                hoyde: 'auto',
                containerClassName: '',
            });
        }, 0);
    }

    scrollToHovedsporsmal() {
        if (!erSynligIViewport(this.hovedsporsmal)) {
            scrollTo(this.hovedsporsmal, 600);
        }
    }

    fadeUt() {
        this.setState({
            opacity: '0',
        });
    }

    fadeIn() {
        this.setState({
            opacity: '1',
        });
    }

    apne() {
        this.setState({
            hoyde: '0',
            hindreToggle: true,
            containerClassName: ' tilleggssporsmal__innholdContainer--medAnimasjon',
            visInnhold: true,
            harAnimasjon: true,
        });
        const that = this;
        setTimeout(() => {
            const hoyde = that.tilleggsinnhold ? that.tilleggsinnhold.offsetHeight : 'auto';
            that.setState({
                erApen: true,
                hoyde,
                containerClassName: `${this.state.containerClassName} animerer`,
            });
        }, 0);
    }

    lukk() {
        const hoyde = this.tilleggsinnhold && this.tilleggsinnhold.offsetHeight ? this.tilleggsinnhold.offsetHeight : this.state.gammelHoyde;
        this.setState({
            hoyde,
            hindreToggle: true,
            opacity: '0',
        });
        setTimeout(() => {
            this.setState({
                harAnimasjon: true,
                containerClassName: ' tilleggssporsmal__innholdContainer--medAnimasjon animerer',
                hoyde: '0',
                erApen: false,
            });
        }, 0);
    }

    render() {
        const { children, Sporsmal, className, informasjon } = this.props;
        return (<div className={className}>
            <div ref={(c) => {
                this.hovedsporsmal = c;
            }}>
                {Sporsmal}
            </div>
            <div
                ref={(c) => {
                    this.container = c;
                }}
                style={{ height: this.state.hoyde }}
                className={this.getContainerClass()}
                onTransitionEnd={() => {
                    this.onHoydeTransitionEnd();
                }}>
                <Vis
                    hvis={this.state.visInnhold}
                    render={() => {
                        return (<div
                            className="js-tillegg"
                            ref={(c) => {
                                this.tilleggsinnhold = c;
                            }}>
                            <div className="tilleggsinnhold__innhold" style={{ opacity: this.state.opacity }}>
                                {children}
                            </div>
                        </div>);
                    }} />
            </div>
            {informasjon}
        </div>);
    }
}

SporsmalMedTillegg.propTypes = {
    children: PropTypes.node,
    Sporsmal: PropTypes.element,
    visTillegg: PropTypes.func,
    className: PropTypes.string,
    informasjon: PropTypes.element,
};

export default SporsmalMedTillegg;
