import {ProjectRepository} from "../../application/repositories";
import {NullProject, Nullable, Project} from "../../core";
import {TogglDataSource} from "../data-sources";
import {TogglProject} from "../types";

export class ProjectRepositoryImplementation implements ProjectRepository {
    constructor(private readonly api: TogglDataSource) {}

    private static mapToProject(project: Nullable<TogglProject>): Project {
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
        const project = projects.find(p => p.name === name)
        return project
            ? ProjectRepositoryImplementation.mapToProject(project)
            : new NullProject()
    }

    async getProjects(): Promise<Array<Project>> {
        const projects = await this.api.getProjects()
        return projects.map((project) => ProjectRepositoryImplementation.mapToProject(project))
    }
}
