import {expect} from 'chai';
import sinon from 'sinon';

import {GetCurrentWeekReportUseCase} from '../../../src/application/cases'
import {ProjectRepository, TimeEntryRepository} from "../../../src/application/repositories";
import {ProjectRepositoryDouble, TimeEntryRepositoryDouble} from "../../doubles";


describe('GetCurrentWeekReportUseCase', () => {
    let useCase: GetCurrentWeekReportUseCase;
    let timeEntryRepositoryMock: sinon.SinonStubbedInstance<TimeEntryRepository>;
    let projectRepositoryMock: sinon.SinonStubbedInstance<ProjectRepository>;

    beforeEach(() => {
        timeEntryRepositoryMock = sinon.createStubInstance(TimeEntryRepositoryDouble);
        projectRepositoryMock = sinon.createStubInstance(ProjectRepositoryDouble);
        useCase = new GetCurrentWeekReportUseCase(timeEntryRepositoryMock, projectRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });


    it.skip('should do something successfully', async () => {
        timeEntryRepositoryMock.createEntry.resolves();
        projectRepositoryMock.getProjectByName.resolves(null);

        await useCase.exec();

        sinon.assert.calledWith(timeEntryRepositoryMock.createEntry, sinon.match.has('pid', 123));
    });

    it.skip('should throw an error for any reason', async () => {
        projectRepositoryMock.getProjectByName.resolves(null);

        try {
            await useCase.exec();
            expect.fail('should have thrown an error');
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
        }
    });

});

