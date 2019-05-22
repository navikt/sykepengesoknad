import React from 'react';
// eslint-disable-next-line
import Modal from 'nav-frontend-modal';
import cn from 'classnames';
import PropTypes from 'prop-types';

const m = 'm';

const Lightbox = ({ onClose, children, bredde }) => {
    const appEl = document.getElementById('maincontent');
    const classNames = cn({
        'modal--medium': bredde === m,
    });
    Modal.setAppElement(appEl);
    return (<Modal
        className={classNames}
        isOpen
        closeButton
        onRequestClose={onClose}>
        {children}
    </Modal>);
};

Lightbox.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func,
    bredde: PropTypes.oneOf([m]),
};

export default Lightbox;
