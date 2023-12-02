import { expect } from 'chai';

import {TimeHelper} from "../../src/core";

describe('TimeHelper.getWeekDates', () => {
  const th = new TimeHelper()
  // Define an array of test cases with descriptions
  const testCases = [
    {
      date: new Date(2023, 3, 24, 12), // April 24, 2023
      description: 'a given Monday',
      expectedEnd: new Date(2023, 3, 30, 12), // April 30, 2023
      expectedStart: new Date(2023, 3, 24, 12) // April 24, 2023
    },
    {
      date: new Date(2023, 3, 26, 12), // April 26, 2023
      description: 'a given Wednesday',
      expectedEnd: new Date(2023, 3, 30, 12), // April 30, 2023
      expectedStart: new Date(2023, 3, 24, 12) // April 24, 2023
    },
    {
      date: new Date(2023, 3, 30, 12), // April 30, 2023
      description: 'a given Sunday',
      expectedEnd: new Date(2023, 3, 30, 12), // April 30, 2023
      expectedStart: new Date(2023, 3, 24, 12) // April 24, 2023
    },
    {
      date: new Date(2023, 0, 1, 12), // January 1, 2023
      description: 'New Year (January 1st)',
      expectedEnd: new Date(2023, 0, 1, 12), // January 1, 2023
      expectedStart: new Date(2022, 11, 26, 12) // December 26, 2022
    }
  ];

  for (const { date, description, expectedEnd, expectedStart } of testCases) {
    it(`should return correct start and end weekday dates for ${description}`, () => {
      const [start, end] = th.getWeekDates(date);
      expect(start).to.deep.equal(expectedStart);
      expect(end).to.deep.equal(expectedEnd);
    });
  }
});
