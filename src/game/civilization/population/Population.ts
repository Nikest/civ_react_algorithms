import { Procedural } from '../../Procedural';
import { Timer } from '../../Timer';
import * as utils from '../../utils';

export class Population {
    seed: number;
    rand: Procedural;

    public beginDate: number;

    public childrenBeginTerm = 0;
    public adultsBeginTerm = 0;
    public eldersBeginTerm = 0;
    public totalPopulation = 0;

    public afterDate: number;
    public childrenAfterTerm = 0;
    public adultsAfterTerm = 0;
    public eldersAfterTerm = 0;

    public maxLifeSpan = 70;
    public maxChildhood = 18;
    public maxFertilityPeriod = 30;
    public maxElderhood = 22;
    public fertilityRate = 2.5;

    constructor(seed: number) {
        this.seed = seed;
        this.rand = new Procedural(seed);

        this.beginDate = Timer.now();
        this.afterDate = Timer.now() + (100 * Timer.durationInMs().year);

        this.childrenBeginTerm = 0;
        this.adultsBeginTerm = 1000;
        this.eldersBeginTerm = 0;

        this.totalPopulation = this.childrenBeginTerm + this.adultsBeginTerm + this.eldersBeginTerm;
    }

    public getCurrentState() {
        // how many times from beginDate to afterDate in 0 to 1?
        const start = this.beginDate;
        const end = this.afterDate;
        const current = Timer.now();

        const normalizedTime = (current - start) / (end - start);

        const currentChildrenLerp = utils.lerp(this.childrenBeginTerm, this.childrenAfterTerm, normalizedTime);
        const currentAdultsLerp = utils.lerp(this.adultsBeginTerm, this.adultsAfterTerm, normalizedTime);
        const currentEldersLerp = utils.lerp(this.eldersBeginTerm, this.eldersAfterTerm, normalizedTime);

        const totalPopulation = currentChildrenLerp + currentAdultsLerp + currentEldersLerp;

        return {
            children: currentChildrenLerp,
            adults: currentAdultsLerp,
            elders: currentEldersLerp,
            totalPopulation,
        }
    }

    public calculateForHundredYears() {
        const children = this.
    }

    public growAfterYear() {
        // Дети становятся взрослыми (1/18 часть детей)
        const newAdults = Math.floor(this.children / this.maxChildhood);
        this.children -= newAdults;

        // Рождаемость (учитываем только женщин)
        const women = this.adults / 2;
        const newChildren = Math.floor(women * (this.fertilityRate / this.maxFertilityPeriod));

        // Взрослые становятся стариками (1/30 часть взрослых)
        const newElders = Math.floor(this.adults / this.maxFertilityPeriod);
        this.adults -= newElders;

        // Смертность среди стариков (1/22 часть стариков)
        const deaths = Math.floor(this.elders / 22);

        // Обновляем значения
        this.elders = Math.max(0, this.elders + newElders - deaths);
        this.adults += newAdults;
        this.children += newChildren;

        // Пересчитываем общее население
        this.totalPopulation = this.children + this.adults + this.elders;
    }
}