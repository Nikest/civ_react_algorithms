import { GameObject } from '../game/GameObject';

export abstract class SpaceBody extends GameObject {
    mass: number = 0;
    radius: number = 0;
    className: string = 'SpaceBody';
    orbitRadius: number = 0;
    orbitVelocity: number = 0;
    orbitAngularVelocity: number = 0;
    orbitalPeriod: number = 0;

    constructor(seed: number, orbitRadius: number = 0, orbitVelocity: number = 0, orbitalPeriod: number = 0) {
        super(seed);

        this.orbitRadius = orbitRadius;
    }
}