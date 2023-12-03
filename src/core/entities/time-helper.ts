export class TimeHelper {
  static secondsToHmsString(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${TimeHelper.addZeroPrefix(hours)}h ${TimeHelper.addZeroPrefix(minutes)}m ${TimeHelper.addZeroPrefix(remainingSeconds)}s`;
  }

  private static addZeroPrefix(number: number): string {
    return number > 9 ? number.toString() : `0${number}`;
  }

  getCurrentUtcDate(): string {
    const now = new Date();
    return now.toISOString();
  }

  getWeekDates(date: Date): [Date, Date] {
    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1

    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return [startOfWeek, endOfWeek];
  }
}
