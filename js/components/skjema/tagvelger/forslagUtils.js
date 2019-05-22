import { Forslag } from './Forslag';

export const tilForslagsliste = (suggestions, verdiArray = []) => {
    return suggestions
        .filter((suggestion) => {
            return verdiArray && verdiArray.includes
                ? !verdiArray.includes(suggestion)
                : true;
        })
        .map((tag) => {
            return new Forslag(tag);
        });
};

export const forslagFinnesIForslagsliste = (forslagsliste, forslag) => {
    const formatertliste = tilForslagsliste(forslagsliste);
    return formatertliste.find((t) => {
        return t.getId() === forslag.getId();
    }) !== undefined;
};

export const finnForslag = (forslagsliste, forslag) => {
    const formatertListe = tilForslagsliste(forslagsliste);
    return formatertListe.find((t) => {
        return t.getId() === forslag.getId();
    })
        .getText();
};
