interface IBuilding {
    key: string;
    name: string;
    type: string;
}

export class Building implements IBuilding {
    key: string;
    name: string;
    type: string;

    constructor(props: IBuilding) {
        this.key = props.key;
        this.name = props.name;
        this.type = props.type;
    }
}

export const buildings = new Map<string, Building>();

const baseWaterExtractor = new Building({
    key: 'baseWaterExtractor',
    name: 'Простой добытчик воды',
    type: 'extraction'
});
buildings.set('baseWaterExtractor', baseWaterExtractor);

const algalOxygenator = new Building({
    key: 'algalOxygenator',
    name: 'Водорослевый оксигенератор',
    type: 'air'
});
buildings.set('algalOxygenator', algalOxygenator);

const baseHydroponicFarm = new Building({
    key: 'baseHydroponicFarm',
    name: 'Простая гидропонная ферма',
    type: 'food'
});
buildings.set('baseHydroponicFarm', baseHydroponicFarm);

const simpleMine = new Building({
    key: 'simpleMine',
    name: 'Простая шахта',
    type: 'extraction'
});
buildings.set('simpleMine', simpleMine);

const simpleWorkshop = new Building({
    key: 'simpleWorkshop',
    name: 'Простая мастерская',
    type: 'extraction'
});
buildings.set('simpleWorkshop', simpleWorkshop);