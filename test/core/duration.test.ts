import {expect} from 'chai';

import {Duration} from "../../src/core";

describe('Duration', () => {
    it('should initialize with the default duration if no value is provided', () => {
        const duration = new Duration();
        expect(duration.value).to.be.closeTo(Date.now() / 1000, 2);
    });

    it('should initialize with the provided value', () => {
        const duration = new Duration(3600);
        expect(duration.value).to.equal(3600);
    });

    it('should allow getting and setting the duration value', () => {
        const duration = new Duration();
        duration.value = 1800;
        expect(duration.value).to.equal(1800);

        duration.value = new Duration(7200);
        expect(duration.value).to.equal(7200);
    });

    it('should add a number to the duration', () => {
        const duration = new Duration(3600);
        duration.add(1800);
        expect(duration.value).to.equal(5400);
    });

    it('should add another duration instance to the duration', () => {
        const duration = new Duration(3600);
        const additionalDuration = new Duration(1800);
        duration.add(additionalDuration);
        expect(duration.value).to.equal(5400);
    });

    it('should return the correct string representation of the duration', () => {
        const duration = new Duration(3661); // 1 hour, 1 minute, 1 second
        expect(duration.toString()).to.equal('01h 01m 01s');
    });

    it('should handle negative durations correctly', () => {
        const duration = new Duration(-100);
        expect(duration.value).to.be.closeTo(Date.now() / 1000, 101);
    });

});
