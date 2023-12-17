import {expect} from 'chai';
import sinon from 'sinon';

import {GetYesterdayReportUseCase} from '../../../src/application/cases'
import {TimeEntryRepository} from "../../../src/application/repositories";
import {TimeEntryList} from '../../../src/core';
import {buildProject, buildTimeEntry} from "../../builders";
import {TimeEntryRepositoryDouble} from "../../doubles";


describe('GetYesterdayReportUseCase', () => {
    let useCase: GetYesterdayReportUseCase;
    let timeEntryRepositoryMock: sinon.SinonStubbedInstance<TimeEntryRepository>;

    beforeEach(() => {
        timeEntryRepositoryMock = sinon.createStubInstance(TimeEntryRepositoryDouble);
        useCase = new GetYesterdayReportUseCase(timeEntryRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return a report with entries from yesterday', async () => {
        const today = new Date ()
        const yesterday = new Date (today)
        yesterday.setDate(today.getDate() - 1)
        const project = buildProject()
        const entries = new TimeEntryList([buildTimeEntry({project}), buildTimeEntry({project})])
        timeEntryRepositoryMock.getEntries.resolves(entries);

        const report  = await useCase.exec();

        const [calledWithArgs] = timeEntryRepositoryMock.getEntries.getCall(0).args;
        expect(calledWithArgs!.from!.getDate()).to.equal(yesterday.getDate());
        expect(calledWithArgs!.to!.getDate()).to.deep.equal(today.getDate());
        expect(report.toString()).to.be.equal(`01h 00m 00s
  - 01h 00m 00s - Test entry (Irrelevant Project)`
        )
    });


});
