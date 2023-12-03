import sinon from 'sinon';

import {SetDefaultTimeEntryDescriptionUseCase} from '../../../src/application/cases'
import {ConfigurationRepository} from "../../../src/application/repositories";
import {ConfigurationRepositoryDouble} from "../../doubles";


describe('SetDefaultTimeEntryDescriptionUseCase', () => {
    let useCase: SetDefaultTimeEntryDescriptionUseCase;
    let configurationRepositoryMock: sinon.SinonStubbedInstance<ConfigurationRepository>;

    beforeEach(() => {
        configurationRepositoryMock = sinon.createStubInstance(ConfigurationRepositoryDouble);
        useCase = new SetDefaultTimeEntryDescriptionUseCase(configurationRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });


    it('should persist default time entry description', async () => {
        const input = "Working on tasks";

        await useCase.exec(input);

        sinon.assert.calledWith(configurationRepositoryMock.setDefaultTimeEntry, input);
    });

});
