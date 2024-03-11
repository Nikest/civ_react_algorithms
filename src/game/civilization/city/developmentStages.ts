export interface IDevelopmentStage {
    prevType: string;
    type: string;
    nextType: string;
    description: string;
    transitionForNextStage: {
        goalDescription: string;
        buildings: string[];
        technologies: string[];
    }
}

export const developmentStages: IDevelopmentStage[] = [
    {
        prevType: 'none',
        type: 'outpost',
        nextType: 'settlement',
        description: 'Аванпост - это первый этап развития колонии. Он представляет собой небольшую группу зданий. Еда, вода и кислород пополняются из внешних источников',
        transitionForNextStage: {
            goalDescription: 'Для того, чтобы аванпост стал полноценным поселением необходимо наладить добычу базовых ресурсов и обеспечить колонистов пищей и водой.',
            buildings: ['farm', 'waterExtractor', 'waterPurifier', 'oxyStation'],
            technologies: ['agriculture']
        },
    }
];