import {Nullable, Project, ProjectNotFoundError, TimeEntry} from "../../core";
import {ProjectRepository, TimeEntryRepository} from "../repositories";
import { UseCase } from "./use-case";

type Input = undefined
type Output = Promise<Nullable<[TimeEntry, Project]>>

export class GetCurrentTimeEntryUseCase implements UseCase<Input, Output>{

  constructor(
    private readonly timeEntryRepository: TimeEntryRepository,
    private readonly projectRepository: ProjectRepository
  ) {}

  async exec(): Output {
    const currentEntry = await this.timeEntryRepository.getCurrentEntry();
    if (currentEntry) {
      const project = await this.projectRepository.getProjectById(currentEntry.pid);
      if (project === null) {
        throw new ProjectNotFoundError(currentEntry.pid)
      }

      return [currentEntry, project];
    }

    return null
  }
}
