import {expect} from 'chai';
import sinon from 'sinon';

import {ContinueWithLastTimeEntryUseCase} from "../../../src/application/cases";
import {TimeEntryRepository} from "../../../src/application/repositories";
import {Duration, TimeEntry, TimeHelper} from "../../../src/core";
import {buildTimeEntry} from "../../builders";
import {TimeEntryRepositoryDouble} from "../../doubles";


describe('ContinueWithLastTimeEntryUseCase', () => {
  let mockTimeEntryRepository: sinon.SinonStubbedInstance<TimeEntryRepository>;
  let mockTimeHelper: sinon.SinonStubbedInstance<TimeHelper>;
  let useCase: ContinueWithLastTimeEntryUseCase;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockTimeEntryRepository = sandbox.createStubInstance<TimeEntryRepository>(TimeEntryRepositoryDouble);
    mockTimeHelper = sandbox.createStubInstance<TimeHelper>(TimeHelper);
    useCase = new ContinueWithLastTimeEntryUseCase(mockTimeEntryRepository);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should continue with last time entry when there is a last entry', async () => {
    const lastEntry = buildTimeEntry({ description: "Test Description", duration: 60});
    const newEntry = new TimeEntry({...lastEntry, duration: new Duration(0)})
    const continueTime = new Date();
    mockTimeEntryRepository.getLastEntry.returns(Promise.resolve(lastEntry));
    mockTimeEntryRepository.createEntry.returns(Promise.resolve(newEntry));
    mockTimeHelper.getCurrentUtcDate.returns(continueTime)
    useCase = new ContinueWithLastTimeEntryUseCase(mockTimeEntryRepository,mockTimeHelper);

    const result = await useCase.exec();

    expect(result).to.equal(newEntry);
    sinon.assert.calledOnce(mockTimeEntryRepository.getLastEntry);
    sinon.assert.calledOnceWithExactly(mockTimeEntryRepository.createEntry, newEntry, continueTime);
  });

  it('should return null when there is no last entry', async () => {
    mockTimeEntryRepository.getLastEntry.returns(Promise.resolve(null));

    const result = await useCase.exec();

    expect(result).to.be.null;
    sinon.assert.calledOnce(mockTimeEntryRepository.getLastEntry);
    sinon.assert.notCalled(mockTimeEntryRepository.createEntry);
  });
});
