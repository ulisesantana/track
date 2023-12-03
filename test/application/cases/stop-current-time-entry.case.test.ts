import {expect} from 'chai';
import sinon from 'sinon';

import {StopCurrentTimeEntryUseCase} from '../../../src/application/cases'
import {TimeEntryRepository} from "../../../src/application/repositories";
import {TimeHelper} from "../../../src/core";
import {buildTimeEntry} from "../../builders";
import {TimeEntryRepositoryDouble} from "../../doubles";


describe('StopCurrentTimeEntryUseCase', () => {
    let useCase: StopCurrentTimeEntryUseCase;
    let timeEntryRepositoryMock: sinon.SinonStubbedInstance<TimeEntryRepository>;
    let timeHelperMock: sinon.SinonStubbedInstance<TimeHelper>;

    beforeEach(() => {
        timeEntryRepositoryMock = sinon.createStubInstance(TimeEntryRepositoryDouble);
        timeHelperMock = sinon.createStubInstance(TimeHelper);
        useCase = new StopCurrentTimeEntryUseCase(timeEntryRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });


    it('should stop current time entry', async () => {
        const timeEntry = buildTimeEntry()
        const stopTime = new Date().toISOString();
        timeEntryRepositoryMock.getCurrentEntry.resolves(timeEntry);
        timeEntryRepositoryMock.stopEntry.resolves(timeEntry);
        timeHelperMock.getCurrentUtcDate.returns(stopTime)
        useCase = new StopCurrentTimeEntryUseCase(timeEntryRepositoryMock, timeHelperMock);

        const result = await useCase.exec();

        expect(result).to.be.equal(timeEntry)
        sinon.assert.calledWith(timeEntryRepositoryMock.stopEntry, timeEntry.id, stopTime);
    });


    it('should return null if there is no time entry to stop', async () => {
        timeEntryRepositoryMock.getCurrentEntry.resolves(null);

        const result = await useCase.exec();

        expect(result).to.be.null
        sinon.assert.notCalled(timeEntryRepositoryMock.stopEntry);
    });

});
