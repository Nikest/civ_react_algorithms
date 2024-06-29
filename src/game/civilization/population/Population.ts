import { Procedural } from '../../Procedural';
import { Timer } from '../../Timer';
import * as utils from '../../utils';
import { SubPopulation } from './SubPopulation';

export interface ICurrentState {
    children: number;
    adults: number;
    elders: number;
    totalPopulation: number;
}

export class Population {
    seed: number;
    rand: Procedural;
    id: string;

    subPopulationsIds: Set<string> = new Set();

    lastCurrentState: ICurrentState = {
        children: 0,
        adults: 0,
        elders: 0,
        totalPopulation: 0,
    }

    constructor(seed: number, startedChildren: number, startedAdults: number, startedElders: number) {
        this.seed = seed;
        this.rand = new Procedural(seed);
        this.id = utils.generateId();

        const newSubPopulation = new SubPopulation(this.id, startedChildren, startedAdults, startedElders);

        this.subPopulationsIds.add(newSubPopulation.id);

        window.game.civilization.addSubPopulation(newSubPopulation);
    }

    getLastCurrentState(): ICurrentState {
        const subPopulationsState = Array.from(this.subPopulationsIds).reduce((acc, subPopulationId) => {
            const subPopulation = window.game.civilization.subPopulations.get(subPopulationId);
            if (!subPopulation) {
                return acc;
            }

            const { children, adults, elders } = subPopulation.getLastCalculatedState();

            acc.children += children;
            acc.adults += adults;
            acc.elders += elders;
            acc.totalPopulation += children + adults + elders;

            return acc;
        }, {
            children: 0,
            adults: 0,
            elders: 0,
            totalPopulation: 0,
        });

        this.lastCurrentState = subPopulationsState;

        return subPopulationsState;
    }
}