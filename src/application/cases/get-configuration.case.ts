
import {Configuration} from "../../core";
import {ConfigurationRepository} from "../repositories";
import { UseCase } from "./use-case";

type Input = undefined
type Output = Promise<Configuration>

export class GetConfigurationUseCase implements UseCase<Input, Output>{

  constructor(private readonly repository: ConfigurationRepository) {}

  exec() {
    return this.repository.getAll()
  }
}
