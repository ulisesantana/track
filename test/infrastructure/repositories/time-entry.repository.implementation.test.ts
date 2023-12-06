/* eslint-disable camelcase */
import {expect} from 'chai';
import sinon from 'sinon';

import {TimeEntry, TimeEntryList, TimeHelper} from "../../../src/core";
import {TogglApi} from "../../../src/infrastructure/data-sources";
import {TimeEntryRepositoryImplementation} from "../../../src/infrastructure/repositories";
import {buildProject, buildTimeEntry, buildTogglProject, buildTogglTimeEntry} from "../../builders";

describe('TimeEntryRepositoryImplementation', () => {
    let repository: TimeEntryRepositoryImplementation;
    let apiMock: sinon.SinonStubbedInstance<TogglApi>;

    beforeEach(() => {
        apiMock = sinon.createStubInstance(TogglApi);
        repository = new TimeEntryRepositoryImplementation(apiMock, new TimeHelper());
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should correctly create a time entry', async () => {
        const mockTogglEntry = buildTogglTimeEntry();
        apiMock.createTimeEntry.resolves(mockTogglEntry);
        const entry = buildTimeEntry({...mockTogglEntry, project: buildProject({id: mockTogglEntry.project_id})});
        const date = new Date();

        const result = await repository.createEntry(entry, date);

        expect(result).to.be.deep.equal(entry);
        sinon.assert.calledOnceWithExactly(apiMock.createTimeEntry, mockTogglEntry, date);
    });

    it('should retrieve the current time entry when it exists', async () => {
        const mockProject = buildTogglProject();
        const mockEntry = buildTogglTimeEntry({project_id: mockProject.id});
        apiMock.getTimeEntries.resolves([mockEntry]);
        apiMock.getProjectById.resolves(mockProject);

        const result = await repository.getCurrentEntry();

        expect(result).to.be.deep.equal(buildTimeEntry({...mockEntry, project: buildProject(mockProject)}));
    });

    it('should return null when there is no current time entry', async () => {
        apiMock.getTimeEntries.resolves([]);

        const result = await repository.getCurrentEntry();

        expect(result).to.be.null;
    });

    it('should retrieve entries for the current week', async () => {
        const mockProjects = [buildTogglProject(), buildTogglProject()];
        const mockEntries = mockProjects.flatMap(p => [
            buildTogglTimeEntry({project_id: p.id}),
            buildTogglTimeEntry({project_id: p.id})
        ])
        apiMock.getTimeEntries.resolves(mockEntries);
        apiMock.getProjects.resolves(mockProjects);

        const result = await repository.getCurrentWeekEntries();

        expect(result).to.be.an.instanceof(TimeEntryList);
        expect(result.values).to.have.lengthOf(mockEntries.length);
    });

    it('should return an empty TimeEntryList when there are no entries for the current week', async () => {
        apiMock.getTimeEntries.resolves([]);

        const result = await repository.getCurrentWeekEntries();

        expect(result).to.be.an.instanceof(TimeEntryList);
        expect(result.values).to.be.empty;
    });

    it('should retrieve the last entry', async () => {
        const mockProject = buildTogglProject()
        const mockEntry = buildTogglTimeEntry({project_id: mockProject.id});
        apiMock.getTimeEntries.resolves([mockEntry]);
        apiMock.getProjectById.resolves(mockProject)

        const result = await repository.getLastEntry();

        expect(result).to.be.deep.equal(buildTimeEntry({...mockEntry, project: buildProject(mockProject)}));
    });

    it('should return null when there are no entries', async () => {
        apiMock.getTimeEntries.resolves([]);

        const result = await repository.getLastEntry();

        expect(result).to.be.null;
    });

    it('should retrieve today\'s entries', async () => {
        const mockProjects = [buildTogglProject(), buildTogglProject()];
        const mockEntries = mockProjects.flatMap(p => [
            buildTogglTimeEntry({project_id: p.id}),
            buildTogglTimeEntry({project_id: p.id})
        ])
        apiMock.getTimeEntries.resolves(mockEntries);
        apiMock.getProjects.resolves(mockProjects)

        const result = await repository.getTodayEntries();

        expect(result).to.be.an.instanceof(TimeEntryList);
        expect(result.values).to.have.lengthOf(mockEntries.length);
    });

    it('should return an empty TimeEntryList when there are no entries for today', async () => {
        apiMock.getTimeEntries.resolves([]);

        const result = await repository.getTodayEntries();

        expect(result).to.be.an.instanceof(TimeEntryList);
        expect(result.values).to.be.empty;
    });

    it('should stop a time entry successfully', async () => {
        const mockProject = buildTogglProject()
        const mockEntry = buildTogglTimeEntry({project_id: mockProject.id});
        const date = new Date();
        apiMock.updateTimeEntry.resolves(mockEntry);
        apiMock.getProjectById.resolves(mockProject);

        const result = await repository.stopEntry(mockEntry.id, date);

        sinon.assert.calledOnceWithExactly(apiMock.updateTimeEntry, mockEntry.id, {stop: date.toISOString()});
        expect(result).to.be.deep.equal(buildTimeEntry({...mockEntry, project: buildProject(mockProject)}));
    });

    it('should return null when the entry to stop doesn\'t exist', async () => {
        apiMock.updateTimeEntry.resolves();

        const result = await repository.stopEntry(1, new Date());

        expect(result).to.be.null;
    });

    it('should correctly map TogglTimeEntry to TimeEntry', () => {
        const project = buildProject()
        const togglTimeEntry = buildTogglTimeEntry()
        const timeEntry = TimeEntryRepositoryImplementation.mapToTimeEntry(togglTimeEntry, project);

        expect(timeEntry).to.be.an.instanceof(TimeEntry);
        expect(timeEntry).to.deep.equal(buildTimeEntry({...togglTimeEntry, project}))
    });

    it('should correctly map an array of TogglTimeEntry to TimeEntryList', () => {
        const projects = [buildTogglProject(), buildTogglProject()];
        const togglTimeEntries = projects.flatMap(p => [
            buildTogglTimeEntry({project_id: p.id}),
            buildTogglTimeEntry({project_id: p.id})
        ])
        const timeEntryList = TimeEntryRepositoryImplementation.mapToTimeEntryList(togglTimeEntries, projects);

        expect(timeEntryList).to.be.an.instanceof(TimeEntryList);
        expect(timeEntryList.values).to.have.lengthOf(togglTimeEntries.length);
    });


});
