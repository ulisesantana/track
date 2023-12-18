import {TimeHelper} from "./time-helper";

export class Duration {
    constructor(private duration: number = 0) {
    }

    private static isDuration(duration: Duration | number): duration is Duration {
        return duration instanceof Duration;
    }

    get value(): number {
        return this.duration;
    }

    set value(duration: Duration | number) {
        this.duration = (Duration.isDuration(duration) ? duration.value : duration) as number;
    }

    add(duration: Duration | number) {
        this.duration += (Duration.isDuration(duration) ? duration.value : duration) as number
    }

    toString() {
        return `${TimeHelper.secondsToHmsString(this.value)}`
    }

}
