import { Procedural } from '../../Procedural';
import { generateId, capitalizeFirstLetter } from '../../utils';
import { generateCityName } from '../../wordGenerator';
import {
    DistrictType,
    Outpost,
    Center,
    Farming,
    Mining,
    Industrial,
    Medical,
    Science,
    Religious,
    Living,
    Business,
} from './District';

import { developmentStages, IDevelopmentStage } from './developmentStages';


interface IColonyProps {
    seed: number;
    planetId: string;
    planetName: string;
    centerPlanetTileIndex: number;
}
export class Colony {
    // system
    seed: number;
    procedural: Procedural;

    // parameters
    name = '';
    id = '';
    planetId = '';
    planetName = '';
    centerPlanetTileIndex = 0;


    // features
    static features: Set<string> = new Set();
    static addFeature(feature: string) {
        this.features.add(feature);
        window.dispatchEvent(new CustomEvent('colony:Features:update'));
    }

    // districts
    districts: Map<number, DistrictType>;

    districtBuildAllowed = false;

    districtOutpost: Outpost;
    districtOutpostAllowed = true;

    districtCenter: Center;
    districtCenterAllowed = false;

    districtFarming: Farming;
    districtFarmingAllowed = false;

    districtMining: Mining;
    districtMiningAllowed = false;

    districtIndustrial: Industrial;
    districtIndustrialAllowed = false;

    districtMedical: Medical;
    districtMedicalAllowed = false;

    districtScience: Science;
    districtScienceAllowed = false;

    districtReligious: Religious;
    districtReligiousAllowed = false;

    districtLiving: Living;
    districtLivingAllowed = false;

    districtBusiness: Business;
    districtBusinessAllowed = false;


    isMaximalGrowing = false;

    subPopulationIds: Set<string> = new Set();
    setSubPopulationId(subPopulationId: string) {
        this.subPopulationIds.add(subPopulationId);
    }

    // population
    public children = 0;
    public adults = 0;
    public elders = 0;
    public totalPopulation = 0;

    // modifiers
    public lifeQuality = 1;
    public fertilityMultiplier = 1;
    public sciencePower = 1;
    public productionPower = 1;
    public economyPower = 1;

    public developmentStage: IDevelopmentStage;

    constructor({seed, planetId, planetName, centerPlanetTileIndex}: IColonyProps) {
        this.seed = seed;
        this.procedural = new Procedural(seed);

        this.id = generateId();
        this.name = generateCityName(seed);
        this.planetId = planetId;
        this.planetName = planetName;
        this.centerPlanetTileIndex = centerPlanetTileIndex;

        this.subPopulationIds = new Set();

        this.developmentStage = developmentStages[0];

        this.districts = new Map();
        this.districtOutpost = new Outpost(this);
        this.districtCenter = new Center(this);
        this.districtFarming = new Farming(this);
        this.districtMining = new Mining(this);
        this.districtIndustrial = new Industrial(this);
        this.districtMedical = new Medical(this);
        this.districtScience = new Science(this);
        this.districtReligious = new Religious(this);
        this.districtLiving = new Living(this);
        this.districtBusiness = new Business(this);
    }

    public calculateSubPopulationsState() {
        const subPopulationsState = Array.from(this.subPopulationIds).reduce((acc, subPopulationId) => {
            const subPopulation = window.game.civilization.subPopulations.get(subPopulationId);
            if (!subPopulation) {
                return acc;
            }

            const { children, adults, elders } = subPopulation.getCurrentState();

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

        this.children = subPopulationsState.children;
        this.adults = subPopulationsState.adults;
        this.elders = subPopulationsState.elders;
        this.totalPopulation = subPopulationsState.totalPopulation;
    }

    calculatePopulation() {
        this.calculateSubPopulationsState();
    }

    init() {
        this.districtOutpost.createNewDistrict(this.centerPlanetTileIndex);
    }

    newDistrictRandomPosition(): number {
        const planetFreeTiles: number[] = [];
        const planetTiles = window.game.system.getPlanetById(this.planetId)?.getTiles();

        if (!planetTiles) return -1;

        this.districts.forEach((district, planetTileIndex) => {
            planetTiles.hexaSphere.tiles[planetTileIndex].neighbors.forEach(neighbor => {
                if (neighbor.planetTile.isColonized && neighbor.planetTile.type === 'land' && !neighbor.planetTile.isPolarCircle) {
                    planetFreeTiles.push(neighbor.planetTile.index);
                }
            });
        });

        if (planetFreeTiles.length === 0) {
            this.isMaximalGrowing = true;
            return -1;
        }

        return this.procedural.randomFromArray(planetFreeTiles);
    }
}