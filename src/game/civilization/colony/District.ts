import { Colony } from './Colony';
import * as utils from '../../utils';

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

    static featuresByDistrictType: Map<DistrictType, Set<string>> = new Map([
        ['outpost', new Set<string>()],
        ['center', new Set<string>()],
        ['farming', new Set<string>()],
        ['mining', new Set<string>()],
        ['industrial', new Set<string>()],
        ['medical', new Set<string>()],
        ['science', new Set<string>()],
        ['religious', new Set<string>()],
        ['living', new Set<string>()],
        ['business', new Set<string>()],
    ]);
    static getFeatures(districtType: DistrictType) {
        return District.featuresByDistrictType.get(districtType) as unknown as Set<string>;
    }
    static addFeature(districtType: DistrictType, feature: string) {
        District.getFeatures(districtType).add(feature);
        console.log('addFeature', districtType, feature, District.getFeatures(districtType));
        window.dispatchEvent(new CustomEvent(`district:${districtType}:update`));
    }
    realizedFeatures: Set<string> = new Set();

    static buildingsByDistrictType: Map<DistrictType, Set<string>> = new Map([
        ['outpost', new Set<string>()],
        ['center', new Set<string>()],
        ['farming', new Set<string>()],
        ['mining', new Set<string>()],
        ['industrial', new Set<string>()],
        ['medical', new Set<string>()],
        ['science', new Set<string>()],
        ['religious', new Set<string>()],
        ['living', new Set<string>()],
        ['business', new Set<string>()],
    ]);
    static getBuildings(districtType: DistrictType) {
        return District.buildingsByDistrictType.get(districtType) as unknown as Set<string>;
    }
    static addBuilding(districtType: DistrictType, building: string) {
        District.getBuildings(districtType).add(building);
        window.dispatchEvent(new CustomEvent(`district:${districtType}:update`));
    }
    realizedBuildings: Set<string> = new Set();

    constructor(colony: Colony, type: DistrictType) {
        this.colony = colony;
        this.type = type;

        this.realizedFeatures = new Set();
        this.realizedBuildings = new Set();

        window.addEventListener(`district:${type}:update`, () => {
            this.featureChecking();
        });
    }

    featureChecking() {
        if (this.realizedFeatures.size !== District.getFeatures(this.type).size) {
            utils.asyncForEach<string>(Array.from(District.getFeatures(this.type)), async (feature: string) => {
                if (this.realizedFeatures.has(feature)) return;
                window.game.civilization.technologies.allColonyFeatures.get(feature)?.effects.forEach(this.setEffect.bind(this));

                this.realizedFeatures.add(feature);
            });
        }
    }

    setEffect(effect: any) {
        const key = Object.keys(effect)[0];
        const value = Object.values(effect)[0] as any;

        if (value.multiple) {
            // @ts-ignore
            this[key] *= value.multiple;
        }
        if (value.add) {
            // @ts-ignore
            this[key] += value.add;
        }
        if (value.divide) {
            // @ts-ignore
            this[key] /= value.divide;
        }
        if (value.minus) {
            // @ts-ignore
            this[key] -= value.minus;
        }
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
    constructor(colony: Colony) {
        super(colony, 'outpost');
        this.maxPopulation = 10;

        this.featureChecking();
    }
}

export class Center extends District {
    constructor(colony: Colony) {
        super(colony, 'center');
        this.featureChecking();
    }
}

export class Farming extends District {
    constructor(colony: Colony) {
        super(colony, 'farming');
        this.featureChecking();
    }
}

export class Mining extends District {
    constructor(colony: Colony) {
        super(colony, 'mining');
        this.featureChecking();
    }
}

export class Industrial extends District {
    constructor(colony: Colony) {
        super(colony, 'industrial');
        this.featureChecking();
    }
}

export class Medical extends District {
    constructor(colony: Colony) {
        super(colony, 'medical');
        this.featureChecking();
    }
}

export class Science extends District {
    constructor(colony: Colony) {
        super(colony, 'science');
        this.featureChecking();
    }
}

export class Religious extends District {
    constructor(colony: Colony) {
        super(colony, 'religious');
        this.featureChecking();
    }
}

export class Living extends District {
    constructor(colony: Colony) {
        super(colony, 'living');
        this.featureChecking();
    }
}

export class Business extends District {
    constructor(colony: Colony) {
        super(colony, 'business');
        this.featureChecking();
    }
}