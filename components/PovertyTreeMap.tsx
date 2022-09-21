import React from 'react';
import { ResponsiveContainer, Tooltip, Treemap } from 'recharts';
import { SECONDARY_COLORS } from '../constants';
import { useWindowSize } from '../hooks';
import { Poverty } from '../types';

interface CustomizedContentProps {
    root: any;
    depth: number;
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
    payload: any;
    colors: string[];
    rank: number;
    Age: string;
    Gender: string;
    ['Poverty Population']: number;
}

export const PovertyTreeMap = ({ poverty }: { poverty: Poverty }) => {
    const { width } = useWindowSize();

    return (
        <div className="w-full h-[700px] md:w-[80%] md:h-[700px] mb-10">
            <ResponsiveContainer>
                <Treemap
                    nameKey="Gender"
                    data={poverty.data}
                    dataKey="Poverty Population"
                    aspectRatio={width && width < 768 ? 1 : 4 / 3}
                    stroke="#fff"
                    fill="#8884d8"
                    content={<CustomizedContent colors={SECONDARY_COLORS} />}
                >
                    <Tooltip
                        labelFormatter={(name) => name}
                        labelStyle={{
                            color: '#000',
                        }}
                    />
                </Treemap>
            </ResponsiveContainer>

            <p className="text-xs mt-5">
                Data from the {poverty.source[0].annotations.source_name}-
                {poverty.source[0].annotations.dataset_name}{' '}
                {poverty.data[0].Year}
            </p>
        </div>
    );
};

const CustomizedContent = (props: any) => {
    const {
        root,
        depth,
        x,
        y,
        width,
        height,
        index,
        colors,
        Age: age,
        Gender: gender,
        ['Poverty Population']: population,
    } = props as CustomizedContentProps;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill:
                        depth < 2
                            ? colors[
                                  Math.floor((index / root.children.length) * 6)
                              ]
                            : 'none',
                    stroke: '#fff',
                    strokeWidth: 1 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            {depth === 1 ? (
                <text
                    className="text-sm font-thin"
                    x={x + width / 2}
                    y={y + height / 2 + 7}
                    textAnchor="middle"
                    fill="#fff"
                >
                    {gender}
                </text>
            ) : null}
            {depth === 1 ? (
                <text
                    className="font-light text-[10px] md:text-xs break-words"
                    x={x + 4}
                    y={y + 18}
                    fill="#fff"
                    fillOpacity={0.9}
                >
                    {age}
                </text>
            ) : null}
            {depth === 1 ? (
                <text
                    className="font-light text-[10px] md:text-xs break-words"
                    x={x + 4}
                    y={y + 35}
                    fill="#fff"
                    fillOpacity={0.9}
                >
                    {population}
                </text>
            ) : null}
        </g>
    );
};
