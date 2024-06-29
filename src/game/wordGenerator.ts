import { Procedural } from './Procedural';

const procedural = new Procedural(123);

let consonants = 'ббббввввггггдддджзззззйккккллллммммннннппппррррссссттттббббввввггггдддджзззззйккккллллммммннннппппррррссссттттффххххцчш'.split('');
consonants = [
    ...consonants,
    ...['бв','вг','вн','гд','дж','дз','зв','вз','кр','кв','лн','мн','пр','пс','ст','тс','зт','зм','зн','нз','мз','кх','дх','пх','мх','мр','бх',].flatMap((c) => Array(2).fill(c)),
    ...['бьй','вьй','дьй','ньй','ньй','кьй','хьй',]
]
let vowels = 'ааооааооуиииеееааооааооуиииеееааооааооуиииеееааооааооуиииеееааооааооуиииеееааооааооуиииеееааооааооуиииеееааооааооуиииеее'.split('');
vowels = [...vowels, ...['ао','ау','оа','оу','иу',]]

function generatePattern(minLength: number) {
    let pattern = [procedural.randomInt(0, 1)];

    for (let i = 1; i < minLength; i++) {
        let last = pattern[i - 1];

        pattern.push(last === 0 ? 1 : 0);
    }

    if (pattern[pattern.length - 1] === 0) {
        pattern.push(1);
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

    word.replace('пд', 'п');
    word.replace('дп', 'д');
    word.replace('пб', 'п');
    word.replace('бп', 'б');

    word.replace('тд', 'т');
    word.replace('дт', 'д');

    word.replace('йа', 'я');
    word.replace('йу', 'ю');
    word.replace('йе', 'е');

    word.replace(/п$/, procedural.randomFromArray('бвгнрмдкст'.split('')));

    return word;
}

export function generateCityName(seed: number) {
    const endings = ['ар', 'арда', 'айя', 'он', 'ион', 'еон', 'увім', 'инен', 'ос', 'ус', 'ея', 'ия', 'ан','ал','апал', 'ен', 'ир', 'ур', 'ис', 'ас', 'ель', 'ант', 'иф', 'ез', 'ак', 'ул', 'ол', 'ель', 'аль', 'ор', 'ир', 'ум', 'ам', 'ем'];
    const endV = ['а','у','и','о'];
    const endC = ['б','в','д','к','л','м','н','п','р','с','т'];
    const endE = ['ар','ир','ур','ан','ин','ас','ис','ус','иф','еф','аф','я', 'ия', 'ая', 'оя', 'ея'];

    let word = generateBaseWord(1, 3, seed);

    return word + `${procedural.randomFromArray(endV)}${procedural.randomFromArray(endC)}${ procedural.randomInt(0, 10) > 5 ? procedural.randomFromArray(endE) : ''}`;
}

export function generatePlanetName(seed: number) {
    const endings = ['ия','ая','оя', 'он','ол','ор','ур', 'ир', 'ин', 'ис', 'ас', 'ус', 'ель', 'ант', 'иф','аф', 'ез', 'ак', 'ул', 'ол', 'ель', 'ут', 'ат', 'ет','ухт', 'ахт', 'ехт', 'арис','урис', 'орис', 'арн','орн', 'азор', 'езор', 'изор'];
    let word = generateBaseWord(1, 4, seed);

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
    const maleV = ['б','в','д','к','л','н','р','с','т'];
    const maleC = ['а','о','у','и','е'];
    const femaleC = ['а','а','а', 'и', 'ая', 'ия', 'ея'];

    let word = generateBaseWord(1, 2, seed);

    let ending = `${procedural.randomFromArray(maleC)}${procedural.randomFromArray(maleV)}${isFemale ? procedural.randomFromArray(femaleC) : ''}`

    return word + ending;
}