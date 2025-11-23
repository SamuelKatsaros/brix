'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
    { name: "Jan", total: 4500 },
    { name: "Feb", total: 3200 },
    { name: "Mar", total: 5800 },
    { name: "Apr", total: 4100 },
    { name: "May", total: 4800 },
    { name: "Jun", total: 3900 },
    { name: "Jul", total: 5200 },
    { name: "Aug", total: 4300 },
    { name: "Sep", total: 6100 },
    { name: "Oct", total: 5400 },
    { name: "Nov", total: 4900 },
    { name: "Dec", total: 5100 },
];

export function SpendChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Maintenance Spend Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
