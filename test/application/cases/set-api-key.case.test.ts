import sinon from 'sinon';

import {SetApiKeyUseCase} from '../../../src/application/cases'
import {ConfigurationRepository} from "../../../src/application/repositories";
import {ConfigurationRepositoryDouble} from "../../doubles";


describe('SetApiKeyUseCase', () => {
    let useCase: SetApiKeyUseCase;
    let configurationRepositoryMock: sinon.SinonStubbedInstance<ConfigurationRepository>;

    beforeEach(() => {
        configurationRepositoryMock = sinon.createStubInstance(ConfigurationRepositoryDouble);
        useCase = new SetApiKeyUseCase(configurationRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });


    it('should persist config for API key', async () => {
        const input = "user:password";

        await useCase.exec(input);

        sinon.assert.calledWith(configurationRepositoryMock.setApiKey, input);
    });

});
