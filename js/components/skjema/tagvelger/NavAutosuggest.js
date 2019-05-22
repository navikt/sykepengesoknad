import Autosuggest from 'react-autosuggest';
import React, { Component } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Forslag } from './Forslag';

const getQueryIndex = (query, forslag) => {
    return forslag.getText()
        .toLowerCase()
        .indexOf(query.toLowerCase());
};

const getSuggestionValue = (forslag) => {
    return forslag.getText();
};

const renderSuggestion = (forslag, { query }) => {
    const escapedRegex = query.trim().replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    const html = {
        __html: forslag.getText().replace(RegExp(escapedRegex, 'gi'), (x) => {
            return `<mark>${unescape(x)}</mark>`;
        }),
    };
    return (<div dangerouslySetInnerHTML={html} />);
};

class NavAutosuggest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: [],
        };
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    }

    onChange(event, { newValue }) {
        this.setState({
            value: newValue,
        });
    }

    onBlur(event) {
        const value = event.target.value;
        const forslag = new Forslag(value.trim());
        const forslagFraListe = this.props.forslagsliste.find((_forslag) => {
            return _forslag.getText().toUpperCase() === forslag.getText().toUpperCase();
        });
        if (forslagFraListe) {
            this.velgForslag(forslag);
        }
    }

    onSuggestionsFetchRequested({ value }) {
        const eksakteForslag = this.props.forslagsliste.filter((forslag) => {
            return getQueryIndex(value, forslag) === 0;
        });
        const delvisMatchForslag = this.props.forslagsliste.filter((forslag) => {
            return getQueryIndex(value, forslag) > 0;
        });
        const suggestions = [...eksakteForslag, ...delvisMatchForslag]
            .filter((forslag) => {
                return forslag.getId() !== 'NORGE';
            })
            .slice(0, 5);
        this.setState({
            suggestions,
        });
    }

    onSuggestionSelected(event, { suggestion }) {
        const ENTER = 13;
        if (event.keyCode === ENTER) {
            event.preventDefault();
        }
        this.velgForslag(suggestion);
    }

    onSuggestionsClearRequested() {
        this.setState({
            suggestions: [],
        });
    }

    velgForslag(suggestion) {
        this.setState({
            value: '',
        });
        this.props.onAdd(suggestion);
    }

    render() {
        return (<Autosuggest
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            suggestions={this.state.suggestions}
            inputProps={{
                value: this.state.value,
                onChange: this.onChange,
                onBlur: this.onBlur,
                name: this.props.id,
                className: cn('skjemaelement__input input--l input--autocomplete', {
                    'input--autocompleteFocus': this.state.focus,
                }),
            }}
            id={this.props.id}
            name={this.props.name}
        />);
    }
}

NavAutosuggest.propTypes = {
    forslagsliste: PropTypes.arrayOf(PropTypes.shape({
        tag: PropTypes.string,
    })),
    id: PropTypes.string,
    name: PropTypes.string,
    onAdd: PropTypes.func,
};

export default NavAutosuggest;
