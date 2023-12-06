import {ProjectRepository} from "../../application/repositories";
import {NullProject, Nullable, Project} from "../../core";
import {TogglApi} from "../data-sources";
import {TogglProject} from "../types";

export class ProjectRepositoryImplementation implements ProjectRepository {
    constructor(private readonly api: TogglApi) {}

    static mapToProject(project: Nullable<TogglProject>): Project {
        return project
            ? new Project(project.id, project.name)
            : new NullProject()
    }

    async getProjectById(id: number): Promise<Project> {
        const project = await this.api.getProjectById(id)
        return ProjectRepositoryImplementation.mapToProject(project)
    }

    async getProjectByName(name: string): Promise<Project> {
        const projects = await this.api.getProjects()
        const project = projects.find(p => p.name === name) || null
        return ProjectRepositoryImplementation.mapToProject(project)
    }

    async getProjects(): Promise<Array<Project>> {
        const projects = await this.api.getProjects()
        return projects.map((project) => ProjectRepositoryImplementation.mapToProject(project))
    }
}
