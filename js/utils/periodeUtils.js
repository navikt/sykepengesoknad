import { fraInputdatoTilJSDato, periodeOverlapperMedPeriode, tilDatePeriode } from '@navikt/digisyfo-npm';

const ETT_DOGN = 1000 * 60 * 60 * 24;

const erPafolgendeDager = (a, b) => {
    return b.getTime() - a.getTime() === 86400000;
};

export const datoErHelgedag = (dato) => {
    const LORDAG = 6;
    const SONDAG = 0;
    return dato.getDay() === LORDAG || dato.getDay() === SONDAG;
};

export const erGyldigPeriode = (periode) => {
    try {
        fraInputdatoTilJSDato(periode.fom);
        fraInputdatoTilJSDato(periode.tom);
    } catch (e) {
        return false;
    }
    return true;
};

export const erGyldigePerioder = (perioder) => {
    return perioder.reduce((acc, p) => {
        return erGyldigPeriode(p) && acc;
    }, true);
};

export const periodeErHelg = (periode) => {
    let fom;
    let tom;
    try {
        fom = fraInputdatoTilJSDato(periode.fom);
    } catch (e) {
        return false;
    }
    try {
        tom = fraInputdatoTilJSDato(periode.tom);
    } catch (e) {
        return false;
    }
    if (datoErHelgedag(fom) && datoErHelgedag(tom) && (erPafolgendeDager(fom, tom) || fom.getTime() === tom.getTime())) {
        return true;
    }
    return false;
};

export const perioderErHelg = (perioder) => {
    return perioder.length > 0 && perioder.reduce((acc, periode) => {
        return acc && periodeErHelg(periode) === true;
    }, true);
};

export const periodeOverlapperMedPerioder = (periode_, perioder_) => {
    if (!erGyldigePerioder(perioder_) || !erGyldigPeriode(periode_)) {
        return false;
    }

    const periode = tilDatePeriode(periode_);
    const perioder = perioder_.map(tilDatePeriode);

    return perioder.reduce((acc, p) => {
        return periodeOverlapperMedPeriode(periode, p) || acc;
    }, false);
};

export const perioderOverlapperMedPerioder = (perioderA, perioderB) => {
    if (!perioderA || !perioderB || perioderA.length === 0 || perioderB.length === 0) {
        return false;
    }
    const bools = perioderA.map((periode) => {
        return periodeOverlapperMedPerioder(periode, perioderB);
    });

    return bools.reduce((acc, bool) => {
        return acc && bool;
    }, true);
};

export const harOverlappendePerioder = (perioder) => {
    const gyldigePerioder = perioder.filter(erGyldigPeriode);
    if (gyldigePerioder.length === 0) {
        return false;
    }
    const overlappingsinfo = gyldigePerioder.map((p, index) => {
        const perioderUtenDennePerioden = gyldigePerioder.filter((p2, index2) => {
            return index !== index2;
        });
        return periodeOverlapperMedPerioder(p, perioderUtenDennePerioden);
    });
    return overlappingsinfo.reduce((acc, bool) => {
        return acc || bool;
    }, false);
};

export const antallVirkedagerIPeriode = (periode) => {
    const start = periode.fom.getTime();
    const slutt = periode.tom.getTime();
    let antallVirkedager = 0;

    for (let i = start; i <= slutt; i += ETT_DOGN) {
        const d = new Date(i);
        if (!datoErHelgedag(d)) {
            antallVirkedager += 1;
        }
    }
    return antallVirkedager;
};

export const antallVirkedagerIPerioder = (perioder, startdato) => {
    const virkedager = new Set();
    perioder.forEach((periode) => {
        const start = periode.fom.getTime();
        const slutt = periode.tom.getTime();
        for (let i = start; i <= slutt; i += ETT_DOGN) {
            const d = new Date(i);
            if (!datoErHelgedag(d) && (!startdato || d.getTime() >= startdato.getTime())) {
                virkedager.add(d.getTime());
            }
        }
    });
    return virkedager.size;
};

export const tilDager = (perioder) => {
    const dager = [];
    perioder.forEach((periode) => {
        for (let i = periode.fom.getTime(); i <= periode.tom.getTime(); i += ETT_DOGN) {
            dager.push(new Date(i));
        }
    });
    return dager;
};
