import {Nullable, Project} from "../../core";

export interface ProjectRepository {
  getProjectById(id: number): Promise<Nullable<Project>>;

  getProjectByName(name: string): Promise<Nullable<Project>>;

  getProjects(): Promise<Array<Project>>;
}
