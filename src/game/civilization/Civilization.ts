import { Procedural } from '../Procedural';
import { generateId } from '../utils';

import { TechTree } from './technologies';
import { Person } from './Persone';
import { Fleet } from './Fleet';
import { Colony } from './colony/Colony';
import { Population, SubPopulation } from './population';
import { backgroundVariants, IBackground } from './Background';
import * as StoryTeller from '../story';

import { InfoPopupInterface, capitalizeFirstLetter } from '../utils';

interface IEvent {
    time: number;
    text: string;
}

export class Civilization {
    procedural = new Procedural(0);

    seed = 0;
    id = '';

    events: IEvent[] = [];

    background: IBackground = backgroundVariants[0];
    colonists: number = 0;

    technologies: TechTree;

    populations: Map<string, Population> = new Map();
    addPopulation(population: Population) {
        this.populations.set(population.id, population);
    }

    subPopulations: Map<string, SubPopulation> = new Map();
    addSubPopulation(subPopulation: SubPopulation) {
        this.subPopulations.set(subPopulation.id, subPopulation);
    }

    colonies: Map<string, Colony> = new Map();
    addCity(city: Colony) {
        this.colonies.set(city.id, city);
    }

    cultures: Map<string, any> = new Map();
    orbitalStations: Map<string, any> = new Map();

    colonizedPlanetsIds: Set<string> = new Set();

    personsById: Map<string, Person> = new Map();
    personsByRole: Map<string, Person> = new Map();
    getPersonById(id: string) {
        return this.personsById.get(id) as unknown as Person;
    }
    getPersonByRole(role: string) {
        return this.personsByRole.get(role) as unknown as Person;
    }

    fleets: Fleet[] = [];

    // statistics in numbers
    totalPopulation = 0;


    constructor(seed: number) {
        this.seed = seed;
        this.procedural = new Procedural(seed);

        this.background = this.procedural.randomFromArray(backgroundVariants);
        this.technologies = new TechTree();

        this.id = generateId();

        this.colonies = new Map();
        this.cultures = new Map();
        this.orbitalStations = new Map();
        this.personsById = new Map();
        this.personsByRole = new Map();
    }

    start() {
        const colonists = this.procedural.randomInt(this.background.colonistsRange[0], this.background.colonistsRange[1]);
        const fleet = new Fleet(this.procedural.randomInt(0, 100000), 'colonial', 'Колонизационный флот', colonists);
        this.fleets.push(fleet);

        const captain = new Person(this.procedural.randomInt(0, 100000), 'captain');
        const headOfColonization = new Person(this.procedural.randomInt(0, 100000), 'headOfColonization');
        const mainScientist = new Person(this.procedural.randomInt(0, 100000), 'scientist');

        fleet.captainId = captain.id;
        fleet.headOfColonizationId = headOfColonization.id;
        fleet.mainScientistId = mainScientist.id;

        this.personsById.set(captain.id, captain);
        this.personsById.set(headOfColonization.id, headOfColonization);
        this.personsById.set(mainScientist.id, mainScientist);

        this.personsByRole.set('captain', captain);
        this.personsByRole.set('headOfColonization', headOfColonization);
        this.personsByRole.set('scientist', mainScientist);

        setTimeout(() => {
            fleet.actions.enterToSystem();
        }, 2000);
    }

    addEvent(event: IEvent) {
        this.events.push(event);
        window.dispatchEvent(new CustomEvent('ui:addEvent', { detail: event }));
    }

    colonizePlanet(planetId: string) {
        this.colonizedPlanetsIds.add(planetId);

        const planet = window.game.system.getPlanetById(planetId);

        planet?.getTiles().setActionOnClick((tile) => {
            InfoPopupInterface({
                title: 'Колонизация',
                message: `Колонизировать тайл ${tile.index}?`,
                actions: [
                    {
                        text: 'Колонизировать',
                        function: () => {
                            const population = new Population(1234, 0, 5000, 0);
                            const firstSubPopulation = population.subPopulationsIds.values().next().value;
                            this.addPopulation(population);

                            const colony = new Colony({
                                seed: this.procedural.randomInt(0, 100000),
                                planetId: planetId,
                                planetName: planet.name || '',
                                centerPlanetTileIndex: tile.index,
                            });
                            colony.setSubPopulationId(firstSubPopulation);
                            this.addCity(colony);

                            tile.isColonized = true;
                            tile.colonyId = colony.id;
                            tile.color = colony.districtOutpost.color;
                            planet.colonize();
                            colony.init();
                            const landGroup = planet.planetTiles?.getLandGroup(tile.landGroup);

                            const capitan = this.getPersonByRole('captain');
                            InfoPopupInterface({
                                title: `Основана колония ${capitalizeFirstLetter(colony.name)} на планете ${capitalizeFirstLetter(planet.name)}`,
                                message: StoryTeller.firstColonyEstablish({
                                    starName: window.game.system.star.name,
                                    planetName: planet.name,
                                    colonyName: colony.name,
                                    captainName: capitan.name,
                                    captainSurname: capitan.surname,
                                    captainIsFemale: capitan.isFemale
                                }),
                            });
                        }
                    },
                    {
                        text: 'Отмена',
                        function: () => { this.colonizePlanet(planetId) }
                    }
                ],
            });
        });
    }

    getColonyById(id: string) {
        return this.colonies.get(id);
    }
}