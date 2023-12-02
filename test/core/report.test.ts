import {expect} from 'chai';
import 'mocha';

import {Duration, Project, Report, TimeEntry, TimeEntryList} from "../../src/core";

describe('Report', () => {
  it('should return a formatted string representation of the report', () => {
    const timeEntries = new TimeEntryList([
      new TimeEntry({ description: 'Work', duration: new Duration(3600), pid: 1, wid: 1 }),
      new TimeEntry({ description: 'Meeting', duration: new Duration(1683), pid: 2, wid: 1 })
    ]);
    const projects = { '1': new Project(1, 'Project A'), '2': new Project(2, 'Project B') };
    const report = new Report(timeEntries, projects);
    const reportString = report.toString();

    expect(reportString).to.be.equal(`01h 28m 03s
  - 01h 00m 00s - Work (Project A)
  - 00h 28m 03s - Meeting (Project B)`);
  });
});
