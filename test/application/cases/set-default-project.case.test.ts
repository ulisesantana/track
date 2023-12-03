import sinon from 'sinon';

import {SetDefaultProjectUseCase} from '../../../src/application/cases'
import {ConfigurationRepository} from "../../../src/application/repositories";
import {ConfigurationRepositoryDouble} from "../../doubles";


describe('SetDefaultProjectUseCase', () => {
    let useCase: SetDefaultProjectUseCase;
    let configurationRepositoryMock: sinon.SinonStubbedInstance<ConfigurationRepository>;

    beforeEach(() => {
        configurationRepositoryMock = sinon.createStubInstance(ConfigurationRepositoryDouble);
        useCase = new SetDefaultProjectUseCase(configurationRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });


    it('should persist default project id for new time entries', async () => {
        const input = Math.random() * 10**16;

        await useCase.exec(input);

        sinon.assert.calledWith(configurationRepositoryMock.setDefaultProjectId, input);
    });

});
