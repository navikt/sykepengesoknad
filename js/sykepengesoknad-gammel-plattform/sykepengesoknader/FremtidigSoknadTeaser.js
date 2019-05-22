import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { getLedetekst, tilLesbarDatoMedArstall, tilLesbarPeriodeMedArstall } from '@navikt/digisyfo-npm';
import { soknadPt, sykepengesoknad as sykepengesoknadPt } from '../../propTypes/index';
import Lightbox from '../../components/Lightbox';
import {
    InngangspanelHeader,
    InngangspanelIkon,
    InngangspanelInnhold,
    InngangspanelTekst,
    InngangspanelUndertekst,
} from '../../components/Inngangspanel';

const SoknadLightbox = ({ soknad, onClose }) => {
    return (<Lightbox onClose={onClose}>
        <h3 className="modal__tittel">{getLedetekst('soknader.teaser.fremtidig.dato-tittel')}</h3>
        <p>{
            getLedetekst('soknader.teaser.fremtidig.dato-info', {
                '%DATO%': tilLesbarDatoMedArstall(soknad.tom),
            })
        }</p>
        <div className="knapperad">
            <Knapp onClick={onClose}>Lukk</Knapp>
        </div>
    </Lightbox>);
};

SoknadLightbox.propTypes = {
    soknad: sykepengesoknadPt,
    onClose: PropTypes.func,
};

class FremtidigSoknadTeaser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vis: false,
        };
    }

    render() {
        const { soknad } = this.props;

        return (<article aria-labelledby={`soknader-header-${soknad.id}`}>
            <button
                className="inngangspanel inngangspanel--inaktivt"
                onClick={(e) => {
                    e.preventDefault();
                    this.setState({
                        vis: true,
                    });
                }}>
                <InngangspanelIkon ikon={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/soknader.svg`} />
                <InngangspanelInnhold>
                    <InngangspanelHeader
                        id={`soknad-header-${soknad.id}`}
                        meta={getLedetekst('soknad.teaser.dato.fremtidig', { '%DATO%': tilLesbarDatoMedArstall(soknad.tom) })}
                        tittel={getLedetekst('soknad.teaser.tittel')}
                        status={getLedetekst(`soknad.teaser.status.${soknad.status}`)} />
                    <InngangspanelTekst Tag="p">
                        {
                            getLedetekst('soknad.teaser.tekst', {
                                '%PERIODE%': tilLesbarPeriodeMedArstall(soknad.fom, soknad.tom),
                            })
                        }
                    </InngangspanelTekst>
                    {
                        soknad.arbeidsgiver
                            ? (<InngangspanelUndertekst>
                                {soknad.arbeidsgiver.navn}
                            </InngangspanelUndertekst>)
                            : null
                    }
                </InngangspanelInnhold>
            </button>
            {
                this.state.vis
                    ? <SoknadLightbox
                        soknad={soknad}
                        onClose={() => {
                            this.setState({
                                vis: false,
                            });
                        }} />
                    : null
            }
        </article>);
    }
}

FremtidigSoknadTeaser.propTypes = {
    soknad: PropTypes.oneOfType([sykepengesoknadPt, soknadPt]),
};

export default FremtidigSoknadTeaser;
