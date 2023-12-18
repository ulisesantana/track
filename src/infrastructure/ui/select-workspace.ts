/* eslint-disable camelcase */
import {select} from "@inquirer/prompts";

import {messages} from "../../core";
import {UserInfo} from "../data-sources";

const sortByName = (a: { name: string }, b: { name: string }) =>
    a.name > b.name
        ? 1
        : a.name < b.name
            ? -1
            : 0

export async function selectWorkspace({default_workspace_id, workspaces}: UserInfo) {
    workspaces.sort(sortByName)
    const defaultWorkspace = workspaces.find(({id}) => id === default_workspace_id)!
    const choices = [defaultWorkspace, ...workspaces.filter(({id}) => id !== default_workspace_id)].map(workspace => ({
        name: workspace.name,
        value: workspace.id
    }))
    const defaultWorkspaceId = await select({
        choices,
        message: messages.forms.workspace,
    });
    return {
        id: defaultWorkspaceId,
        name: choices.find(({value}) => value === defaultWorkspaceId)?.name
    }
}
