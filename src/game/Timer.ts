export class Timer {
    interval: any;
    isStopped = true;
    monthNumber = 0;

    timeDate: Date;
    timeDateStart: Date;
    updateEveryMS: number;
    timeIntervalMs: number;

    callbackAfterTime: Map<number, () => void> = new Map(); // number is time in ms

    constructor(year: number, month: number, day: number) {
        this.isStopped = true;
        this.timeDate = new Date(year, month, day);
        this.timeDateStart = new Date(year, month, day);
        this.updateEveryMS = 10;
        this.timeIntervalMs = 60000 * 60;

        window.addEventListener('timeRun', () => {
            this.run();
        });
        window.addEventListener('timeStop', () => {
            this.stop();
        });
    }

    setCallbackAfterTime(time: number, callback: () => void) {
        this.callbackAfterTime.set(this.timeDate.getTime() + Math.floor(time), callback);
    }

    checkCallbackAfterTime() {
        const time = this.timeDate.getTime();
        this.callbackAfterTime.forEach((callback, key) => {
            if (time >= key) {
                callback();
                this.callbackAfterTime.delete(key);
            } else {
                return;
            }
        });
    }

    elapsedTimeInSeconds() {
        return (this.timeDate.getTime() - this.timeDateStart.getTime()) / 1000;
    }

    timePlus() {
        this.timeIntervalMs *= 2;
        window.dispatchEvent(new CustomEvent('ui:timeSpeedUpdate'));
    }

    timeMinus() {
        this.timeIntervalMs /= 2;
        window.dispatchEvent(new CustomEvent('ui:timeSpeedUpdate'));
    }

    newMonth() {
        window.dispatchEvent(new CustomEvent('timer:UpdateMonth'));
    }

    update() {
        const currentMonth = this.timeDate.getMonth();
        if (currentMonth !== this.monthNumber) {
            this.newMonth();
            this.monthNumber = currentMonth;
        }

        this.timeDate.setTime(this.timeDate.getTime() + this.timeIntervalMs);

        this.checkCallbackAfterTime();

        this.interval = setTimeout(() => {
            this.update();
        }, this.updateEveryMS);
    }

    run() {
        this.isStopped = false;
        this.update();
    }

    stop() {
        this.isStopped = true;
        clearInterval(this.interval);
    }

    formatDuration() {
        const seconds = (this.timeIntervalMs * 100) / Timer.durationInMs().second;
        const minutes = (this.timeIntervalMs * 100) / Timer.durationInMs().minute;
        const hours = (this.timeIntervalMs * 100) / Timer.durationInMs().hour;
        const days = (this.timeIntervalMs * 100) / Timer.durationInMs().day;
        const months = (this.timeIntervalMs * 100) / Timer.durationInMs().month;
        const years = (this.timeIntervalMs * 100) / Timer.durationInMs().year;

        if (years >= 1) {
            return `${Math.floor(years)} year(s)`;
        } else if (months >= 1) {
            return `${Math.floor(months)} month(s)`;
        } else if (days >= 1) {
            return `${Math.floor(days)} day(s)`;
        } else if (hours >= 1) {
            return `${Math.floor(hours)} hour(s)`;
        } else if (minutes >= 1) {
            return `${Math.floor(minutes)} minute(s)`;
        } else {
            return `${Math.floor(seconds)} second(s)`;
        }
    }

    static durationInMs() {
        return {
            second: 1000,
            minute: 60000,
            hour: 3600000,
            day: 86400000,
            month: 2592000000,
            year: 31536000000,
        }
    }

    static now() {
        return window.game.timer.timeDate.getTime();
    }
}