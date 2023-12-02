import {ProjectNotFoundError, TimeEntry, TimeHelper, isValidId} from "../../core";
import {TimeEntryRepository} from "../repositories";
import {ProjectRepository} from "../repositories/project.repository";
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
    const pid = await this.getProjectId(project);
    await this.timeEntryRepository.createEntry(new TimeEntry({
      description,
      pid,
      wid: this.timeEntryRepository.workspaceId,
    }), this.timeHelper.getCurrentUtcDate())
  }

  private async getProjectId(project: number | string) {
    if (isValidId(project)) {
      return project
    }

    const p = await this.projectRepository.getProjectByName(project)
    if (p === null) {
      throw new ProjectNotFoundError(project)
    }

    return p.id

  }
}
