
import {Report} from "../../core";
import {TimeEntryRepository} from "../repositories";
import { UseCase } from "./use-case";

type Input = undefined
type Output = Promise<Report>

export class GetYesterdayReportUseCase implements UseCase<Input, Output>{

  constructor(private readonly repository: TimeEntryRepository) {}

  async exec() {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const entries  = await this.repository.getEntries({
      from: yesterday,
      to: today
    })
    return new Report(entries.groupEntriesByDescription())
  }
}
