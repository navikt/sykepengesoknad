import PropTypes from 'prop-types';
import React from 'react';

const kryss = String.fromCharCode(215);

const Tag = ({ onDelete, verdi }) => {
    return (<span className="etikett etikett--info etikett--tag">
        <span className="etikett--tag__verdi">{verdi}</span>
        <button
            type="button"
            className="etikett__slett"
            onClick={onDelete}>
            <span className="etikett__slett-label etikett__slett-label--skjermleser">Slett</span>
            <span aria-hidden="true" className="etikett__slett-label">{kryss}</span>
        </button>
    </span>);
};

Tag.propTypes = {
    onDelete: PropTypes.func,
    verdi: PropTypes.string,
};

export const ValgteTags = ({ handleDelete, verdier }) => {
    return (<div aria-live="polite">
        {
            verdier && verdier.length > 0
                ? verdier.map((verdi, index) => {
                    return (<Tag
                        key={verdi}
                        onDelete={() => {
                            handleDelete(index);
                        }}
                        verdi={verdi} />);
                })
                : null
        }
    </div>);
};

ValgteTags.propTypes = {
    handleDelete: PropTypes.func.isRequired,
    verdier: PropTypes.arrayOf(PropTypes.string).isRequired,
};
