import { expect } from 'chai';

import {isValidId} from "../../src";

describe('Id validator', () => {
  it('should validate ids with just digits', () => {
    expect(isValidId("123")).to.be.true;
    expect(isValidId("abc")).to.be.false;
    expect(isValidId("12a")).to.be.false;
  });
});
