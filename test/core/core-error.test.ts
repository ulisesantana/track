import { expect } from 'chai';

import {CoreError, ErrorCodes} from "../../src/core";

class TestError extends CoreError {
    readonly code = ErrorCodes.ProjectNotFound;

    constructor(message: string) {
        super(message);
    }
}

describe('CoreError', () => {
    it('should correctly initialize with a message and code', () => {
        const testError = new TestError('Test message');
        expect(testError.message).to.equal('Test message');
        expect(testError.code).to.equal(ErrorCodes.ProjectNotFound);
    });

    it('should correctly identify an instance of CoreError', () => {
        const testError = new TestError('Test message');
        expect(CoreError.isError(testError)).to.be.true;
    });

    it('should return false for non-object types', () => {
        expect(CoreError.isError('just a string')).to.be.false;
        expect(CoreError.isError(123)).to.be.false;
        expect(CoreError.isError(null)).to.be.false;
    });

});
