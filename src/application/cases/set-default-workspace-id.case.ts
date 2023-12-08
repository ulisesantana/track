import {ConfigurationRepository} from "../repositories";
import {UseCase} from "./use-case";

type Input = number
type Output = Promise<void>

export class SetDefaultWorkspaceIdUseCase implements UseCase<Input, Output> {

    constructor(private readonly repository: ConfigurationRepository) {
    }

    async exec(workspaceId: number) {
        await this.repository.setDefaultWorkspaceId(workspaceId)
    }
}
