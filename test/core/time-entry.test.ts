import {expect} from 'chai';
import 'mocha';

import {Duration, TimeEntry} from "../../src/core";
import {buildProject} from "../builders";

describe('TimeEntry', () => {
  const project = buildProject({name: 'Irrelevant Project'})
  it('should correctly initialize a TimeEntry object', () => {
    const timeEntry = new TimeEntry({description: "Prueba de descripción", duration: new Duration(3600), id: 1, project});

    expect(timeEntry.id).to.equal(1);
    expect(timeEntry.project).to.equal(project);
    expect(timeEntry.description).to.equal("Prueba de descripción");
    expect(timeEntry.duration.value).to.equal(3600);
  });

  it('should return the correct string representation', () => {
    const timeEntry = new TimeEntry({description: "Prueba de descripción", duration: new Duration(3600), id: 1, project})
    expect(timeEntry.toString()).to.equal(`01h 00m 00s - ${timeEntry.description} (${project.name})`);
  });
});
