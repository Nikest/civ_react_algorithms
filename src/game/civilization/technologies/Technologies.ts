import { generateId } from '../../utils';
import { buildings, Building } from './Buildings';
import { colonyFeatures, ColonyFeature } from './ColonyFeatures';
import { Timer } from '../../Timer';
import { Outpost } from '../colony/District';

const arrayTechLevel0: Map<string, Technology> = new Map();
const arrayTechLevel1: Map<string, Technology> = new Map();
const arrayTechLevel2: Map<string, Technology> = new Map();
const arrayTechLevel3: Map<string, Technology> = new Map();

const levelsOfTechnologies = [arrayTechLevel0, arrayTechLevel1, arrayTechLevel2, arrayTechLevel3]

interface ITechnology {
    name: string;
    description: string;
    cost: number;
    key: string;
    buildings: string[];
    colony: string[];
    onResearchEnd: () => void;
    isKeyTechnology?: boolean;
}

class Technology implements ITechnology {
    id: string;
    name: string;
    description: string;
    childrenTechs: Set<Technology>;
    cost: number;
    key: string;
    buildings: string[];
    colony: string[];
    isKeyTechnology: boolean = false;

    onResearchEnd: () => void;

    constructor(props: ITechnology) {
        this.id = props.key;
        this.name = props.name;
        this.description = props.description;
        this.childrenTechs = new Set();
        this.cost = props.cost;
        this.key = props.key;
        this.buildings = props.buildings;
        this.colony = props.colony;
        this.isKeyTechnology = props.isKeyTechnology || false;

        this.onResearchEnd = props.onResearchEnd;
    }
}

export class TechTree {
    changeHash: string;

    sciencePower: number;

    levelsOfTechnologies: Map<string, Technology>[];
    researchedTechnologyIds: Set<string>;

    technologiesInProgress: Map<string, number>;

    allowedForResearchLevel: number;

    allBuildings = buildings;
    allowedBuildings: Set<string>;

    allColonyFeatures = colonyFeatures;
    allowedColonyFeatures: Set<string>;

    constructor() {
        this.changeHash = generateId();

        this.sciencePower = 1;

        this.levelsOfTechnologies = levelsOfTechnologies;
        this.researchedTechnologyIds = new Set();
        this.allowedForResearchLevel = 0;

        this.technologiesInProgress = new Map();

        this.allowedBuildings = new Set();
        this.allowedColonyFeatures = new Set();

        window.addEventListener('timer:UpdateMonth', () => {
            this.newMonthUpdate();
        });
    }

    startResearch(techId: string) {
        const technology = this.getTechnologyById(techId);

        this.technologiesInProgress.set(techId, technology?.cost || 0);

        this.changeHash = generateId();
    }

    newMonthUpdate() {
        if (this.technologiesInProgress.size === 0) return;

        Array.from(this.technologiesInProgress).map(([id, cost]) => {
            const currentCost = cost - this.sciencePower;

            if (currentCost < 0) {
                this.endResearch(id);
            } else {
                this.technologiesInProgress.set(id, currentCost);
            }
        });

        this.changeHash = generateId();
    }

    endResearch(techId: string) {
        this.researchedTechnologyIds.add(techId);
        this.technologiesInProgress.delete(techId);

        const tech = this.getTechnologyById(techId) as unknown as Technology;
        tech.buildings.forEach(b => this.allowedBuildings.add(b));
        tech.colony.forEach(c => this.allowedColonyFeatures.add(c));
        tech.onResearchEnd();
        this.changeHash = generateId();

        if (tech.isKeyTechnology) {
            this.levelsOfTechnologies[this.allowedForResearchLevel].forEach((t) => {
                if (t.isKeyTechnology && !this.researchedTechnologyIds.has(t.id)) {
                    return;
                }
            });
            this.allowedForResearchLevel++;
        }
    }

    getTechnologyById(techId: string) {
        for (let i = 0; i < this.levelsOfTechnologies.length; i++) {
            if (this.levelsOfTechnologies[i].has(techId)) return this.levelsOfTechnologies[i].get(techId);
        }
    }

    getTechnologiesInProgress() {
        const ids = Array.from(this.technologiesInProgress);

        return ids.map(([id]) => {
            return this.getTechnologyById(id);
        });
    }
}

// build techTree

const adaptation = new Technology({
    name: 'Адаптация',
    description: 'Изучение окружающей среды. Открывает строительство базового космопорта для создания первого поселения',
    cost: 10,
    key: 'adaptation',
    buildings: [],
    colony: ['outpostLiving'],
    isKeyTechnology: true,
    onResearchEnd: () => {
        Outpost.addFeature('outpostLiving');
    }
});
arrayTechLevel0.set(adaptation.id, adaptation);


const lifeSupport = new Technology({
    name: 'Базовое жизнеобеспечение',
    description: 'Прострая фильтрация воды и воздуха в жилищах колонистов',
    cost: 10,
    key: 'lifeSupport',
    buildings: ['algalOxygenator', 'baseHydroponicFarm'],
    colony: [],
    onResearchEnd: () => {
        console.log('lifeSupport');
    }
});
arrayTechLevel1.set(lifeSupport.id, lifeSupport);

const baseBuild = new Technology({
    name: 'Базовое строительство',
    description: 'Колонисты начинают производить строительные блоки и цементирующие материалы из местных ресурсов',
    cost: 10,
    key: 'baseBuild',
    buildings: [],
    colony: ['districtAllowed'],
    onResearchEnd: () => {
        console.log('baseBuild');
    }
});
arrayTechLevel1.set(baseBuild.id, baseBuild);

const baseMining = new Technology({
    name: 'Базовая добыча',
    description: 'Исследование возможностей добычи полезных ископаемых из неглубоких залежей',
    cost: 10,
    key: 'baseMining',
    buildings: ['baseWaterExtractor', 'simpleMine'],
    colony: [],
    onResearchEnd: () => {
        console.log('baseMining');
    }
});
arrayTechLevel1.set(baseMining.id, baseMining);

const baseProduction = new Technology({
    name: 'Базовое производство',
    description: 'Простое производство необходимых материалов',
    cost: 10,
    key: 'baseProduction',
    buildings: ['simpleWorkshop'],
    colony: [],
    onResearchEnd: () => {
        console.log('baseProduction');
    }
});
arrayTechLevel1.set(baseProduction.id, baseProduction);