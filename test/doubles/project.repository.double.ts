import {ProjectRepository} from "../../src/application/repositories";
import {Nullable, Project} from "../../src/core";

export class ProjectRepositoryDouble implements ProjectRepository {
  workspaceId = 456

  async getProjectById(id: number): Promise<Nullable<Project>> {
    return new Project(id, "Dummy project");
  }

  async getProjectByName(name: string): Promise<Nullable<Project>> {
    return new Project(123, name);
  }

  async getProjectsDictionary(): Promise<Record<number, Project>> {
    return {123: new Project(123, "Dummy project")};
  }

}
