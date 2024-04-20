import { Procedural } from '../../Procedural';
import { generateId, capitalizeFirstLetter } from '../../utils';
import { generateCityName } from '../../wordGenerator';

import { developmentStages, IDevelopmentStage } from './developmentStages';

enum DistrictType {
    CENTER = 'center',
    MINING = 'mining',
    SCIENCE = 'science',
    LIVING = 'living',
    INDUSTRY = 'industry',
    FARMING = 'farming',
    MEDICAL = 'medical',
    RELIGIOUS = 'religious',
}

interface ICityProps {
    seed: number;
    planetId: string;
    planetName: string;
    centerPlanetTileIndex: number;
}
export class City {
    seed: number;
    procedural: Procedural;

    name = '';
    id = '';
    planetId = '';
    planetName = '';
    centerPlanetTileIndex = 0;

    districts: District[] = [];

    // modifiers
    public lifeQuality = 1;
    public fertilityMultiplier = 1;
    public sciencePower = 1;
    public productionPower = 1;
    public economyPower = 1;

    public subPopulationsById = {};
    public children = 0;
    public adults = 0;
    public elders = 0;
    public totalPopulation = 0;

    public developmentStage: IDevelopmentStage;

    constructor({seed, planetId, planetName, centerPlanetTileIndex}: ICityProps) {
        this.seed = seed;
        this.procedural = new Procedural(seed);

        this.id = generateId();
        this.name = generateCityName(seed);
        this.planetId = planetId;
        this.planetName = planetName;
        this.centerPlanetTileIndex = centerPlanetTileIndex;

        const districtId = generateId();
        this.districts.push(new District({
            id: districtId,
            cityId: this.id,
            type: DistrictType.CENTER,
            planetTileIndex: centerPlanetTileIndex,
        }));

        window.game.system.getPlanetById(planetId)?.setCity(this.id, districtId, centerPlanetTileIndex);

        this.developmentStage = developmentStages[0];
    }

    getDistrictById(id: string) {
        return this.districts.find(d => d.id === id);
    }
}

interface IDistrict {
    id: string;
    cityId: string;
    type: DistrictType;
    planetTileIndex: number;
}
class District implements IDistrict {
    id = '';
    cityId = '';
    type;
    planetTileIndex = 0;

    constructor({id, cityId, type, planetTileIndex}: IDistrict) {
        this.id = id;
        this.cityId = cityId;
        this.type = type;
        this.planetTileIndex = planetTileIndex;
    }
}