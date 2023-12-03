
import {Nullable, TimeEntry, TimeHelper} from "../../core";
import {TimeEntryRepository} from "../repositories";
import { UseCase } from "./use-case";

type Input = undefined
type Output = Promise<Nullable<TimeEntry>>

export class StopCurrentTimeEntryUseCase implements UseCase<Input, Output>{

  constructor(private readonly timeEntryRepository: TimeEntryRepository, private readonly time = new TimeHelper()) {}

  async exec(): Output {
    const currentEntry = await this.timeEntryRepository.getCurrentEntry();
    if (currentEntry) {
      return this.timeEntryRepository.stopEntry(currentEntry.id, this.time.getCurrentUtcDate())
    }

    return null
  }
}
