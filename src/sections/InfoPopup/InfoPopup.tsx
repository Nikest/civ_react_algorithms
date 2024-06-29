import React, { useEffect, useState } from 'react';

interface IInfoPopup {
    title: string;
    message: string;
    actions?: Array<{ text: string, function: () => void }>
}

export const InfoPopupInterface = (detail: IInfoPopup) => {
    window.dispatchEvent(new CustomEvent('infoPopup', { detail }));
}

export const InfoPopup = () => {
    const [data, setData] = useState<IInfoPopup[]>([]);

    useEffect(() => {
        // @ts-ignore
        window.addEventListener('infoPopup', ({ detail }: CustomEvent<IInfoPopup>) => {
            const newDataArr = [...data];
            newDataArr.push(detail);
            setData(newDataArr);
        });
    }, []);

    const onClose = () => {
        const newDataArr = [...data];
        newDataArr.shift();
        setData(newDataArr);
    }

    return data.length > 0 ? (
        <aside className={'info-popup'}>
            <h3 className={'title'}>{data[0].title}</h3>
            <p>{data[0].message}</p>

            <div>
                {
                    data[0].actions?.map((action) => (
                        <button onClick={() => {
                            action.function();
                            onClose();
                        }}>{action.text}</button>
                    ))
                }
                <button onClick={onClose}>Закрыть</button>
            </div>
        </aside>
    ) : null;
}