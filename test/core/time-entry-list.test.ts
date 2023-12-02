import { expect } from 'chai';

import {Duration, TimeEntryList} from '../../src/core';
import {buildTimeEntry} from "../builders";

describe('TimeEntryList', () => {
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
      expect(list.groupEntriesByDescription()).to.deep.equal({});
    });

    it('should group entries correctly by description', () => {
      const entries = [
        buildTimeEntry({ description: 'Task', duration: 60 }),
        buildTimeEntry({ description: 'Task', duration: 40 }),
        buildTimeEntry({ description: 'Meeting', duration: 30}),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();

      expect(Object.keys(grouped)).to.have.lengthOf(2);
      expect(grouped['1Task'].duration.value).to.equal(100);
      expect(grouped['1Meeting'].duration.value).to.equal(30);
    });

    it('should handle unique descriptions', () => {
      const entries = [
        buildTimeEntry({ description: 'Task 1', duration: 60 }),
        buildTimeEntry({ description: 'Task 2', duration: 40 }),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();

      expect(grouped['1Task 1'].duration.value).to.equal(60);
      expect(grouped['1Task 2'].duration.value).to.equal(40);
    });

    it('should handle entries with empty descriptions', () => {
      const entries = [
        buildTimeEntry({ description: '', duration: 60 }),
        buildTimeEntry({ description: '', duration: 40 }),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();
      expect(grouped['1'].duration.value).to.equal(100);
    });

    it('should treat descriptions with different cases as distinct', () => {
      const entries = [
        buildTimeEntry({ description: 'Task', duration: 30, pid: 1 }),
        buildTimeEntry({ description: 'task', duration: 70, pid: 1 }),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();
      expect(grouped['1Task'].duration.value).to.equal(30);
      expect(grouped['1task'].duration.value).to.equal(70);
    });

    it('should treat descriptions with different projects as distinct', () => {
      const entries = [
        buildTimeEntry({ description: 'Task', duration: 30, pid: 1 }),
        buildTimeEntry({ description: 'Task', duration: 70, pid: 2 }),
      ];
      const list = new TimeEntryList(entries);
      const grouped = list.groupEntriesByDescription();
      expect(grouped['1Task'].duration.value).to.equal(30);
      expect(grouped['2Task'].duration.value).to.equal(70);
    });
  });
});
