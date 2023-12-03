import {expect} from 'chai';
import sinon from 'sinon';

import {GetConfigurationUseCase} from '../../../src/application/cases'
import {ConfigurationRepository} from "../../../src/application/repositories";
import {defaultConfiguration} from '../../../src/core';
import {ConfigurationRepositoryDouble} from "../../doubles";


describe('GetConfigurationUseCase', () => {
    let useCase: GetConfigurationUseCase;
    let configurationRepositoryMock: sinon.SinonStubbedInstance<ConfigurationRepository>;
    beforeEach(() => {
        configurationRepositoryMock = sinon.createStubInstance(ConfigurationRepositoryDouble);
        useCase = new GetConfigurationUseCase(configurationRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });


    it('should return app config', async () => {
        configurationRepositoryMock.getAll.resolves(defaultConfiguration);

        const result = await useCase.exec();

        sinon.assert.calledOnce(configurationRepositoryMock.getAll);
        expect(result).to.be.equal(defaultConfiguration)
    });


});

