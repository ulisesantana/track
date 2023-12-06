import { expect } from 'chai';

import {NullProject} from "../../src/core";

describe('NullProject', () => {
    it('should initialize with default values', () => {
        const nullProject = new NullProject();

        expect(nullProject).to.be.an.instanceof(NullProject);
        expect(nullProject.id).to.equal(-1);
        expect(nullProject.name).to.equal('Unknown project');
    });
});
