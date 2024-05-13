export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function plusArray(a: number[], b: number[]) {
    return a.map((n, i) => n + b[i]);
}

export function roundTo(number: number, digits = 2) {
    return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
}

export function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

export function formatNumberWithEnd(number: number) {
    if (number < 1000) {
        return number;
    }
    if (number < 1000000) {
        return roundTo(number / 1000) + ' k';
    }
    if (number < 1000000000) {
        return roundTo(number / 1000000) + ' mln';
    }
    return roundTo(number / 1000000000) + ' bln';
}

export function formatNumber(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export function lerpRounded(a: number, b: number, t: number, digitsLength: number = 0) {
    return parseFloat(lerp(a, b, t).toFixed(digitsLength));
}

export function numFixed(num: number, digits: number = 0) {
    return parseFloat(num.toFixed(digits));
}

export type IFrequency<T extends string>  = {
    [key in T]: number;
}

export function findInFreq<T extends string>(freq: IFrequency<T>, range: number): T {
    let current = 0;
    return Object.keys(freq).find((key) => {
        if (freq[key as T] === 0) return false;

        current += freq[key as T];
        return range <= current;
    }) as T || '' as T;
}

type MakeOptional<T> = {
    [P in keyof T]?: T[P];
};
export function createFreqAndExclude<T extends string>(fieldObj: Record<T, number>, exclude: string[]): Record<T, number> {
    const excludedObj: MakeOptional<Record<T, number>> = {};
    let sum = 0;

    Object.keys(fieldObj).forEach(key => {
        if (!exclude.includes(key)) {
            const val = fieldObj[key as T];
            sum += val;
            excludedObj[key as T] = val;
        }
    });

    Object.keys(excludedObj).forEach(key => {
        const val: number = excludedObj[key as T] as never as number;
        excludedObj[key as T] = Math.round((val / sum) * 100)
    });

    return excludedObj as Record<T, number>;
}