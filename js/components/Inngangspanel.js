import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import cn from 'classnames';

export const InngangspanelIkon = ({ ikon, ikonHover }) => {
    return (<React.Fragment>
        <span className="inngangspanel__ikon inngangspanel__ikon--normal">
            <img alt="" src={ikon} />
        </span>
        <span className="inngangspanel__ikon inngangspanel__ikon--hover">
            <img alt="" src={ikonHover || ikon} />
        </span>
    </React.Fragment>);
};

InngangspanelIkon.propTypes = {
    ikon: PropTypes.string.isRequired,
    ikonHover: PropTypes.string,
};

export const Inngangspanel = ({ children, className, ...rest }) => {
    return (<Link className={cn('inngangspanel', className)} {...rest}>
        {children}
    </Link>);
};

Inngangspanel.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export const InngangspanelInnhold = ({ children }) => {
    return (<div className="inngangspanel__innhold">
        {children}
    </div>);
};

InngangspanelInnhold.propTypes = {
    children: PropTypes.node,
};

export const InngangspanelHeader = ({ meta, tittel, status, id }) => {
    return (<header className="inngangspanel__header">
        <h3 className="js-title" id={id}>
            <small className="inngangspanel__meta">
                {meta}
            </small>
            <span className="inngangspanel__tittel">
                {tittel}
            </span>
        </h3>
        {
            status
                ? <p className="inngangspanel__status js-status">{status}</p>
                : null
        }
    </header>);
};

InngangspanelHeader.propTypes = {
    meta: PropTypes.string,
    tittel: PropTypes.string,
    status: PropTypes.string,
    id: PropTypes.string,
};

export const InngangspanelTekst = ({ children, Tag = 'div' }) => {
    return (<Tag className="inngangspanel__tekst">{children}</Tag>);
};

InngangspanelTekst.propTypes = {
    children: PropTypes.node,
    Tag: PropTypes.string,
};

export const InngangspanelUndertekst = ({ children, className }) => {
    return (<p className={cn('inngangspanel__undertekst js-undertekst mute', className)}>{children}</p>);
};

InngangspanelUndertekst.propTypes = {
    children: PropTypes.string,
    className: PropTypes.string,
};
