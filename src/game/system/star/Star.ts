import { lerpRounded, IFrequency, calculateInFrequency, numFixed } from '../../utils';
import { solarProps } from '../SpaceUtils';
import { SpaceBody } from '../SpaceBody';
// @ts-ignore
import KtRGB from 'kelvin-to-rgb';

export type TStarType = 'M' | 'G' | 'K' | 'F' | 'A' | 'B' | 'O';
export type TStarTemperatureZones = [number, number, number, number];
export type TStarTemperatureZoneIndex = 0 | 1 | 2 | 3 | 4 ;
const StarTypeFreq: IFrequency<TStarType> = {
    M: 65, // 65
    K: 15, // 80
    G: 10, // 90
    F: 6, // 96
    A: 2, // 98
    B: 1, // 99
    O: 1, // 100
};

const planets = {
    M: [1, 4],
    K: [2, 5],
    G: [3, 7],
    F: [4, 8],
    A: [5, 8],
    B: [5, 10],
    O: [5, 10]
}

const masses = {
    M: [0.08, 0.57],
    K: [0.58, 0.82],
    G: [0.82, 1.05],
    F: [1.06, 1.61],
    A: [1.62, 2.18],
    B: [2.19, 17.7],
    O: [17.8, 97],
}

const radius = {
    M: [0.1, 0.58],
    K: [0.59, 0.8],
    G: [0.78, 1.07],
    F: [1.1, 1.72],
    A: [1.75, 2.15],
    B: [2.2, 7.16],
    O: [7.2, 15],
}

const temperatures = {
    M: [2380, 3850],
    K: [3900, 5320],
    G: [5380, 5930],
    F: [6020, 7220],
    A: [7300, 9700],
    B: [10000, 31400],
    O: [32300, 44900],
}

const luminosities = {
    M: [0.0015, 0.075],
    K: [0.08, 0.4],
    G: [0.4, 1.3],
    F: [1.4, 7.24],
    A: [7.8, 38.02],
    B: [40.1, 446.68],
    O: [450, 1400],
}

export class Star extends SpaceBody {
    type: TStarType;
    yerkesType: number;

    planets: number = 0;

    // ui description parameters
    typeFullText: string;
    colorRGB: string = 'rgb(0,0,0)';

    // physics parameters
    temperature: number;
    luminosity: number;
    temperatureZones: TStarTemperatureZones = [0, 0, 0, 0]; // in AU

    constructor(seed: number) {
        super(seed);

        this.className = 'star';

        const type = calculateInFrequency<TStarType>(StarTypeFreq, this.rand.randomFloat(0, 100));
        this.type = type;

        const yerkesRawType = this.rand.randomFloat(0, 1000);
        this.yerkesType = Math.floor(10 - (yerkesRawType / 100));

        this.typeFullText = `${this.type}${this.yerkesType}V`;
        console.log('type', type);
        // calculating physics parameters
        this.mass = lerpRounded(masses[type][0], masses[type][1], yerkesRawType / 1000, 2);
        this.radius = lerpRounded(radius[type][0], radius[type][1], yerkesRawType / 1000, 2);
        this.temperature = lerpRounded(temperatures[type][0], temperatures[type][1], yerkesRawType / 1000);
        this.luminosity = lerpRounded(luminosities[type][0], luminosities[type][1], yerkesRawType / 1000, 2);

        this.temperatureZones = [
            numFixed(Math.sqrt(this.luminosity * 0.35), 2),
            numFixed(Math.sqrt(this.luminosity * 2.5), 2),
            numFixed(Math.sqrt(this.luminosity * 32), 2),
            numFixed(Math.sqrt(this.luminosity * 140), 2),
        ];

        // calculating additional parameters
        this.colorRGB = `rgb(${KtRGB(this.temperature).join(',')})`;
        this.planets = this.rand.randomInt(planets[type][0], planets[type][1]);
    }
}