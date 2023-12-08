
import {ConfigurationRepository} from "../repositories";
import { UseCase } from "./use-case";

type Input = number
type Output = Promise<void>

export class SetDefaultProjectUseCase implements UseCase<Input, Output>{

  constructor(private readonly repository: ConfigurationRepository) {}

  async exec(projectId: number) {
    await this.repository.setDefaultProjectId(projectId)
  }
}
