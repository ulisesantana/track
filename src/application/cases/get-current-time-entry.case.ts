import {Nullable, TimeEntry} from "../../core";
import {TimeEntryRepository} from "../repositories";
import {UseCase} from "./use-case";

type Input = undefined
type Output = Promise<Nullable<TimeEntry>>

export class GetCurrentTimeEntryUseCase implements UseCase<Input, Output>{

  constructor(
    private readonly timeEntryRepository: TimeEntryRepository
  ) {}

  exec(): Output {
    return this.timeEntryRepository.getCurrentEntry();
  }
}
