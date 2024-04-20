import { Procedural } from './Procedural';

const procedural = new Procedural(123);

const consonants = 'ббббввввггггдддджзззззйккккллллммммннннппппррррссссттттббббввввггггдддджзззззйккккллллммммннннппппррррссссттттффххххцчш'.split('');
const vowels = 'ааооааооуиииеее'.split('');

function generatePattern(minLength: number) {
    let pattern = [procedural.randomInt(0, 1)];

    for (let i = 1; i < minLength; i++) {
        let last = pattern[i - 1];
        let prevLast = pattern[i - 2];

        if (last === prevLast) {
            pattern.push(last === 0 ? 1 : 0);
            continue;
        }

        if (last === 0) {
            if (procedural.randomFloat(0, 1) < 0.05) {
                pattern.push(0);
            }
            pattern.push(1);
            i += 1;
            continue;
        }
        if (procedural.randomFloat(0, 1) < 0.25) {
            pattern.push(1);
        }
        pattern.push(0);
        i += 1;
    }

    if (pattern[pattern.length - 1] === 0) {
        pattern.push(1);
    }

    if (pattern[pattern.length - 1] === 1 && pattern[pattern.length - 2] === 0) {
        if (procedural.randomFloat(0, 1) < 0.25) {
            pattern.push(1);
        }
    }

    return pattern;
}

export function generateBaseWord(min = 2, max = 5, seed = 1234) {
    procedural.setSeed(seed);

    let innerConsonants = [...consonants];

    const wordPattern = generatePattern(procedural.randomInt(min, max));
    let word = '';

    for (let i = 0; i < wordPattern.length; i++) {
        if (wordPattern[i] === 0) {
            word += procedural.randomFromArray(vowels);
            continue;
        }
        const currentConsonant = procedural.randomFromArray(innerConsonants);
        word += currentConsonant;
        innerConsonants = innerConsonants.filter((consonant) => consonant !== currentConsonant);
    }

    return word;
}

export function generateCityName(seed: number) {
    const endings = ['ар', 'арда', 'айя', 'он', 'ион', 'еон', 'увім', 'инен', 'ос', 'ус', 'ея', 'ия', 'ан','ал','апал', 'ен', 'ир', 'ур', 'ис', 'ас', 'ель', 'ант', 'иф', 'ез', 'ак', 'ул', 'ол', 'ель', 'аль', 'ор', 'ир', 'ум', 'ам', 'ем'];
    let word = generateBaseWord(2, 5, seed);

    return word + procedural.randomFromArray(endings);
}

export function generatePlanetName(seed: number) {
    const endings = ['ия','ая','оя', 'он','ол','ор','ур', 'ир',  'ин', 'ис', 'ас', 'ус', 'ель', 'ант', 'иф','аф', 'ез', 'ак', 'ул', 'ол', 'ель', 'ум', 'ам', 'ем', 'арис','урис', 'орис', 'арн','орн', 'азор', 'езор', 'изор'];
    let word = generateBaseWord(2, 4, seed);

    return word + procedural.randomFromArray(endings);
}

export function generatePopulationName(root: string, seed: number) {
    const ending = 'анци';
    const word = root || generateBaseWord(2, 4, seed);

    if (!root && procedural.randomInt(1, 10) < 5) {
        return word + 'ы';
    }

    if (vowels.includes(word[word.length - 1])) {
        return word.slice(0, -1) + ending;
    }

    return word + 'і'+ ending;
}

export function generateGroup(seed: number) {
    const ending = ['исты', 'иты'];
    let word = generateBaseWord(2, 4, seed);

    return word + procedural.randomFromArray(ending);
}

export function generateName(seed: number, isFemale = false) {
    const maleEndings = ['ев', 'ин', 'ой', 'ер', 'ан', 'ин', 'ир', 'ур', 'ас', 'ус', 'ель', 'ам', 'ом', 'он', 'ил', 'ал', 'ел'];
    const femaleEndings = ['ева', 'іна', 'ая', 'я', 'ия', 'ра', 'ана', 'ина', 'ира', 'ура', 'аса', 'иса', 'ель', 'ама', 'ома', 'она', 'ила', 'ала', 'ела'];

    let word = generateBaseWord(2, 3, seed);

    let ending = isFemale ? procedural.randomFromArray(femaleEndings) : procedural.randomFromArray(maleEndings);

    return word + ending;
}