import React from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Regions } from '../types';
import { UpdatedOn } from './UpdatedOn';

export const AreaChartPR = ({ regions }: { regions?: Regions[] }) => {
    return (
        <div className="w-full h-[200px] md:w-2/3 md:h-[500px] mb-10">
            <ResponsiveContainer>
                <AreaChart
                    data={regions}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 20,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis stroke="white" dataKey="name" />
                    <YAxis stroke="white" />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="totalClients"
                        name="Total Clients / Clientes Totales"
                        stroke="#CA4E79"
                        fill="#CA4E79"
                    />
                    <Area
                        type="monotone"
                        dataKey="totalClientsWithoutService"
                        name="Without Service / Sin Servicio"
                        stroke="#FF4A4A"
                        fill="#FF4A4A"
                    />
                </AreaChart>
            </ResponsiveContainer>
            <UpdatedOn />
        </div>
    );
};
