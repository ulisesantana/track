import {expect} from 'chai';
import sinon from 'sinon';

import {GetTodayReportUseCase} from '../../../src/application/cases'
import {TimeEntryRepository} from "../../../src/application/repositories";
import {Project, TimeEntryList} from '../../../src/core';
import {buildTimeEntry} from "../../builders";
import {TimeEntryRepositoryDouble} from "../../doubles";


describe('GetTodayReportUseCase', () => {
    let useCase: GetTodayReportUseCase;
    let timeEntryRepositoryMock: sinon.SinonStubbedInstance<TimeEntryRepository>;

    beforeEach(() => {
        timeEntryRepositoryMock = sinon.createStubInstance(TimeEntryRepositoryDouble);
        useCase = new GetTodayReportUseCase(timeEntryRepositoryMock);
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
            buildTimeEntry({duration: 1800, project: projects.at(0)}),
            buildTimeEntry({duration: 1800, project: projects.at(0)}),
            buildTimeEntry({duration: 1800, project: projects.at(1)})
        ])
        timeEntryRepositoryMock.getTodayEntries.resolves(entries);

        const report = await useCase.exec();

        expect(report.totalDuration.value).to.be.equal(5400)
        expect(report.toString()).to.contain('01h 30m 00s')
        expect(report.toString()).to.contain(projects.at(0)?.name)
        expect(report.toString()).to.contain(projects.at(1)?.name)
    });

});
