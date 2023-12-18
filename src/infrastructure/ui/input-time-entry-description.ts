import {input} from "@inquirer/prompts";

import {messages} from "../../core";

export function inputTimeEntryDescription(message = messages.forms.description.message) {
    return input({
        default: messages.forms.description.default,
        message,
        validate: Boolean
    });
}
