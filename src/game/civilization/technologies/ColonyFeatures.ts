interface IColonyFeature {
    type: string;
    name: string;
    key: string;
    effects: unknown[];
}

export class ColonyFeature implements IColonyFeature {
    type: string;
    name: string;
    key: string;

    effects: unknown[];

    constructor(props: IColonyFeature) {
        this.key = props.key;
        this.name = props.name;
        this.type = props.type;

        this.effects = props.effects;
    }
}

export const colonyFeatures = new Map<string, ColonyFeature>();

const outpostLiving = new ColonyFeature({
    key: 'outpostLiving',
    name: 'Жилой аванпост',
    type: '',
    effects: [{ maxPopulation: { multiple: 15 } }],
});
colonyFeatures.set('outpostLiving', outpostLiving);

const districtAllowed = new ColonyFeature({
    key: 'districtAllowed',
    name: 'Постройка районов',
    type: '',
    effects: [{ districtBuildAllowed: true }],
});
colonyFeatures.set('districtAllowed', districtAllowed);