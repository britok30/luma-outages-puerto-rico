import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { WAGE_COLORS } from '../constants';
import { Wages } from '../types';

export const WageBarChart = ({ wages }: { wages: Wages }) => {
    return (
        <div className="w-full h-[200px] md:w-3/4 md:h-[500px] mb-10">
            <ResponsiveContainer>
                <BarChart
                    data={wages.data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Wage Bin" stroke="#FFC4C4" />
                    <YAxis
                        dataKey="Total Population"
                        yAxisId="left"
                        orientation="left"
                        stroke="#EE6983"
                    />
                    <Tooltip
                        cursor={false}
                        itemStyle={{
                            color: '#EE6983',
                        }}
                    />

                    <Bar
                        yAxisId="left"
                        dataKey="Total Population"
                        fill="#82ca9d"
                    >
                        {wages.data?.map((_, index) => (
                            <Cell
                                key={index}
                                fill={WAGE_COLORS[index % WAGE_COLORS.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <p className="text-xs">
                Data from the {wages.source[0].annotations.source_name}-
                {wages.source[0].annotations.dataset_name} {wages.data[0].Year}
            </p>
        </div>
    );
};
