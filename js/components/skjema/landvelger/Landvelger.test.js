import sinon from 'sinon';
import { genererHandleAddition } from './Landvelger';
import expect from '../../../../test/expect';
import { genererParseForFlereVerdier } from '../../../sykepengesoknad/felleskomponenter/sporsmal/fieldUtils';
import landliste from './landliste';
import { Forslag } from '../tagvelger/Forslag';

describe('Landvelger', () => {
    describe('genererHandleAddition', () => {
        let doAutofill;
        let doTouch;
        const form = 'mitt_skjema';
        let meta;
        let input;
        let parse;
        const name = 'LAND';

        beforeEach(() => {
            doAutofill = sinon.spy();
            doTouch = sinon.spy();
            meta = {
                form,
            };
            input = {
                value: '',
                name,
            };
            parse = genererParseForFlereVerdier();
        });

        it('Skal fylle ut felt når felt ikke har noe verdi fra før', () => {
            const handleAddition = genererHandleAddition(meta, input, doAutofill, doTouch, landliste);
            handleAddition(new Forslag('Sverige'));
            expect(doAutofill.getCall(0).args).to.deep.equal([
                form,
                name,
                parse(['Sverige']),
            ]);
        });

        it('Skal ikke fylle ut felt når det ikke finnes innsendt tag-liste', () => {
            const handleAddition = genererHandleAddition(meta, input, doAutofill, doTouch, landliste);
            handleAddition(new Forslag('Sveriges'));
            expect(doAutofill.called).to.equal(false);
        });

        it('Skal fylle ut felt når felt har verdi fra før', () => {
            input.value = parse(['Sverige']);
            const handleAddition = genererHandleAddition(meta, input, doAutofill, doTouch, landliste);
            handleAddition(new Forslag('Danmark'));
            expect(doAutofill.getCall(0).args).to.deep.equal([
                form,
                name,
                parse(['Sverige', 'Danmark']),
            ]);
        });
    });
});
