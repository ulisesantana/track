import { expect } from 'chai';

import {Project, ReportEntry, TimeEntry} from "../../src/core";
import {Duration} from "../../src/core/entities/duration";

describe('ReportEntry', () => {
    it('should create a report entry with the provided project', () => {
        const timeEntry = new TimeEntry({ description: 'Work', duration: new Duration(3728), pid: 1, wid: 1 });
        const project = new Project(1, 'Test Project');
        const reportEntry = new ReportEntry(timeEntry, project);

        expect(reportEntry.toString()).to.equal('01h 02m 08s - Work (Test Project)'); // Adjust based on TimeEntry.toString() implementation
    });

    it('should create a report entry with a default project if none is provided', () => {
        const timeEntry = new TimeEntry({ description: 'Work', duration: new Duration(3728), pid: 1, wid: 1 });
        const reportEntry = new ReportEntry(timeEntry);

        expect(reportEntry.toString()).to.equal('01h 02m 08s - Work (Unknown project)'); // Adjust based on TimeEntry.toString() implementation
    });

});
