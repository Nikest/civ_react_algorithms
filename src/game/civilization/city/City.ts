import { Procedural } from '../../Procedural';
import { generateId, capitalizeFirstLetter } from '../../utils';
import { generateCityName } from '../../wordGenerator';

import { developmentStages, IDevelopmentStage } from './developmentStages';

enum DistrictType {
    CENTER = 'center',
    MINING = 'mining',
    SCIENCE = 'science',
    LIVING = 'living',
    INDUSTRY = 'industrial',
    FARMING = 'farming',
    MEDICAL = 'medical',
    RELIGIOUS = 'religious',
}

enum DistrictTypeColor {
    center = 'rgb(192,192,192)',
    mining = 'rgb(189,180,180)',
    science = 'rgb(209,221,239)',
    living = 'rgb(205,201,213)',
    industry = 'rgb(223,200,200)',
    farming = 'rgb(197,225,196)',
    medical = 'rgb(219,255,238)',
    religious = 'rgb(220,212,189)',
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
    isMaximalGrowing = false;

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

        //window.game.system.getPlanetById(planetId)?.setCity(this.id, districtId, centerPlanetTileIndex);

        this.developmentStage = developmentStages[0];
    }

    getDistrictById(id: string) {
        return this.districts.find(d => d.id === id);
    }

    newDistrict() {
        if (this.isMaximalGrowing) return;
        const randomDistrictType = this.procedural.randomFromArray(Object.values(DistrictType));
        const planetFreeTiles: number[] = [];

        const planetTiles = window.game.system.getPlanetById(this.planetId)?.getTiles();

        if (!planetTiles) return;

        this.districts.forEach(district => {
            planetTiles.hexaSphere.tiles[district.planetTileIndex].neighbors.forEach(neighbor => {
                if (neighbor.planetTile.cityId === '' && neighbor.planetTile.type === 'land' && !neighbor.planetTile.isPolarCircle) {
                    planetFreeTiles.push(neighbor.planetTile.index);
                }

            });
        });

        if (planetFreeTiles.length === 0) {
            this.isMaximalGrowing = true;
            return;
        }

        const randomTileIndex = this.procedural.randomFromArray(planetFreeTiles);

        const newDistrict = new District({
            id: generateId(),
            cityId: this.id,
            type: randomDistrictType,
            planetTileIndex: randomTileIndex,
            // @ts-ignore
            color: DistrictTypeColor[randomDistrictType],
        });

        planetTiles.colonizeTile(randomTileIndex, this.id, newDistrict.id, newDistrict.color);

        this.districts.push(newDistrict);
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
    color: DistrictTypeColor;
    planetTileIndex = 0;

    constructor({id, cityId, type, planetTileIndex}: IDistrict) {
        this.id = id;
        this.cityId = cityId;
        this.type = type;
        // @ts-ignore
        this.color = DistrictTypeColor[type as DistrictTypeColor];
        this.planetTileIndex = planetTileIndex;
    }
}