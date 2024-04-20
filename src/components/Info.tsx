import React from 'react';

interface Info {
    key: string;
    value: string | number;
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
                    <React.Fragment key={info.value}>
                        <span className={'info-key'}>{info.key}</span>
                        <span className={'info-value'}>{info.value}</span>
                    </React.Fragment>
                ))}
            </div>
        </>
    );
}