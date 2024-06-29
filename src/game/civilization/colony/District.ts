import { Colony } from './Colony';

export type DistrictType =
    'outpost' |
    'center' |
    'farming' |
    'mining' |
    'industrial' |
    'medical' |
    'science' |
    'religious' |
    'business' |
    'living' ;

const districtTypeColor =  {
    outpost: 'rgb(63,71,68)',
    center: 'rgb(192,192,192)',
    mining: 'rgb(189,180,180)',
    science: 'rgb(209,221,239)',
    living: 'rgb(205,201,213)',
    industrial: 'rgb(223,200,200)',
    farming: 'rgb(197,225,196)',
    medical: 'rgb(219,255,238)',
    religious: 'rgb(220,212,189)',
    business: 'rgb(255,255,255)',
}

export abstract class District {
    colony: Colony;

    type: DistrictType = 'outpost';
    color: string = districtTypeColor[this.type];
    numberOfDistricts: number = 0;

    maxPopulation = 0;

    realizedFeatures: Set<string> = new Set();
    realizedBuildings: Set<string> = new Set();

    constructor(colony: Colony) {
        this.colony = colony;
    }

    createNewDistrict(tileNumber: number) {
        this.numberOfDistricts++;
        this.colony.districts.set(tileNumber, this.type);

        this.onCreate();
    }

    onCreate() {

    }
}

export class Outpost extends District {
    static features: Set<string> = new Set();
    static addFeature(feature: string) {
        Outpost.features.add(feature);
        window.dispatchEvent(new CustomEvent('district:Outpost:update'));
    }

    static buildings: Set<string> = new Set();
    static addBuilding(building: string) {
        Outpost.buildings.add(building);
        window.dispatchEvent(new CustomEvent('district:Outpost:update'));
    }

    constructor(colony: Colony) {
        super(colony);

        this.type = 'outpost';
        this.maxPopulation = 10;

        this.featureChecking();

        window.addEventListener('district:Outpost:update', () => {
            this.featureChecking();
        });
    }

    featureChecking() {
        if (this.realizedFeatures.size !== Outpost.features.size) {
            Outpost.features.forEach(feature => {
                !this.realizedFeatures.has(feature) && window.game.civilization.technologies.allColonyFeatures.get(feature)?.effects.forEach((effect: any) => {
                    const key = Object.keys(effect)[0];
                    const value = Object.values(effect)[0] as any;

                    if (key === 'maxPopulation') {
                        this.maxPopulation *= value.multiple;
                    }
                });
            });
        }
    }
}

export class Center extends District {
    static features: Set<string> = new Set();
    static buildings: Set<string> = new Set();

    constructor(colony: Colony) {
        super(colony);

        this.type = 'center';
    }
}

export class Farming extends District {
    static features: Set<string> = new Set();
    static buildings: Set<string> = new Set();

    constructor(colony: Colony) {
        super(colony);

        this.type = 'farming';
    }
}

export class Mining extends District {
    static features: Set<string> = new Set();
    static buildings: Set<string> = new Set();

    constructor(colony: Colony) {
        super(colony);

        this.type = 'mining';
    }
}

export class Industrial extends District {
    static features: Set<string> = new Set();
    static buildings: Set<string> = new Set();

    constructor(colony: Colony) {
        super(colony);

        this.type = 'industrial';
    }
}

export class Medical extends District {
    static features: Set<string> = new Set();
    static buildings: Set<string> = new Set();

    constructor(colony: Colony) {
        super(colony);

        this.type = 'medical';
    }
}

export class Science extends District {
    static features: Set<string> = new Set();
    static buildings: Set<string> = new Set();

    constructor(colony: Colony) {
        super(colony);

        this.type = 'science';
    }
}

export class Religious extends District {
    static features: Set<string> = new Set();
    static buildings: Set<string> = new Set();

    constructor(colony: Colony) {
        super(colony);

        this.type = 'religious';
    }
}

export class Living extends District {
    static features: Set<string> = new Set();
    static buildings: Set<string> = new Set();

    constructor(colony: Colony) {
        super(colony);

        this.type = 'living';
    }
}

export class Business extends District {
    static features: Set<string> = new Set();
    static buildings: Set<string> = new Set();

    constructor(colony: Colony) {
        super(colony);

        this.type = 'business';
    }
}