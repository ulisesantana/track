import {expect} from 'chai';
import sinon from 'sinon';

import {GetCurrentWeekReportUseCase} from '../../../src/application/cases'
import {ProjectRepository, TimeEntryRepository} from "../../../src/application/repositories";
import {Project, TimeEntryList} from "../../../src/core";
import {buildTimeEntry} from "../../builders";
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


    it('should return a report', async () => {
        const projects = [
            new Project(1, 'Test project 1'),
            new Project(2, 'Test project 2')
        ]
        const entries = new TimeEntryList([
            buildTimeEntry({duration: 1800, pid: projects.at(0)?.id}),
            buildTimeEntry({duration: 1800, pid: projects.at(0)?.id}),
            buildTimeEntry({duration: 1800, pid: projects.at(1)?.id})
        ])
        timeEntryRepositoryMock.getCurrentWeekEntries.resolves(entries);
        projectRepositoryMock.getProjectsDictionary.resolves(Object.fromEntries(projects.map((p) => [p.id, p])));

        const report = await useCase.exec();

        expect(report.totalDuration.value).to.be.equal(5400)
        expect(report.toString()).to.contain('01h 30m 00s')
        expect(report.toString()).to.contain(projects.at(0)?.name)
        expect(report.toString()).to.contain(projects.at(1)?.name)
    });

});

