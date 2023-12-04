import {Project} from "./project";

export class NullProject extends Project {

  constructor() {
    super(-1, "Unknown project")
  }
}
