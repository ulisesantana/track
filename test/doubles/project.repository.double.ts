import {ProjectRepository} from "../../src/application/repositories";
import {Nullable, Project} from "../../src/core";
import {buildProject} from "../builders";

export class ProjectRepositoryDouble implements ProjectRepository {

  async getProjectById(id: number): Promise<Nullable<Project>> {
    return new Project(id, "Dummy project");
  }

  async getProjectByName(name: string): Promise<Nullable<Project>> {
    return new Project(123, name);
  }

  async getProjects() {
    return [buildProject()];
  }

}
