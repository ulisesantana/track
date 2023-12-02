import {expect} from 'chai';
import sinon from 'sinon';

import {GetCurrentTimeEntryUseCase} from "../../../src/application/cases";
import {Project, ProjectNotFoundError, TimeEntry} from "../../../src/core";
import {ProjectRepositoryDouble, TimeEntryRepositoryDouble} from "../../doubles";

describe('GetCurrentTimeEntryUseCase', () => {
    let useCase: GetCurrentTimeEntryUseCase;
    let timeEntryRepositoryMock: sinon.SinonStubbedInstance<TimeEntryRepositoryDouble>;
    let projectRepositoryMock: sinon.SinonStubbedInstance<ProjectRepositoryDouble>;

    beforeEach(() => {
        timeEntryRepositoryMock = sinon.createStubInstance(TimeEntryRepositoryDouble);
        projectRepositoryMock = sinon.createStubInstance(ProjectRepositoryDouble);
        useCase = new GetCurrentTimeEntryUseCase(timeEntryRepositoryMock, projectRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return the current time entry and its project when both are found', async () => {
        const currentEntry = new TimeEntry({ description: 'Work', pid: 1, wid: 1 });
        const project = new Project(1, 'Test Project');
        timeEntryRepositoryMock.getCurrentEntry.resolves(currentEntry);
        projectRepositoryMock.getProjectById.resolves(project);

        const result = await useCase.exec();

        expect(result).to.deep.equal([currentEntry, project]);
    });

    it('should return null if there is no current time entry', async () => {
        timeEntryRepositoryMock.getCurrentEntry.resolves(null);

        const result = await useCase.exec();

        expect(result).to.be.null;
    });

    it('should throw ProjectNotFoundError if the project for the current time entry is not found', async () => {
        const currentEntry = new TimeEntry({ description: 'Work', pid: 1, wid: 1 });
        timeEntryRepositoryMock.getCurrentEntry.resolves(currentEntry);
        projectRepositoryMock.getProjectById.resolves(null);

        try {
            await useCase.exec();
            expect.fail('should have thrown ProjectNotFoundError');
        } catch (error) {
            expect(error).to.be.instanceOf(ProjectNotFoundError);
        }
    });


});
