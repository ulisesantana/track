import {Project, ProjectNotFoundError, TimeEntry, TimeHelper, isValidId} from "../../core";
import {ProjectRepository, TimeEntryRepository} from "../repositories";
import {UseCase} from "./use-case";

type Input = {
  description: string,
  project: number | string
}
type Output = Promise<void>

export class StartTimeEntryUseCase implements UseCase<Input, Output> {

  constructor(
    private readonly timeEntryRepository: TimeEntryRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly timeHelper: TimeHelper = new TimeHelper()
  ) {}

  async exec({description, project}: Input) {
    const pid = await this.getProject(project);
    await this.timeEntryRepository.createEntry(new TimeEntry({
      description,
      project: pid
    }), this.timeHelper.getCurrentUtcDate())
  }

  private async getProject(projectKey: number | string): Promise<Project> {
    if (isValidId(projectKey)) {
      const project = await this.projectRepository.getProjectById(projectKey)
      if (project === null) {
        throw new ProjectNotFoundError(projectKey)
      }

      return project
    }

    const project = await this.projectRepository.getProjectByName(projectKey)
    if (project === null) {
      throw new ProjectNotFoundError(projectKey)
    }

    return project

  }
}
