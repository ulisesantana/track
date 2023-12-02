import {Report} from "../../core";
import {ProjectRepository, TimeEntryRepository} from "../repositories";
import {UseCase} from "./use-case";

type Input = undefined
type Output = Promise<Report>

export class GetCurrentWeekReportUseCase implements UseCase<Input, Output> {

    constructor(
        private readonly timeEntryRepository: TimeEntryRepository,
        private readonly projectRepository: ProjectRepository
    ) {}

    async exec() {
        const [entries, projects] = await Promise.all([
            this.timeEntryRepository.getCurrentWeekEntries(),
            this.projectRepository.getProjects()
        ])
        return new Report(entries, projects)
    }
}
