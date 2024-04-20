export class Procedural {
    seed: number;
    rand: any;
    constructor(seed: number) {
        this.seed = Math.floor(Math.random() * (1000000 - 1 + 1) + 1);
        // @ts-ignore
        this.rand = new Math.seedrandom(seed);
    }
    setSeed(seed: number) {
        // @ts-ignore
        this.rand = new Math.seedrandom(seed);
    }
    randomInt(min: number, max: number) {
        return Math.floor(this.rand() * (max - min + 1) + min);
    }
    randomFloat(min: number, max: number) {
        return this.rand() * (max - min) + min;
    }
    randomBool() {
        return this.rand() < 0.5;
    }
    randomFromArray(array: any[]) {
        return array[this.randomInt(0, array.length - 1)];
    }
    randomFromObject(object: any) {
        return object[this.randomFromArray(Object.keys(object))];
    }
}