import {Procedural} from "../../Procedural";
import * as utils from "../../utils";
import { Timer } from "../../Timer";
import { ICurrentState } from "./Population";

export class SubPopulation {
    populationId: string;
    id: string;

    public beginDate: number;

    public childrenBeginTerm = 0;
    public adultsBeginTerm = 0;
    public eldersBeginTerm = 0;

    public childrenLastCalculated = 0;
    public adultsLastCalculated = 0;
    public eldersLastCalculated = 0;

    public afterDate: number;
    public childrenAfterTerm = 0;
    public adultsAfterTerm = 0;
    public eldersAfterTerm = 0;

    public maxLifeSpan = 70;
    public maxChildhood = 18;
    public maxFertilityPeriod = 30;
    public maxElderhood = 22;
    public fertilityRate = 2.7;

    constructor(populationId: string, startedChildren: number, startedAdults: number, startedElders: number) {
        this.id = utils.generateId();
        this.populationId = populationId;

        this.beginDate = Timer.now();
        this.afterDate = Timer.now() + (100 * Timer.durationInMs().year);

        this.childrenBeginTerm = startedChildren;
        this.childrenLastCalculated = this.childrenBeginTerm;
        this.childrenAfterTerm = this.childrenBeginTerm;

        this.adultsBeginTerm = startedAdults;
        this.adultsLastCalculated = this.adultsBeginTerm;
        this.adultsAfterTerm = this.adultsBeginTerm;

        this.eldersBeginTerm = startedElders;
        this.eldersLastCalculated = this.eldersBeginTerm;
        this.eldersAfterTerm = this.eldersBeginTerm;

        this.calculateForHundredYears();
    }

    public getLastCalculatedState(): ICurrentState {
        return {
            children: this.childrenLastCalculated,
            adults: this.adultsLastCalculated,
            elders: this.eldersLastCalculated,
            totalPopulation: this.childrenLastCalculated + this.adultsLastCalculated + this.eldersLastCalculated,
        }
    }

    public update() {
        this.beginDate = this.afterDate;

        this.childrenBeginTerm = this.childrenAfterTerm;
        this.adultsBeginTerm = this.adultsAfterTerm;
        this.eldersBeginTerm = this.eldersAfterTerm;

        this.afterDate += (100 * Timer.durationInMs().year);
        this.calculateForHundredYears();
    }

    public getCurrentState(): ICurrentState {
        let start = this.beginDate;
        let end = this.afterDate;
        let current = Timer.now();

        if (current > this.afterDate) {
            this.update();

            return this.getCurrentState();
        }

        const normalizedTime = (current - start) / (end - start);

        const currentChildrenLerp = Math.floor(utils.lerp(this.childrenBeginTerm, this.childrenAfterTerm, normalizedTime));
        const currentAdultsLerp = Math.floor(utils.lerp(this.adultsBeginTerm, this.adultsAfterTerm, normalizedTime));
        const currentEldersLerp = Math.floor(utils.lerp(this.eldersBeginTerm, this.eldersAfterTerm, normalizedTime));

        const totalPopulation = currentChildrenLerp + currentAdultsLerp + currentEldersLerp;

        this.childrenLastCalculated = currentChildrenLerp;
        this.adultsLastCalculated = currentAdultsLerp;
        this.eldersLastCalculated = currentEldersLerp;

        return {
            children: currentChildrenLerp,
            adults: currentAdultsLerp,
            elders: currentEldersLerp,
            totalPopulation,
        }
    }

    public calculateForHundredYears() {
        const { children, adults, elders } = this.getCurrentState();
        let currentChildren = children;
        let currentAdults = adults;
        let currentElders = elders;

        for (let i = 0; i < 100; i++) {
            const result = this.growAfterYear(currentChildren, currentAdults, currentElders);
            currentChildren = result.children;
            currentAdults = result.adults;
            currentElders = result.elders;
        }

        this.childrenAfterTerm = currentChildren;
        this.adultsAfterTerm = currentAdults;
        this.eldersAfterTerm = currentElders;
    }

    public growAfterYear(children: number, adults: number, elders: number) {
        // Дети становятся взрослыми (1/18 часть детей)
        const newAdults = Math.floor(children / this.maxChildhood);
        children -= newAdults;

        // Рождаемость (учитываем только женщин)
        const women = adults / 2;
        const newChildren = Math.floor(women * (this.fertilityRate / this.maxFertilityPeriod));

        // Взрослые становятся стариками (1/30 часть взрослых)
        const newElders = Math.floor(adults / this.maxFertilityPeriod);
        adults -= newElders;

        // Смертность среди стариков (1/22 часть стариков)
        const deaths = Math.floor(elders / this.maxElderhood);

        // Обновляем значения
        elders = Math.max(0, elders + newElders - deaths);
        adults += newAdults;
        children += newChildren;

        // Пересчитываем общее население
        const totalPopulation = children + adults + elders;

        return {
            children,
            adults,
            elders,
            totalPopulation,
        }
    }
}