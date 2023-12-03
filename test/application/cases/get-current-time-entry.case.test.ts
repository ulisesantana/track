import {expect} from 'chai';
import sinon from 'sinon';

import {GetCurrentTimeEntryUseCase} from "../../../src/application/cases";
import {buildTimeEntry} from "../../builders";
import {TimeEntryRepositoryDouble} from "../../doubles";

describe('GetCurrentTimeEntryUseCase', () => {
    let useCase: GetCurrentTimeEntryUseCase;
    let timeEntryRepositoryMock: sinon.SinonStubbedInstance<TimeEntryRepositoryDouble>;

    beforeEach(() => {
        timeEntryRepositoryMock = sinon.createStubInstance(TimeEntryRepositoryDouble);
        useCase = new GetCurrentTimeEntryUseCase(timeEntryRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return the current time entry and its project when both are found', async () => {
        const currentEntry = buildTimeEntry();
        timeEntryRepositoryMock.getCurrentEntry.resolves(currentEntry);

        const result = await useCase.exec();

        expect(result).to.deep.equal(currentEntry);
    });

    it('should return null if there is no current time entry', async () => {
        timeEntryRepositoryMock.getCurrentEntry.resolves(null);

        const result = await useCase.exec();

        expect(result).to.be.null;
    });

});
