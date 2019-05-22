import React, { Component } from 'react';
import Alertstripe from 'nav-frontend-alertstriper';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { log } from '@navikt/digisyfo-npm';
import logger from '../../../logging';
import { soknadPt } from '../../prop-types/soknadProptype';
import { oppdaterSoknadFeiletOk } from '../../data/soknader/soknaderActions';

class Stripe extends Component {
    componentDidMount() {
        this.logg();
        this.startNedtelling();
    }

    componentWillUnmount() {
        window.clearTimeout(this.timeoutHandle);
    }

    logg() {
        const { soknad } = this.props;
        const message = `Oppdatering feilet for søknad av typen ${soknad.soknadstype} med ID: ${soknad.id}`;
        log(message);
        logger.info({
            message,
        });
    }

    startNedtelling() {
        this.timeoutHandle = window.setTimeout(() => {
            this.props.oppdaterSoknadFeiletOk();
        }, 4000);
    }

    render() {
        return (<Alertstripe type="advarsel" className="press">
            <p className="sist">Oi, der skjedde det en feil... Prøv igjen!</p>
        </Alertstripe>);
    }
}

Stripe.propTypes = {
    soknad: soknadPt,
    oppdaterSoknadFeiletOk: PropTypes.func,
};

const StripeSjekker = (props) => {
    const stripe = props.oppdaterFeilet ? <Stripe {...props} /> : null;
    return (<div aria-live="polite" role="alert">{stripe}</div>);
};

StripeSjekker.propTypes = {
    oppdaterFeilet: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        oppdaterFeilet: state.soknader.oppdaterFeilet,
    };
};

const OppdaterFeiletFeilstripe = connect(mapStateToProps, { oppdaterSoknadFeiletOk })(StripeSjekker);

export default OppdaterFeiletFeilstripe;
