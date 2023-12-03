import sinon from 'sinon';

import {SetDefaultWorkspaceIdUseCase} from '../../../src/application/cases'
import {ConfigurationRepository} from "../../../src/application/repositories";
import {ConfigurationRepositoryDouble} from "../../doubles";


describe('SetDefaultWorkspaceIdUseCase', () => {
    let useCase: SetDefaultWorkspaceIdUseCase;
    let configurationRepositoryMock: sinon.SinonStubbedInstance<ConfigurationRepository>;

    beforeEach(() => {
        configurationRepositoryMock = sinon.createStubInstance(ConfigurationRepositoryDouble);
        useCase = new SetDefaultWorkspaceIdUseCase(configurationRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });


    it('should persist default time entry description', async () => {
        const input = Math.floor(Math.random() * 10**16);

        await useCase.exec(input);

        sinon.assert.calledWith(configurationRepositoryMock.setDefaultWorkspaceId, input);
    });

});
