import React from 'react';

interface Info {
    key: string;
    value: string | number | Info[];
}

interface InfoProps {
    data: Info[];
    children?: React.ReactNode;
}
export const Info = ({ data, children }: InfoProps) => {
    return (
        <>
            {children}
            <div className={'info-wrap'}>
                {data.map((info, index) => (
                    <React.Fragment key={JSON.stringify(info.value) + index}>
                        <span className={'info-key'}>{info.key}</span>
                        {
                            typeof info.value !== 'object' && <span className={'info-value'}>{info.value}</span>
                        }
                        {
                            typeof info.value === 'object' && <Info data={info.value} />
                        }
                    </React.Fragment>
                ))}
            </div>
        </>
    );
}