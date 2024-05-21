import { Procedural } from '../Procedural';
import { generateId } from '../utils';

import { Person } from './Persone';
import { Fleet } from './Fleet';
import { City } from './city/City';
import { Population } from './population';
import { backgroundVariants, IBackground } from './Background';

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

    populations: Population[] = [];
    cities: City[] = [];
    cultures = [];
    orbitalStations = [];
    colonizedPlanetsIds: string[] = [];
    persons: Person[] = [];
    getPersonById(id: string) {
        return this.persons.find((person) => person.id === id);
    }

    fleets: Fleet[] = [];

    // statistics in numbers
    totalPopulation = 0;


    constructor(seed: number) {
        this.seed = seed;
        this.procedural = new Procedural(seed);

        this.background = this.procedural.randomFromArray(backgroundVariants);

        this.id = generateId();

        const population = new Population(1000);
        this.populations.push(population)
        this.cities = [];
        this.cultures = [];
        this.orbitalStations = [];
        this.persons = [];
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

        this.persons.push(captain);
        this.persons.push(headOfColonization);
        this.persons.push(mainScientist);

        setTimeout(() => {
            fleet.actions.enterToSystem();
        }, 2000);
    }

    addEvent(event: IEvent) {
        this.events.push(event);
        window.dispatchEvent(new CustomEvent('ui:addEvent', { detail: event }));
    }

    colonizePlanet(planetId: string) {
        this.colonizedPlanetsIds.push(planetId);
        const planet = window.game.system.getPlanetById(planetId);
        planet?.getTiles().setActionOnClick((tile) => {
            const city = new City({
                seed: this.procedural.randomInt(0, 100000),
                planetId: planetId,
                planetName: planet.name || '',
                centerPlanetTileIndex: tile.index,
            });
            this.cities.push(city);
            tile.isColonized = true;
            tile.cityId = city.id;
            tile.citiDistrictId = city.districts[0].id;
            tile.color = city.districts[0].color;
            planet.colonize();
        });
    }

    getCityById(id: string) {
        return this.cities.find((city) => city.id === id);
    }
}