import { tidligsteFom, senesteTom } from '@navikt/digisyfo-npm';

export const settErOppdelt = (soknad, sykmelding) => {
    if (!sykmelding) {
        return {
            ...soknad,
            _erOppdelt: false,
        };
    }

    const tomSykmelding = senesteTom(sykmelding.mulighetForArbeid.perioder);
    const fomSykmelding = tidligsteFom(sykmelding.mulighetForArbeid.perioder);
    const _erOppdelt = !(soknad.fom.getTime() === fomSykmelding.getTime()
        && soknad.tom.getTime() === tomSykmelding.getTime());
    return {
        ...soknad,
        _erOppdelt,
    };
};
