#!/usr/bin/env node
import * as readline from 'node:readline/promises'
import * as fs from 'node:fs/promises'
import {stdin as input, stdout as output} from 'node:process'
import {EOL} from 'node:os'

const rl = readline.createInterface({ input, output })
await createUseCase(rl, fs)
rl.close()

async function createUseCase(rl, fs) {
  const answer = await rl.question('What is your new use case?\n')
  const useCase = answer.replaceAll(" ", "-")
  const useCasePath = `src/application/cases/${useCase}.case.ts`
  const useCaseClass = generateUseCase(useCase)
  const useCaseTestPath = `test/application/cases/${useCase}.case.test.ts`
  const useCaseTest = generateUseCaseTest(useCase)
  await Promise.all([
    fs.writeFile(useCasePath, useCaseClass),
    fs.writeFile(useCaseTestPath, useCaseTest),
    updateFile(fs, 'src/application/cases/index.ts', `export * from "./${useCase}.case"`)
  ])
  console.log(`Use case "${answer}" created at ${useCasePath}.`)
}

async function updateFile(fs, path, update) {
  const file = await fs.readFile(path)
  const imports = file.toString().split(EOL).filter(Boolean).concat(update).sort().join(EOL)
  await fs.writeFile(path, imports)
}

function pascalize(useCase) {
  return useCase
      .split("-")
      .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
      .join("");
}

function generateUseCase(useCase) {
  const pascalizedUseCase = `${pascalize(useCase)}UseCase`
  return `
import { UseCase } from "./use-case";

type Input = undefined
type Output = Promise<null>

export class ${pascalizedUseCase} implements UseCase<Input, Output>{

  constructor() {}

  async exec() {
    return null
  }
}`
}
function generateUseCaseTest(useCase) {
  const pascalizedUseCase = `${pascalize(useCase)}UseCase`
  return `
import {expect} from 'chai';
import sinon from 'sinon';

import {${pascalizedUseCase}} from '../../../src/application/cases'
import {ProjectRepository, TimeEntryRepository} from "../../../src/application/repositories";
import {TimeHelper} from '../../../src/core';
import {ProjectRepositoryDouble, TimeEntryRepositoryDouble} from "../../doubles";


describe('${pascalizedUseCase}', () => {
    let useCase: ${pascalizedUseCase};
    let timeEntryRepositoryMock: sinon.SinonStubbedInstance<TimeEntryRepository>;
    let projectRepositoryMock: sinon.SinonStubbedInstance<ProjectRepository>;
    let timeHelperMock: sinon.SinonStubbedInstance<TimeHelper>;

    beforeEach(() => {
        timeEntryRepositoryMock = sinon.createStubInstance(TimeEntryRepositoryDouble);
        projectRepositoryMock = sinon.createStubInstance(ProjectRepositoryDouble);
        timeHelperMock = sinon.createStubInstance(TimeHelper);
        useCase = new ${pascalizedUseCase}(timeEntryRepositoryMock, projectRepositoryMock, timeHelperMock);
    });

    afterEach(() => {
        sinon.restore();
    });


    it('should do something successfully', async () => {
        const input = {description: 'Test Task', project: 123};
        timeEntryRepositoryMock.createEntry.resolves();
        projectRepositoryMock.getProjectByName.resolves(null); 

        await useCase.exec(input);

        sinon.assert.calledWith(timeEntryRepositoryMock.createEntry, sinon.match.has('pid', 123));
    });

    it('should throw an error for any reason', async () => {
        const input = {description: 'Test Task', project: 'Unknown Project'};
        projectRepositoryMock.getProjectByName.resolves(null);

        try {
            await useCase.exec(input);
            expect.fail('should have thrown an error');
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
        }
    });

});

}`
}
