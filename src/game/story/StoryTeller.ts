import * as utils from '../utils';

interface IFirstColonyEstablish {
    starName: string;
    planetName: string;
    colonyName: string;
    captainName: string;
    captainSurname: string;
    captainIsFemale: boolean;
}
export function firstColonyEstablish(props: IFirstColonyEstablish) {
    return `
    У нас получилось! Капитан ${utils.capitalizeFirstLetter(props.captainName)} ${utils.capitalizeFirstLetter(props.captainSurname)} смотрит сквозь иллюминаторы орбитальной станции на улетающие шатлы с модулями для развертывания первого аванпоста человечества в системе звезды ${utils.capitalizeFirstLetter(props.starName)}.
    Планета ${utils.capitalizeFirstLetter(props.planetName)} станет новым домом для человечества. Аванпост под названием ${utils.capitalizeFirstLetter(props.colonyName)} уже готов к приему первых поселенцев.
    `;
}