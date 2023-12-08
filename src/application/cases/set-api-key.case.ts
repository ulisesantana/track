
import {ConfigurationRepository} from "../repositories";
import { UseCase } from "./use-case";

type Input = string
type Output = Promise<void>

export class SetApiTokenUseCase implements UseCase<Input, Output>{

  constructor(private readonly repository: ConfigurationRepository) {}

  async exec(apiToken: string) {
    await this.repository.setApiToken(apiToken)
  }
}
