import {Report} from "../../core";
import {TimeEntryRepository} from "../repositories";
import {UseCase} from "./use-case";

type Input = undefined
type Output = Promise<Report>

export class GetCurrentWeekReportUseCase implements UseCase<Input, Output> {

    constructor(
        private readonly timeEntryRepository: TimeEntryRepository
    ) {}

    async exec() {
        const entries = await this.timeEntryRepository.getCurrentWeekEntries()
        return new Report(entries.groupEntriesByDescription())
    }
}
