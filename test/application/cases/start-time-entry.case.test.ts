import {expect} from 'chai';
import sinon from 'sinon';

import {StartTimeEntryUseCase} from '../../../src/application/cases'
import {ProjectRepository, TimeEntryRepository} from "../../../src/application/repositories";
import {ProjectNotFoundError, TimeHelper} from '../../../src/core';
import {buildProject, buildTimeEntry} from "../../builders";
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
        timeEntryRepositoryMock.createEntry.resolves(buildTimeEntry({...input, project: buildProject({id: input.project})}));
        projectRepositoryMock.getProjectByName.resolves(null);
        useCase = new StartTimeEntryUseCase(timeEntryRepositoryMock, projectRepositoryMock)

        const result = await useCase.exec(input);

        expect(result.description).to.equal(input.description)
        sinon.assert.calledWith(timeEntryRepositoryMock.createEntry, sinon.match.has('description', input.description));
    });

    it('should start a time entry with a valid project name', async () => {
        const input = {description: 'Test Task', project: 'Test Project'};
        const project = buildProject({id: 123, name: 'Test Project'});
        projectRepositoryMock.getProjectByName.resolves(project);
        timeEntryRepositoryMock.createEntry.resolves();

        await useCase.exec(input);

        sinon.assert.calledWith(projectRepositoryMock.getProjectByName, 'Test Project');
        sinon.assert.calledWith(timeEntryRepositoryMock.createEntry, sinon.match.has('description', input.description));
    });

    it('should throw an error if the project is not found by name', async () => {
        const input = {description: 'Test Task', project: 'Unknown Project'};
        projectRepositoryMock.getProjectByName.resolves(null);

        try {
            await useCase.exec(input);
            expect.fail('should have thrown an error');
        } catch (error) {
            expect(error).to.be.instanceOf(ProjectNotFoundError);
        }
    });

    it('should throw an error if the project is not found by id', async () => {
        const input = {description: 'Test Task', project: 1};
        projectRepositoryMock.getProjectById.resolves(null);

        try {
            await useCase.exec(input);
            expect.fail('should have thrown an error');
        } catch (error) {
            expect(error).to.be.instanceOf(ProjectNotFoundError);
        }
    });

});
