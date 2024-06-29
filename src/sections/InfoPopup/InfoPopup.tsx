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
    const [data, setData] = useState<IInfoPopup>({
        title: 'Test',
        message: 'Test message'
    });

    useEffect(() => {
        // @ts-ignore
        window.addEventListener('infoPopup', ({ detail }: CustomEvent<IInfoPopup>) => {
            setData(detail);
        });
    }, []);

    const onClose = () => {
        setData(null as unknown as IInfoPopup);
    }


    return data ? (
        <aside className={'info-popup'}>
            <h3 className={'title'}>{data.title}</h3>
            <p>{data.message}</p>

            <div>
                {
                    data.actions?.map((action) => (
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