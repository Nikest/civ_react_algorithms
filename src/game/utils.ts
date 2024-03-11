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