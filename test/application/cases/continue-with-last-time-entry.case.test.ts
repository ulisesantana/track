import {expect} from 'chai';
import sinon from 'sinon';

import {ContinueWithLastTimeEntryUseCase} from "../../../src/application/cases";
import {TimeEntryRepository} from "../../../src/application/repositories";
import {Duration, TimeEntry, TimeHelper} from "../../../src/core";
import {TimeEntryRepositoryDouble} from "../../doubles";


describe('ContinueWithLastTimeEntryUseCase', () => {
  let mockTimeEntryRepository: sinon.SinonStubbedInstance<TimeEntryRepository>;
  let useCase: ContinueWithLastTimeEntryUseCase;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockTimeEntryRepository = sandbox.createStubInstance<TimeEntryRepository>(TimeEntryRepositoryDouble);
    useCase = new ContinueWithLastTimeEntryUseCase(mockTimeEntryRepository as unknown as TimeEntryRepository, new TimeHelper());
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should continue with last time entry when there is a last entry', async () => {
    const lastEntry = new TimeEntry({ description: "Test Description", duration: new Duration(60), id: 1, pid: 456, wid: 123 });
    const newEntry = new TimeEntry({...lastEntry, duration: new Duration(-1)})
    mockTimeEntryRepository.getLastEntry.returns(Promise.resolve(lastEntry));
    mockTimeEntryRepository.createEntry.returns(Promise.resolve(newEntry));

    const result = await useCase.exec();

    expect(result).to.equal(newEntry);
    sinon.assert.calledOnce(mockTimeEntryRepository.getLastEntry);
    sinon.assert.calledOnceWithExactly(mockTimeEntryRepository.createEntry, newEntry, sinon.match.string);
  });

  it('should return null when there is no last entry', async () => {
    mockTimeEntryRepository.getLastEntry.returns(Promise.resolve(null));

    const result = await useCase.exec();

    expect(result).to.be.null;
    sinon.assert.calledOnce(mockTimeEntryRepository.getLastEntry);
    sinon.assert.notCalled(mockTimeEntryRepository.createEntry);
  });
});
