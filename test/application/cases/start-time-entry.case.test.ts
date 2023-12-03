import {expect} from 'chai';
import sinon from 'sinon';

import {StartTimeEntryUseCase} from '../../../src/application/cases'
import {ProjectRepository, TimeEntryRepository} from "../../../src/application/repositories";
import {ProjectNotFoundError, TimeHelper} from '../../../src/core';
import {ProjectRepositoryDouble, TimeEntryRepositoryDouble} from "../../doubles";

describe('StartTimeEntryUseCase', () => {
    let useCase: StartTimeEntryUseCase;
    let timeEntryRepositoryMock: sinon.SinonStubbedInstance<TimeEntryRepository>;
    let projectRepositoryMock: sinon.SinonStubbedInstance<ProjectRepository>;
    let timeHelperMock: sinon.SinonStubbedInstance<TimeHelper>;

    beforeEach(() => {
        timeEntryRepositoryMock = sinon.createStubInstance(TimeEntryRepositoryDouble);
        projectRepositoryMock = sinon.createStubInstance(ProjectRepositoryDouble);
        timeHelperMock = sinon.createStubInstance(TimeHelper);
        useCase = new StartTimeEntryUseCase(timeEntryRepositoryMock, projectRepositoryMock, timeHelperMock);
    });

    afterEach(() => {
        sinon.restore();
    });


    it('should start a time entry with a valid project ID', async () => {
        const input = {description: 'Test Task', project: 123};
        timeEntryRepositoryMock.createEntry.resolves();
        projectRepositoryMock.getProjectByName.resolves(null);
        useCase = new StartTimeEntryUseCase(timeEntryRepositoryMock, projectRepositoryMock)

        await useCase.exec(input);

        sinon.assert.calledWith(timeEntryRepositoryMock.createEntry, sinon.match.has('pid', 123));
    });

    it('should start a time entry with a valid project name', async () => {
        const input = {description: 'Test Task', project: 'Test Project'};
        const project = {id: 123, name: 'Test Project'};
        projectRepositoryMock.getProjectByName.resolves(project);
        timeEntryRepositoryMock.createEntry.resolves();

        await useCase.exec(input);

        sinon.assert.calledWith(projectRepositoryMock.getProjectByName, 'Test Project');
        sinon.assert.calledWith(timeEntryRepositoryMock.createEntry, sinon.match.has('pid', 123));
    });

    it('should throw an error if the project is not found', async () => {
        const input = {description: 'Test Task', project: 'Unknown Project'};
        projectRepositoryMock.getProjectByName.resolves(null);

        try {
            await useCase.exec(input);
            expect.fail('should have thrown an error');
        } catch (error) {
            expect(error).to.be.instanceOf(ProjectNotFoundError);
        }
    });

});