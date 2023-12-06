import sinon from 'sinon';

import {SetApiTokenUseCase} from '../../../src/application/cases'
import {ConfigurationRepository} from "../../../src/application/repositories";
import {ConfigurationRepositoryDouble} from "../../doubles";


describe('SetApiTokenUseCase', () => {
    let useCase: SetApiTokenUseCase;
    let configurationRepositoryMock: sinon.SinonStubbedInstance<ConfigurationRepository>;

    beforeEach(() => {
        configurationRepositoryMock = sinon.createStubInstance(ConfigurationRepositoryDouble);
        useCase = new SetApiTokenUseCase(configurationRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });


    it('should persist config for API key', async () => {
        const input = "user:password";

        await useCase.exec(input);

        sinon.assert.calledWith(configurationRepositoryMock.setApiToken, input);
    });

});
