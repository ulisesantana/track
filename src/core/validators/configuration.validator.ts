import {Configuration, messages} from "../index";
import {ValidationResponse, okResponse} from "./validation.response";

export const ConfigurationValidator = {
    isRequiredConfigAvailable(config: Configuration): ValidationResponse {
        const token = this.isTokenAvailable(config)
        if (token.error) return token
        const workspace = this.isWorkspaceAvailable(config)
        if (workspace) return workspace
        return okResponse
    },
    isTokenAvailable(config: Configuration): ValidationResponse {
        if (!config.apiToken) {
            return {
                error: true,
                message: messages.missingConfig.token
            }
        }

        return okResponse

    },
    isWorkspaceAvailable(config: Configuration): ValidationResponse {
        if (!config.workspaceId || config.workspaceId < 0) {
            return {
                error: true,
                message: messages.missingConfig.workspace
            }
        }

        return okResponse
    },
};
