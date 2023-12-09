import MockAdapter from "axios-mock-adapter";

import {http} from "../dist/infrastructure/data-sources/http";

export default new MockAdapter(http);
