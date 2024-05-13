import { GameObject } from '../game/GameObject';

export abstract class SpaceBody extends GameObject {
    mass: number = 0;
    radius: number = 0;
    className: string = 'SpaceBody';

    constructor(seed: number) {
        super(seed);
    }
}