import { Procedural } from '../Procedural';
import { generateId, capitalizeFirstLetter } from '../utils';
import { Timer } from '../Timer';

type TFleetType =
    'colonial' |
    'military' |
    'exploration' |
    'trade'
;

interface ActionTrigger {
    date: number;
    action: keyof IActions;
    props?: any;
}

interface IActions {
    [key: string]: Function;
}
export class Fleet {
    seed: number;
    id: string;

    procedural: Procedural;

    type: TFleetType;
    name: string = '';

    captainId: string = '';
    headOfColonizationId: string = '';
    mainScientistId: string = '';

    cryopreservedColonists: number = 0;

    location: string = '';

    nextActionTrigger: ActionTrigger | null = null;
    processDescription: string = '';

    constructor(seed: number, type: TFleetType, name: string = '', cryopreservedColonists: number = 0) {
        this.seed = seed;
        this.id = generateId();
        this.procedural = new Procedural(seed);
        this.type = type;
        this.name = name;
        this.cryopreservedColonists = cryopreservedColonists;
    }

    checkTimeline() {
        if (!this.nextActionTrigger) {
            return;
        }
        const currentDate = Timer.now();

        if (currentDate >= this.nextActionTrigger.date) {
            this.actions[this.nextActionTrigger.action](this.nextActionTrigger.props);
            return;
        }

        this.timelineWatcher = setTimeout(() => {
            this.checkTimeline();
        }, 10);
    }

    timelineWatcher: any;

    actions: IActions = {
        enterToSystem: () => {
            clearInterval(this.timelineWatcher);
            this.location = `В системе звезды ${capitalizeFirstLetter(window.game.system.star.name)}`;
            this.processDescription = `Колонизационный флот вошел в систему звезды ${capitalizeFirstLetter(window.game.system.star.name)}.`;

            window.game.civilization.addEvent({
                time: Timer.now(),
                text: this.processDescription,
            });

            this.nextActionTrigger = {
                date: Timer.now() + Math.round(Timer.durationInMs().day * this.procedural.randomFloat(1, 3)),
                action: 'startResearchingSystem'
            };

            this.checkTimeline();

            window.dispatchEvent(new CustomEvent('ui:fleetUpdate', { detail: { fleetId: this.id } }));
        },
        startResearchingSystem: () => {
            clearInterval(this.timelineWatcher);
            const mainScientist = window.game.civilization.getPersonById(this.mainScientistId);
            this.processDescription = `Главный ученный ${mainScientist?.uiName} со своей командой начинает исследование системы звезды ${capitalizeFirstLetter(window.game.system.star.name)} в поисках самой перспективной планеты для начала колонизации.`;

            const startDateTime = this.nextActionTrigger?.date || Timer.now();

            window.game.civilization.addEvent({
                time: startDateTime,
                text: this.processDescription,
            });

            this.nextActionTrigger = {
                date: startDateTime + Math.round(Timer.durationInMs().month * this.procedural.randomFloat(7, 16)),
                action: 'selectPlanetToColonize',
            };

            this.checkTimeline();

            window.dispatchEvent(new CustomEvent('ui:fleetUpdate', { detail: { fleetId: this.id } }));
        },
        selectPlanetToColonize: () => {
            clearInterval(this.timelineWatcher);
            const comfortablePlanetsIds = window.game.system.getComfortablePlanetsIds();
            const mostPerspectivePlanet = window.game.system.planets[0];

            this.processDescription = `Команда исследователей выбирает планету ${capitalizeFirstLetter(mostPerspectivePlanet?.name || '')} для начала колонизации.`;

            const startDateTime = this.nextActionTrigger?.date || Timer.now();

            window.game.civilization.addEvent({
                time: startDateTime,
                text: this.processDescription,
            });

            this.nextActionTrigger = {
                date: startDateTime + Math.round(Timer.durationInMs().day * this.procedural.randomFloat(1, 3)),
                action: 'flyToPlanet',
                props: { planetId: mostPerspectivePlanet?.id || '', planetName: mostPerspectivePlanet?.name || '' }
            };

            this.checkTimeline();

            window.dispatchEvent(new CustomEvent('ui:fleetUpdate', { detail: { fleetId: this.id } }));
        },
        flyToPlanet: ({planetId, planetName}: any) => {
            clearInterval(this.timelineWatcher);
            this.processDescription = `Колонизационный флот направляется на орбиту планеты ${capitalizeFirstLetter(planetName)}.`;

            const startDateTime = this.nextActionTrigger?.date || Timer.now();

            window.game.civilization.addEvent({
                time: startDateTime,
                text: this.processDescription,
            });

            this.nextActionTrigger = {
                date: startDateTime + Math.round(Timer.durationInMs().month * this.procedural.randomFloat(8, 13)),
                action: 'colonizePlanet',
                props: { planetId }
            };

            this.checkTimeline();

            window.dispatchEvent(new CustomEvent('ui:fleetUpdate', { detail: { fleetId: this.id } }));
        },
        colonizePlanet: ({planetId}: any) => {
            const planet = window.game.system.getPlanetById(planetId);
            if (!planet) {
                return;
            }

            this.processDescription = `Колонизационный флот начинает процесс колонизации планеты ${capitalizeFirstLetter(planet.name)}.`;

            window.game.civilization.addEvent({
                time: Timer.now(),
                text: this.processDescription,
            });

            window.game.civilization.colonizePlanet(planetId);

            this.location = `На орбите планеты ${capitalizeFirstLetter(planet.name)}.`;
            window.dispatchEvent(new CustomEvent('ui:fleetUpdate', { detail: { fleetId: this.id } }));
        }
    }
}