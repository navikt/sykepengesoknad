import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Vis } from '../utils';

const Sidetopp = ({ tittel, htmlTekst = null, className }) => {
    const classNames = cn('sidetopp', className);
    return (<header className={classNames}>
        <h1 className="sidetopp__tittel">
            {tittel}
        </h1>
        <Vis
            hvis={htmlTekst !== null}
            render={() => {
                return (<div className="sidetopp__intro js-intro">
                    <p dangerouslySetInnerHTML={htmlTekst} />
                </div>);
            }} />
    </header>);
};

Sidetopp.propTypes = {
    tittel: PropTypes.string.isRequired,
    htmlTekst: PropTypes.shape({
        __html: PropTypes.string,
    }),
    className: PropTypes.string,
};

export default Sidetopp;
