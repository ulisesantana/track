import {input} from "@inquirer/prompts";

import {messages} from "../../core";

export function inputToken() {
    return input({message: messages.forms.token})
}
