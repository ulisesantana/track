import {expect} from "chai";

import {Configuration, ConfigurationValidator, messages, okResponse} from "../../src/core";


describe('ConfigurationValidator', () => {
    describe('isRequiredConfigAvailable', () => {
        it('should return okResponse when all required configs are available', () => {
            const config = { apiToken: '123', workspaceId: 456 };
            const response = ConfigurationValidator.isRequiredConfigAvailable(config as Configuration);
            expect(response).to.deep.equal(okResponse);
        });

        it('should return an error when apiToken is missing', () => {
            const config = { workspaceId: 456 };
            const response = ConfigurationValidator.isRequiredConfigAvailable(config as Configuration);
            expect(response.error).to.be.true;
            expect(response.message).to.equal(messages.missingConfig.token);
        });

        it('should return an error when workspaceId is missing', () => {
            const config = { apiToken: '123' };
            const response = ConfigurationValidator.isRequiredConfigAvailable(config as Configuration);
            expect(response.error).to.be.true;
            expect(response.message).to.equal(messages.missingConfig.workspace);
        });
    });

    describe('isTokenAvailable', () => {
        it('should return okResponse when apiToken is present', () => {
            const config = { apiToken: '123', workspaceId: 456 };
            const response = ConfigurationValidator.isTokenAvailable(config as Configuration);
            expect(response).to.deep.equal(okResponse);
        });

        it('should return an error when apiToken is missing', () => {
            const config = { workspaceId: 456 };
            const response = ConfigurationValidator.isTokenAvailable(config as Configuration);
            expect(response.error).to.be.true;
            expect(response.message).to.equal(messages.missingConfig.token);
        });
    });

    describe('isWorkspaceAvailable', () => {
        it('should return okResponse when workspaceId is present and valid', () => {
            const config = { apiToken: '123', workspaceId: 456 };
            const response = ConfigurationValidator.isWorkspaceAvailable(config as Configuration);
            expect(response).to.deep.equal(okResponse);
        });

        it('should return an error when workspaceId is missing', () => {
            const config = { apiToken: '123' };
            const response = ConfigurationValidator.isWorkspaceAvailable(config as Configuration);
            expect(response.error).to.be.true;
            expect(response.message).to.equal(messages.missingConfig.workspace);
        });

        it('should return an error when workspaceId is invalid', () => {
            const config = { apiToken: '123', workspaceId: -1 };
            const response = ConfigurationValidator.isWorkspaceAvailable(config as Configuration);
            expect(response.error).to.be.true;
            expect(response.message).to.equal(messages.missingConfig.workspace);
        });
    });
});
