
import {ConfigurationRepository} from "../repositories";
import { UseCase } from "./use-case";

type Input = string
type Output = Promise<void>

export class SetDefaultTimeEntryDescriptionUseCase implements UseCase<Input, Output>{

  constructor(private readonly repository: ConfigurationRepository) {}

  async exec(timeEntryDescription: string) {
    await this.repository.setDefaultTimeEntry(timeEntryDescription)
  }
}
