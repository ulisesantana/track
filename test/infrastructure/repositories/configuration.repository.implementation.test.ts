import {expect} from 'chai';

import {Configuration} from "../../../src/core";
import {ConfigurationRepositoryImplementation} from "../../../src/infrastructure/repositories";
import {FileSystemDataSourceDouble} from "../../doubles";

describe('ConfigurationRepositoryImplementation', () => {
    const source = new FileSystemDataSourceDouble<Configuration>()
    const repository = new ConfigurationRepositoryImplementation(source)

    beforeEach(() => {
        source.clear()
    })

    it('should correctly retrieve all configuration values', () => {
        const config = {
            apiToken: 'testApiToken',
            defaultTimeEntry: 'testEntry',
            projectId: 123,
            workspaceId: 456
        }
        source.setData(config);

        const configuration = repository.getAll();

        expect(configuration).to.deep.equal(config);
    });

    it('should correctly set the API key', () => {
        const newApiToken = '09a786fg0qa78yg';
        repository.setApiToken(newApiToken);
        expect(source.db.apiToken).to.be.equal(newApiToken);
    });

    it('should correctly set the default project ID', () => {
        const id = Math.floor(Math.random() * 10**8);
        repository.setDefaultProjectId(id);
        expect(source.db.projectId).to.be.equal(id);
    });

    it('should correctly set the default time entry description', () => {
        const description = 'Working';
        repository.setDefaultTimeEntry(description);
        expect(source.db.defaultTimeEntry).to.be.equal(description);
    });

    it('should correctly set the default workspace ID', () => {
        const id = Math.floor(Math.random() * 10**8);
        repository.setDefaultWorkspaceId(id);
        expect(source.db.workspaceId).to.be.equal(id);
    });

});
