export interface IBackground {
    description: string;
    colonistsRange: number[];
}

export const backgroundVariants: IBackground[] = [
    {
        description: 'Черная дыра разрушает Солнечную систему. Населены, Земля, Марс и Луна. Человечество разобщено. Марс создает колониальный флот',
        colonistsRange: [40000, 50000]
    }, {
        description: 'Черная дыра разрушает Солнечную систему. Населены, Земля и Луна. Человечество разобщено. Корпорации создают колониальный флот',
        colonistsRange: [60000, 70000]
    }, {
        description: 'Черная дыра разрушает Солнечную систему. Населены, Земля, Марс и Луна. Человечество объединилось для создания колониального флота',
        colonistsRange: [120000, 170000]
    }, {
        description: 'Черная дыра разрушает Солнечную систему. Населены, Земля, Марс, Луна и Венера. Корпорации и государства создают колониальный флот',
        colonistsRange: [280000, 300000]
    }, {
        description: 'Черная дыра разрушает Солнечную систему. Населены, Земля, Марс, Луна и Венера. Корпорации создают колониальный флот',
        colonistsRange: [200000, 250000]
    }, {
        description: 'Черная дыра разрушает Солнечную систему. Населены, Земля, Марс, Луна и Венера. Государства создают колониальный флот',
        colonistsRange: [180000, 220000]
    },
];