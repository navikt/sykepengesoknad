import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai from 'chai';
import SendtSoknadSelvstendig from './SendtSoknadSelvstendig';
import RelaterteSoknaderContainer from '../felleskomponenter/relaterte-soknader/RelaterteSoknaderContainer';
import getSykmelding from '../../../test/mock/mockSykmeldinger';
import { SELVSTENDIGE_OG_FRILANSERE } from '../enums/soknadtyper';
import { getSendtSoknadSelvstendig } from '../../../test/mock/mockSoknadSelvstendig';
import { KORRIGERT } from '../enums/soknadstatuser';
import SykmeldingUtdragForSelvstendige
    from './sykmelding-utdrag/SykmeldingUtdragForSelvstendige';
import SoknadHeader from '../felleskomponenter/SoknadHeader';
import SykepengesoknadStatuspanel from '../felleskomponenter/statuspanel/SykepengesoknadStatuspanel';
import mountWithStore from '../../../test/mountWithStore';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('SendtSoknadSelvstendigTest', () => {
    const sendtSoknad = getSendtSoknadSelvstendig({ id: 'soknad1', sykmeldingId: 'sykmelding1' });
    const tilhorendeSykmelding = getSykmelding({
        id: 'sykmelding1',
        valgtArbeidssituasjon: SELVSTENDIGE_OG_FRILANSERE,
    });

    let state;

    beforeEach(() => {
        state = {
            dineSykmeldinger: {
                data: [tilhorendeSykmelding],
            },
            soknader: {
                data: [sendtSoknad],
            },
            unleashToggles: {
                data: [],
                hentingFeilet: false,
            },
        };
    });

    it('Skal ha en soknadstopp', () => {
        const component = mountWithStore(<SendtSoknadSelvstendig
            sykmelding={getSykmelding({ id: 'sykmelding1' })}
            soknad={getSendtSoknadSelvstendig({ id: 'soknad1', sykmeldingId: 'sykmelding1' })}
            params={{ sykepengesoknadId: 'soknad1' }} />, state);
        expect(component.find(SoknadHeader)).to.be.length(1);
    });

    it('Skal ha et statuspanel', () => {
        const component = mountWithStore(<SendtSoknadSelvstendig
            sykmelding={getSykmelding({ id: 'sykmelding1' })}
            soknad={getSendtSoknadSelvstendig({ id: 'soknad1', sykmeldingId: 'sykmelding1' })}
            params={{ sykepengesoknadId: 'soknad1' }} />, state);
        expect(component.find(SykepengesoknadStatuspanel)).to.be.length(1);
    });

    it('Skal ha et utdrag av sykmeldingen', () => {
        const component = mountWithStore(<SendtSoknadSelvstendig
            sykmelding={getSykmelding({ id: 'sykmelding1' })}
            soknad={getSendtSoknadSelvstendig({ id: 'soknad1', sykmeldingId: 'sykmelding1' })}
            params={{ sykepengesoknadId: 'soknad1' }} />, state);
        expect(component.find(SykmeldingUtdragForSelvstendige)).to.be.length(1);
    });

    it('Skal ha to oppsummeringsblokker', () => {
        const component = mountWithStore(<SendtSoknadSelvstendig
            sykmelding={getSykmelding({ id: 'sykmelding1' })}
            soknad={getSendtSoknadSelvstendig({ id: 'soknad1', sykmeldingId: 'sykmelding1' })}
            params={{ sykepengesoknadId: 'soknad1' }} />, state);
        expect(component.find('.js-soknad-oppsummering')).to.be.length(2);
    });

    it('Skal ikke vise tilhørende søknader om søknaden er korrigert', () => {
        const korrigertSoknad = getSendtSoknadSelvstendig({ id: 'korrigert1', status: KORRIGERT, korrigertAv: 'soknad1' });
        state.soknader.data = [...state.soknader.data, korrigertSoknad];

        const component = mountWithStore(<SendtSoknadSelvstendig
            sykmelding={getSykmelding({ id: 'sykmelding1' })}
            soknad={korrigertSoknad}
            params={{ sykepengesoknadId: 'korrigert1' }} />, state);
        expect(component.find(RelaterteSoknaderContainer)).to.be.length(0);
    });

    it('Skal vise lenke til korrigering tilhørende søknader om søknaden er korrigert', () => {
        const korrigertSoknad = getSendtSoknadSelvstendig({ id: 'korrigert1', status: KORRIGERT, korrigertAv: 'soknad1' });
        state.soknader.data = [...state.soknader.data, korrigertSoknad];

        const component = mountWithStore(<SendtSoknadSelvstendig
            sykmelding={getSykmelding({ id: 'sykmelding1' })}
            soknad={korrigertSoknad}
            params={{ sykepengesoknadId: 'korrigert1' }} />, state);
        expect(component.find(RelaterteSoknaderContainer)).to.be.length(0);
    });
});
