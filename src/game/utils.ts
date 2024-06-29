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

export function easeOutQuad(a: number, b: number, t: number): number {
    return a + (b - a) * (1 - (1 - t) * (1 - t));
}

export function easeOutQuadRounded(a: number, b: number, t: number, digitsLength: number = 0) {
    return parseFloat(easeOutQuad(a, b, t).toFixed(digitsLength));
}

export function easeInOutCirc(a: number, b: number, t: number) {
    if (t < 0.5) {
        return a + (b - a) * (1 - Math.sqrt(1 - 2 * t * 2 * t)) / 2;
    } else {
        return a + (b - a) * (Math.sqrt(1 - (2 - 2 * t) * (2 - 2 * t)) + 1) / 2;
    }
}

export function easeInOutSine(a: number, b: number, t: number) {
    return a + (b - a) * (0.5 - 0.5 * Math.cos(Math.PI * t));
}

export function easeInOutSineRounded(a: number, b: number, t: number, digitsLength: number = 0) {
    return parseFloat(easeInOutSine(a, b, t).toFixed(digitsLength));
}

export function numFixed(num: number, digits: number = 0) {
    return parseFloat(num.toFixed(digits));
}

export function easeInExpo(a: number, b: number, t: number) {
    return a + (b - a) * (t === 0 ? 0 : Math.pow(2, 10 * (t - 1)));
}

export function easeInExpoRounded(a: number, b: number, t: number, digitsLength: number = 0) {
    return parseFloat(easeInExpo(a, b, t).toFixed(digitsLength));
}

export const createHash = (): string => Math.random().toString(36).substring(7);

export type IFrequency<T extends string> = Record<T, number>;
export type IFrequencyEx<T extends string> = Record<T, boolean>;

export function calculateInFrequency<T extends string>(frequencies: IFrequency<T>, select: number, excludes: T[] = []): T {
    const freqFiltered = {} as IFrequency<T>;
    //const excludes = Object.keys(excludesFreq).filter((ef) => excludesFreq[ef as T]) as T[];

    Object.keys(frequencies).filter(f => !excludes.includes(f as T)).forEach(f => freqFiltered[f as T] = frequencies[f as T]);
    const freqNumbers: number[] = Object.values(freqFiltered);
    const totalFreq = freqNumbers.reduce((sum, f) => sum + f, 0);

    Object.keys(freqFiltered).forEach((key, f) => {
        freqFiltered[key as T] = (freqFiltered[key as T] / totalFreq) * 100;
    });

    let cumulativeFrequency = 0;
    for (let [key, f] of Object.entries(freqFiltered)) {
        cumulativeFrequency += f as number;
        if (select <= cumulativeFrequency) return key as T;
    }

    return '' as T;
}

interface IInfoPopup {
    title: string;
    message: string;
    actions?: Array<{ text: string, function: () => void }>
}

export const InfoPopupInterface = (detail: IInfoPopup) => {
    window.dispatchEvent(new CustomEvent('infoPopup', { detail }));
}

export async function asyncForEach<T>(array: T[], callback: (item: T, index: number, array: unknown[]) => void) {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i], i, array);
    }

    return true;
}