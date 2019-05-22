import React from 'react';
import PropTypes from 'prop-types';
import {
    getLedetekst,
    toDatePrettyPrint,
    sykepengesoknadstatuser,
    tilLesbarDatoMedArstall,
    tilLesbarPeriodeMedArstall,
} from '@navikt/digisyfo-npm';
import getContextRoot from '../../utils/getContextRoot';
import { sykepengesoknad as sykepengesoknadPt, soknadPt } from '../../propTypes/index';
import { getSendtTilSuffix, erSendtTilBeggeMenIkkeSamtidig } from '../utils/sykepengesoknadUtils';
import { OPPHOLD_UTLAND, SELVSTENDIGE_OG_FRILANSERE } from '../../sykepengesoknad/enums/soknadtyper';
import { FREMTIDIG } from '../../sykepengesoknad/enums/soknadstatuser';
import {
    Inngangspanel,
    InngangspanelHeader,
    InngangspanelIkon,
    InngangspanelInnhold,
    InngangspanelTekst,
    InngangspanelUndertekst,
} from '../../components/Inngangspanel';

const { NY, SENDT, TIL_SENDING, UTKAST_TIL_KORRIGERING, AVBRUTT } = sykepengesoknadstatuser;

const finnArbeidsgivernavn = (soknad) => {
    return soknad.arbeidsgiver
    && soknad.arbeidsgiver.navn
        ? soknad.arbeidsgiver.navn
        : soknad.arbeidsgiver
            ? soknad.arbeidsgiver
            : soknad.sykmelding
            && soknad.sykmelding.innsendtArbeidsgivernavn
                ? soknad.sykmelding.innsendtArbeidsgivernavn
                : null;
};

export const SendtUlikt = ({ soknad }) => {
    return (<span>
        {
            getLedetekst('soknad.teaser.status.SENDT.til-arbeidsgiver', {
                '%DATO%': toDatePrettyPrint(soknad.sendtTilArbeidsgiverDato),
                '%ARBEIDSGIVER%': soknad.arbeidsgiver.navn,
            })
        }
        <br />
        {
            getLedetekst('soknad.teaser.status.SENDT.til-nav', {
                '%DATO%': toDatePrettyPrint(soknad.sendtTilNAVDato),
            })
        }
    </span>);
};

SendtUlikt.propTypes = {
    soknad: sykepengesoknadPt.isRequired,
};

const hentIkon = (soknadstype) => {
    return soknadstype === OPPHOLD_UTLAND
        ? `${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/globe.svg`
        : `${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/soknader.svg`;
};

const hentIkonHover = (soknadstype) => {
    return soknadstype === OPPHOLD_UTLAND
        ? `${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/globe-hover.svg`
        : `${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/soknader_hover-blue.svg`;
};

const beregnUndertekst = (soknad) => {
    const sendtTilBeggeMenIkkeSamtidig = erSendtTilBeggeMenIkkeSamtidig(soknad);

    if (soknad.status === AVBRUTT) {
        return getLedetekst('soknad.teaser.status.AVBRUTT', {
            '%DATO%': tilLesbarDatoMedArstall(soknad.avbruttDato),
        });
    }

    if (soknad.status === FREMTIDIG) {
        return getLedetekst(`soknad.teaser.status.${FREMTIDIG}`);
    }

    switch (soknad.soknadstype) {
        case OPPHOLD_UTLAND:
        case SELVSTENDIGE_OG_FRILANSERE: {
            return soknad.status === SENDT
                ? getLedetekst('soknad.teaser.status.SENDT.til-nav', {
                    '%DATO%': tilLesbarDatoMedArstall(soknad.innsendtDato),
                })
                : null;
        }
        default: {
            switch (soknad.status) {
                case SENDT:
                case TIL_SENDING: {
                    return sendtTilBeggeMenIkkeSamtidig
                        ? <SendtUlikt soknad={soknad} />
                        : getLedetekst(`soknad.teaser.status.${soknad.status}${getSendtTilSuffix(soknad)}`, {
                            '%DATO%': tilLesbarDatoMedArstall(soknad.sendtTilArbeidsgiverDato || soknad.sendtTilNAVDato),
                            '%ARBEIDSGIVER%': finnArbeidsgivernavn(soknad),
                        });
                }
                case NY:
                case UTKAST_TIL_KORRIGERING: {
                    return getLedetekst('soknad.teaser.undertekst', {
                        '%ARBEIDSGIVER%': finnArbeidsgivernavn(soknad),
                    });
                }
                default: {
                    return null;
                }
            }
        }
    }
};

export const TeaserUndertekst = ({ soknad }) => {
    const tekst = beregnUndertekst(soknad);
    return tekst ? (<InngangspanelUndertekst>
        {tekst}
    </InngangspanelUndertekst>) : null;
};

TeaserUndertekst.propTypes = {
    soknad: PropTypes.oneOfType([sykepengesoknadPt, soknadPt]).isRequired,
};

export const hentTeaserStatustekst = (soknad) => {
    const visStatus = [NY, SENDT, AVBRUTT].indexOf(soknad.status) === -1;
    return visStatus
        ? getLedetekst(`soknad.teaser.status.${soknad.status}`, {
            '%DATO%': tilLesbarDatoMedArstall(soknad.sendtTilArbeidsgiverDato || soknad.sendtTilNAVDato),
        })
        : null;
};

export const TeaserPeriode = ({ soknad }) => {
    return soknad.soknadstype !== OPPHOLD_UTLAND
        ? (<InngangspanelTekst tag="p">
            {
                getLedetekst('soknad.teaser.tekst', {
                    '%PERIODE%': tilLesbarPeriodeMedArstall(soknad.fom, soknad.tom),
                })
            }
        </InngangspanelTekst>)
        : null;
};

TeaserPeriode.propTypes = {
    soknad: PropTypes.oneOfType([sykepengesoknadPt, soknadPt]).isRequired,
};

const SykepengesoknadTeaser = ({ soknad }) => {
    const status = soknad.status ? soknad.status.toLowerCase() : '';

    return (<article aria-labelledby={`soknader-header-${soknad.id}`}>
        <Inngangspanel
            className={`js-panel js-soknad-${status}`}
            to={`${getContextRoot()}/soknader/${soknad.id}`}>
            <InngangspanelIkon
                ikon={hentIkon(soknad.soknadstype)}
                ikonHover={hentIkonHover(soknad.soknadstype)}
            />
            <InngangspanelInnhold>
                <InngangspanelHeader
                    id={`soknad-header-${soknad.id}`}
                    meta={getLedetekst('soknad.teaser.dato', {
                        '%DATO%': tilLesbarDatoMedArstall(soknad.opprettetDato),
                    })}
                    tittel={getLedetekst(soknad.soknadstype === OPPHOLD_UTLAND
                        ? 'soknad.utland.teaser.tittel'
                        : 'soknad.teaser.tittel')}
                    status={hentTeaserStatustekst(soknad)} />
                <TeaserPeriode soknad={soknad} />
                <TeaserUndertekst soknad={soknad} />
            </InngangspanelInnhold>
        </Inngangspanel>
    </article>);
};

SykepengesoknadTeaser.propTypes = {
    soknad: PropTypes.oneOfType([sykepengesoknadPt, soknadPt]).isRequired,
};

export default SykepengesoknadTeaser;
