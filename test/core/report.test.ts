import {expect} from 'chai';
import 'mocha';

import {Report, TimeEntryList} from "../../src/core";
import {buildProject, buildTimeEntry} from "../builders";

describe('Report', () => {
  it('should return a formatted string representation of the report', () => {
    const timeEntries = new TimeEntryList([
      buildTimeEntry({ description: 'Work', duration: 3600, project: buildProject({name: 'Project A'}) }),
      buildTimeEntry({ description: 'Meeting', duration: 1683, project: buildProject({name: 'Project B'}) })
    ]);
    const report = new Report(timeEntries);

    expect(report.toString()).to.be.equal(`01h 28m 03s
  - 01h 00m 00s - Work (Project A)
  - 00h 28m 03s - Meeting (Project B)`);
  });
});
