import {expect} from 'chai';

import {TimeEntryList} from '../../src/core';
import {buildProject, buildTimeEntry} from "../builders";


describe('TimeEntryList', () => {
  const project = buildProject({id: 1})
  describe('getTotalDuration', () => {
    it('should return 0 for an empty list', () => {
      const list = new TimeEntryList([]);
      expect(list.getTotalDuration().value).to.equal(0);
    });

    it('should return the correct total duration for a single entry', () => {
      const entry = buildTimeEntry({ duration: 60 });
      const list = new TimeEntryList([entry]);
      expect(list.getTotalDuration().value).to.equal(entry.duration.value);
    });

    it('should return the correct total duration for multiple entries', () => {
      const entries = [
        buildTimeEntry({ description: 'Task 1', duration: 60 }),
        buildTimeEntry({ description: 'Task 2', duration: 150 }),
      ];
      const list = new TimeEntryList(entries);
      expect(list.getTotalDuration().value).to.equal(210);
    });

    it('should handle durations with floating point numbers correctly', () => {
      const entries = [
          buildTimeEntry({ description: 'Task 1', duration: 60.5 }),
          buildTimeEntry({ description: 'Task 2', duration: 59.5 }),
      ];
      const list = new TimeEntryList(entries);
      expect(list.getTotalDuration().value).to.be.closeTo(120, 0.1);
    });
  });

  describe('groupEntriesByDescription', () => {
    it('should handle an empty list', () => {
      const list = new TimeEntryList([]);
      expect(list.groupEntriesByDescription()).to.deep.equal(new TimeEntryList([]));
    });

    it('should group entries correctly by description', () => {
      const entries = [
        buildTimeEntry({ description: 'Task', duration: 60, project }),
        buildTimeEntry({ description: 'Task', duration: 40, project }),
        buildTimeEntry({ description: 'Meeting', duration: 30, project}),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();

      expect(grouped.values).to.have.lengthOf(2);
      const entry1 = grouped.values.find(t => t.description === 'Task')
      expect(entry1?.duration.value).to.equal(100);
      const entry2 = grouped.values.find(t => t.description === 'Meeting')
      expect(entry2?.duration.value).to.equal(30);
    });

    it('should handle unique descriptions', () => {
      const entries = [
        buildTimeEntry({ description: 'Task 1', duration: 60, project }),
        buildTimeEntry({ description: 'Task 2', duration: 40, project }),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();

      const entry1 = grouped.values.find(t => t.description === 'Task 1')
      expect(entry1?.duration.value).to.equal(60);
      const entry2 = grouped.values.find(t => t.description === 'Task 2')
      expect(entry2?.duration.value).to.equal(40);
    });

    it('should handle entries with empty descriptions', () => {
      const entries = [
        buildTimeEntry({ description: '', duration: 60, project }),
        buildTimeEntry({ description: '', duration: 40, project }),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();
      const entry = grouped.values.find(t => t.description === '')
      expect(entry?.duration.value).to.equal(100);
    });

    it('should treat descriptions with different cases as distinct', () => {
      const entries = [
        buildTimeEntry({ description: 'Task', duration: 30, project: buildProject({id: 1}) }),
        buildTimeEntry({ description: 'task', duration: 70, project: buildProject({id: 1}) }),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();
      const entry1 = grouped.values.find(t => t.description === 'Task')
      expect(entry1?.duration.value).to.equal(30);
      const entry2 = grouped.values.find(t => t.description === 'task')
      expect(entry2?.duration.value).to.equal(70);
    });

    it('should treat descriptions with different projects as distinct', () => {
      const entries = [
        buildTimeEntry({ description: 'Task', duration: 30, project: buildProject({id:1}) }),
        buildTimeEntry({ description: 'Task', duration: 70, project: buildProject({id:2}) }),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();
      const entry1 = grouped.values.find(t => t.description === 'Task' && t.project.id === 1)
      expect(entry1?.duration.value).to.equal(30);
      const entry2 = grouped.values.find(t => t.description === 'Task' && t.project.id === 2)
      expect(entry2?.duration.value).to.equal(70);
    });
  });
});
