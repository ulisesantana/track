
import {ConfigurationRepository} from "../repositories";
import { UseCase } from "./use-case";

type Input = string
type Output = Promise<void>

export class SetApiKeyUseCase implements UseCase<Input, Output>{

  constructor(private readonly repository: ConfigurationRepository) {}

  async exec(apiKey: string) {
    this.repository.setApiKey(apiKey)
  }
}
