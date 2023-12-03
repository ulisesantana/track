import {Project} from "../../src/core";

export function buildProject({id, name}: Partial<Project> = {}): Project {
    return new Project(id || Math.floor(Math.random() * 10**16), name || 'Irrelevant Project')
}
