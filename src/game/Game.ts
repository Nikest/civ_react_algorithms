import { System } from './system/System';
import { Civilization } from './civilization/Civilization';
import { Timer } from './Timer';

export class Game {
    system: System;
    civilization: Civilization;
    timer: Timer;
    constructor(systemSeed: number, civilizationSeed: number) {
        this.timer = new Timer(10000, 0, 0);
        this.system = new System(systemSeed);
        this.civilization = new Civilization(civilizationSeed);
        this.civilization.start();
    }
}