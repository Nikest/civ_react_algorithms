import { Procedural } from '../Procedural';
import { generateId, capitalizeFirstLetter } from '../utils';
import { generateName, generateBaseWord } from '../wordGenerator';

type TPersonRole =
    'colonist' |
    'headOfColonization' |
    'captain' |
    'scientist'
;
export class Person {
    seed: number;
    id: string;

    procedural: Procedural;

    name: string;
    surname: string;
    isFemale: boolean;
    role: TPersonRole;
    age: number = 0;

    location: string = '';

    uiName: string = '';
    constructor(seed: number, role: TPersonRole, location: string = '') {
        this.seed = seed;
        this.id = generateId();
        this.procedural = new Procedural(seed);

        this.isFemale = this.procedural.randomInt(1, 10) < 3;
        this.name = generateName(seed, this.isFemale);
        this.surname = generateBaseWord(4, 6, seed);
        this.age = this.procedural.randomInt(30, 50);
        this.role = role;
        this.location = location;

        this.uiName = `${capitalizeFirstLetter(this.name)} ${capitalizeFirstLetter(this.surname)}`;
    }

    setLocation(location: string) {

    }
}