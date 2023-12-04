import {expect} from 'chai';
import sinon from 'sinon';

import {Configuration} from "../../../src/core";
import {ConfigDataSource} from "../../../src/infrastructure/data-sources";
import {ConfigurationRepositoryImplementation} from "../../../src/infrastructure/repositories";

describe('ConfigurationRepositoryImplementation', () => {
    let repository: ConfigurationRepositoryImplementation;
    let configDataSourceMock: sinon.SinonStubbedInstance<ConfigDataSource>;
    let config: Configuration;

    beforeEach(() => {
        config = {} as Configuration; // Mock configuration object
        configDataSourceMock = sinon.createStubInstance(ConfigDataSource, {
            // @ts-expect-error is a test mock
            get: sinon.stub().callsFake((key) => config[key]),
            // @ts-expect-error is a test mock
            set: sinon.stub().callsFake((key, value) => {
                // @ts-expect-error is a test mock
                config[key] = value;
            }),
        });
        repository = new ConfigurationRepositoryImplementation(configDataSourceMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should correctly retrieve all configuration values', () => {
        config = {
            apiKey: 'testApiKey',
            defaultTimeEntry: 'testEntry',
            projectId: 123,
            workspaceId: 456
        };

        const configuration = repository.getAll();

        expect(configuration).to.deep.equal(config);
        expect(configDataSourceMock.get.calledWith('apiKey')).to.be.true;
        expect(configDataSourceMock.get.calledWith('defaultTimeEntry')).to.be.true;
        expect(configDataSourceMock.get.calledWith('projectId')).to.be.true;
        expect(configDataSourceMock.get.calledWith('workspaceId')).to.be.true;
    });

    it('should correctly set the API key', () => {
        repository.setApiKey('newApiKey');
        expect(configDataSourceMock.set.calledWith('apiKey', 'newApiKey')).to.be.true;
    });

    it('should correctly set the default project ID', () => {
        repository.setDefaultProjectId(789);
        expect(configDataSourceMock.set.calledWith('projectId', 789)).to.be.true;
    });

    it('should correctly set the default time entry description', () => {
        repository.setDefaultTimeEntry('newEntry');
        expect(configDataSourceMock.set.calledWith('defaultTimeEntry', 'newEntry')).to.be.true;
    });

    it('should correctly set the default workspace ID', () => {
        repository.setDefaultWorkspaceId(1012);
        expect(configDataSourceMock.set.calledWith('workspaceId', 1012)).to.be.true;
    });

});
