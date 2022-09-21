import React from 'react';
import { ResponsiveContainer, Tooltip, Treemap } from 'recharts';
import { COLORS } from '../constants';
import { useWindowSize } from '../hooks';
import { UpdatedOn } from './UpdatedOn';

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
    name: string;
    size: string;
}

export const ZonesTreeMap = ({
    zonesData,
}: {
    zonesData: {
        name: string;
        size: number;
    }[];
}) => {
    const { width } = useWindowSize();

    return (
        <div className="w-full h-[700px] md:w-[80%] md:h-[700px] mb-10">
            <ResponsiveContainer>
                <Treemap
                    isAnimationActive={false}
                    nameKey="name"
                    data={zonesData}
                    dataKey="size"
                    aspectRatio={width && width < 768 ? 1 / 2 : 4 / 3}
                    stroke="#fff"
                    fill="#8884d8"
                    content={<CustomizedContent colors={COLORS} />}
                >
                    <Tooltip
                        labelFormatter={(name) => name}
                        labelStyle={{
                            color: '#000',
                        }}
                    />
                </Treemap>
            </ResponsiveContainer>
            <UpdatedOn />
        </div>
    );
};

const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, colors, name, size } =
        props as CustomizedContentProps;

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
                    {name}
                </text>
            ) : null}
            {depth === 1 ? (
                <text
                    className="font-light text-xs"
                    x={x + 4}
                    y={y + 18}
                    fill="#fff"
                    fontSize={16}
                    fillOpacity={0.9}
                >
                    {size}
                </text>
            ) : null}
        </g>
    );
};
