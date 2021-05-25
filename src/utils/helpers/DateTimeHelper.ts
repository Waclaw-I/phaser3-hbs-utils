
export class DateTimeHelper {

    public static getUnixTimestamp(): number {
        const currentDate = new Date();
        return Math.floor(currentDate.getTime() / 1000);
    }

    public static msToTime(timeMS: number): string {
        const pad = (n) => {
            const z = 2;
            return (`00${n}`).slice(-z);
        };
        let time = timeMS;
        let days: number = 0;

        const ms = time % 1000;
        time = (time - ms) / 1000;
        const secs = time % 60;
        time = (time - secs) / 60;
        const mins = time % 60;
        let hrs: number = (time - mins) / 60;
        if (hrs > 24) {
            days = Math.round(hrs / 24);
            hrs = hrs % 24;
            return `${pad(days)}:${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
        }
        if (hrs === 0) {
            return `${pad(mins)}:${pad(secs)}`;
        }
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }

    public static getFormattedDate(date: Date): string {
        const hours = date.getHours();
        const minutes = `0${date.getMinutes()}`;
        const seconds = `0${date.getSeconds()}`;

        return `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
    }
}
