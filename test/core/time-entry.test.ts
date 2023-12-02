import {expect} from 'chai';
import 'mocha';

import {TimeEntry} from "../../src/core";
import {Duration} from "../../src/core/entities/duration";

describe('TimeEntry', () => {
  it('should correctly initialize a TimeEntry object', () => {
    const timeEntry = new TimeEntry({description: "Prueba de descripción", duration: new Duration(3600), id: 1, pid: 100, wid: 200});

    expect(timeEntry.id).to.equal(1);
    expect(timeEntry.pid).to.equal(100);
    expect(timeEntry.wid).to.equal(200);
    expect(timeEntry.description).to.equal("Prueba de descripción");
    expect(timeEntry.duration.value).to.equal(3600);
  });

  it('should return the correct string representation', () => {
    const timeEntry = new TimeEntry({description: "Prueba de descripción", duration: new Duration(3600), id: 1, pid: 100, wid: 200})
    let expectedStr = "01h 00m 00s - Prueba de descripción";
    expect(timeEntry.toString()).to.equal(expectedStr);

    timeEntry.duration.value = (Math.floor(Date.now() / 1000) - 3665) * -1;
    expectedStr = "01h 01m 05s - Prueba de descripción";
    expect(timeEntry.toString()).to.equal(expectedStr);
  });
});
