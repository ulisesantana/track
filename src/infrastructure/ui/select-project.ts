import {select} from "@inquirer/prompts";

import {messages} from "../../core";
import {UserInfo} from "../data-sources";

const sortByName = (a: { name: string }, b: { name: string }) =>
    a.name > b.name
        ? 1
        : a.name < b.name
            ? -1
            : 0
export async function selectProject({clients, projects}: UserInfo, message = messages.forms.project) {
    const clientMap = new Map(clients.map(client => [client.id, client]))
    const choices = projects
        .filter(({active}) => active)
        .sort(sortByName)
        .map(project => ({
            name: `${project.name} (${clientMap.get(project.client_id)?.name || 'No client'})`,
            value: project.id
        }))
    const defaultProjectId = await select({
        choices,
        message,
    });
    return {
        id: defaultProjectId,
        name: choices.find(({value}) => value === defaultProjectId)?.name
    }
}
