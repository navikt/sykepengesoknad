import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const IllustrertInnhold = ({ ikon, ikonAlt, children, liten, revers }) => {
    const classnamesIkon = cn('illustrertInnhold__ikon', {
        'illustrertInnhold__ikon--liten': liten,
    });
    const classNamesBoks = cn('illustrertInnhold', {
        'illustrertInnhold--revers': revers,
    });
    return (<div className={classNamesBoks}>
        <div className={classnamesIkon}>
            <img src={ikon} alt={ikonAlt} />
        </div>
        <div className="illustrertInnhold__innhold">{children}</div>
    </div>);
};

IllustrertInnhold.propTypes = {
    ikon: PropTypes.string,
    ikonAlt: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
    revers: PropTypes.bool,
    liten: PropTypes.bool,
};

export const IllustrertInnholdGronnHake = (props) => {
    return <IllustrertInnhold {...props} ikon={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/kvitteringhake.svg`} ikonAlt="Hake" />;
};

export default IllustrertInnhold;
