import {expect} from 'chai';
import sinon from 'sinon';

import {GetCurrentWeekReportUseCase} from '../../../src/application/cases'
import {TimeEntryRepository} from "../../../src/application/repositories";
import {TimeEntryList} from "../../../src/core";
import {buildProject, buildTimeEntry} from "../../builders";
import {TimeEntryRepositoryDouble} from "../../doubles";


describe('GetCurrentWeekReportUseCase', () => {
    let useCase: GetCurrentWeekReportUseCase;
    let timeEntryRepositoryMock: sinon.SinonStubbedInstance<TimeEntryRepository>;

    beforeEach(() => {
        timeEntryRepositoryMock = sinon.createStubInstance(TimeEntryRepositoryDouble);
        useCase = new GetCurrentWeekReportUseCase(timeEntryRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });


    it('should return a report', async () => {
        const projects = [
            buildProject({id: 1, name: 'Test project 1'}),
            buildProject({id: 2, name: 'Test project 2'})
        ]
        const entries = new TimeEntryList([
            buildTimeEntry({duration: 1800, project: projects.at(0)}),
            buildTimeEntry({duration: 1800, project: projects.at(0)}),
            buildTimeEntry({duration: 1800, project: projects.at(1)})
        ])
        timeEntryRepositoryMock.getCurrentWeekEntries.resolves(entries);

        const report = await useCase.exec();

        expect(report.totalDuration.value).to.be.equal(5400)
        expect(report.toString()).to.contain('01h 30m 00s')
        expect(report.toString()).to.contain(projects.at(0)?.name)
        expect(report.toString()).to.contain(projects.at(1)?.name)
    });

});

