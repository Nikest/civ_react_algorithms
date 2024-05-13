import { Procedural } from '../Procedural';
import { generatePlanetName } from '../wordGenerator';
import { generateId } from '../utils';

export abstract class GameObject {
    id: string = '';
    seed: number = 0;
    rand: Procedural;
    name: string = '';

    constructor(seed: number) {
        this.seed = seed;
        this.rand = new Procedural(seed);
        this.name = generatePlanetName(seed);
        this.id = generateId();
    }
}