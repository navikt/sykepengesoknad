import { CHECKED, UNCHECKED } from '../../enums/svarEnums';

export const genererParseForEnkeltverdi = () => {
    return (verdi) => {
        return verdi || verdi === ''
            ? {
                svarverdier: [{
                    verdi,
                }],
            }
            : undefined;
    };
};

export const genererParseForFlereVerdier = () => {
    return (verdier = []) => {
        return {
            svarverdier: verdier.map((verdi) => {
                return {
                    verdi,
                };
            }),
        };
    };
};

export const genererParseForCheckbox = () => {
    const parse = genererParseForEnkeltverdi();
    return (value) => {
        const checkedVerdi = value ? CHECKED : UNCHECKED;
        return parse(checkedVerdi);
    };
};

export const formaterEnkeltverdi = (value) => {
    try {
        const verdi = value.svarverdier[0].verdi;
        return (verdi === CHECKED || verdi === UNCHECKED)
            ? verdi === CHECKED
            : verdi;
    } catch (e) {
        return '';
    }
};

export const formaterFlereVerdier = (verdi) => {
    return !verdi || !verdi.svarverdier
        ? []
        : verdi.svarverdier.map((svarverdi) => {
            return svarverdi.verdi;
        });
};

export const fjernIndexFraTag = (tag) => {
    const separator = '_';
    const tagdeler = tag.split(separator);
    if (!isNaN(parseInt(tagdeler[tagdeler.length - 1], 10))) {
        tagdeler.splice(-1, 1);
        return tagdeler.join(separator);
    }
    return tag;
};

export const tagMatcher = (tags, inputTag) => {
    return tags.filter((tag) => {
        return inputTag.indexOf(tag) > -1;
    }).length > 0;
};
