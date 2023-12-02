import { expect } from 'chai';

import {TimeEntry, TimeEntryList} from "../../src/core";
import {Duration} from "../../src/core/entities/duration";

describe('TimeEntryList', () => {
  describe('getTotalDuration', () => {
    it('should return 0 for an empty list', () => {
      const list = new TimeEntryList([]);
      expect(list.getTotalDuration().value).to.equal(0);
    });

    it('should return the correct total duration for a single entry', () => {
      const entry = new TimeEntry({ description: 'Task 1', duration: new Duration(60), id: 1, pid: 100, wid: 200 });
      const list = new TimeEntryList([entry]);
      expect(list.getTotalDuration().value).to.equal(60);
    });

    it('should return the correct total duration for multiple entries', () => {
      const entries = [
        new TimeEntry({ description: 'Task 1', duration: new Duration(60), id: 1, pid: 100, wid: 200 }),
        new TimeEntry({ description: 'Task 2', duration: new Duration(150), id: 2, pid: 100, wid: 200 }),
      ];
      const list = new TimeEntryList(entries);
      expect(list.getTotalDuration().value).to.equal(210);
    });

    it('should handle durations with floating point numbers correctly', () => {
      const entries = [
        new TimeEntry({ description: 'Task 1', duration: new Duration(60.5), id: 1, pid: 100, wid: 200 }),
        new TimeEntry({ description: 'Task 2', duration: new Duration(59.5), id: 2, pid: 100, wid: 200 }),
      ];
      const list = new TimeEntryList(entries);
      expect(list.getTotalDuration().value).to.be.closeTo(120, 0.1);
    });
  });

  describe('groupEntriesByDescription', () => {
    it('should handle an empty list', () => {
      const list = new TimeEntryList([]);
      expect(list.groupEntriesByDescription()).to.deep.equal({});
    });

    it('should group entries correctly by description', () => {
      const entries = [
        new TimeEntry({ description: 'Task', duration: new Duration(60), id: 1, pid: 100, wid: 200 }),
        new TimeEntry({ description: 'Task', duration: new Duration(40), id: 2, pid: 100, wid: 200 }),
        new TimeEntry({ description: 'Meeting', duration: new Duration(30), id: 3, pid: 100, wid: 200 }),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();

      expect(Object.keys(grouped)).to.have.lengthOf(2);
      expect(grouped.Task.duration.value).to.equal(100);
      expect(grouped.Meeting.duration.value).to.equal(30);
    });

    it('should handle unique descriptions', () => {
      const entries = [
        new TimeEntry({ description: 'Task 1', duration: new Duration(60), id: 1, pid: 100, wid: 200 }),
        new TimeEntry({ description: 'Task 2', duration: new Duration(40), id: 2, pid: 100, wid: 200 }),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();

      expect(grouped['Task 1'].duration.value).to.equal(60);
      expect(grouped['Task 2'].duration.value).to.equal(40);
    });

    it('should handle entries with empty descriptions', () => {
      const entries = [
        new TimeEntry({ description: '', duration: new Duration(60), id: 1, pid: 100, wid: 200 }),
        new TimeEntry({ description: '', duration: new Duration(40), id: 2, pid: 100, wid: 200 }),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();
      expect(grouped[''].duration.value).to.equal(100);
    });

    it('should treat descriptions with different cases as distinct', () => {
      const entries = [
        new TimeEntry({ description: 'Task', duration: new Duration(30), id: 1, pid: 100, wid: 200 }),
        new TimeEntry({ description: 'task', duration: new Duration(70), id: 2, pid: 100, wid: 200 }),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();
      expect(grouped.Task.duration.value).to.equal(30);
      expect(grouped.task.duration.value).to.equal(70);
    });
  });
});
