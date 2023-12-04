import {TimeHelper} from "./time-helper";

export class Duration {
    constructor(private duration: number = -1) {
    }

    private static isDuration(duration: Duration | number): duration is Duration {
        return duration instanceof Duration;
    }

    get value(): number {
        if (this.duration < 0) {
            return Math.floor(Date.now() / 1000) + this.duration;
        }

        return this.duration;
    }

    set value(duration: Duration | number) {
        this.duration = (Duration.isDuration(duration) ? duration.value : duration) as number;
    }

    add(duration: Duration | number) {
        this.duration += (Duration.isDuration(duration) ? duration.value : duration) as number
    }

    toString() {
        return `${TimeHelper.secondsToHmsString(this.value as number)}`
    }

}
