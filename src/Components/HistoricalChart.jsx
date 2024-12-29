import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export default function HistoricalChart({data, title, metrics, timeRange, height}) {
    const [selectedMetrics, setSelectedMetrics] = useState(metrics);

    const colors = {
        temperature: '#FF6B6B',
        humidity: '#4ECDC4'
    };

    const units = {
        Temperature: '°C',
        Humidity: '%'
    };

    const formatXAxis = (tickItem) => {
        return new Date(tickItem).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleMetric = (metric) => {
        if (selectedMetrics.includes(metric)) {
            setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
        } else {
            setSelectedMetrics([...selectedMetrics, metric]);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
                <div className="flex gap-2">
                    {metrics.map(metric => (
                        <button
                            key={metric}
                            onClick={() => toggleMetric(metric)}
                            className={`px-3 py-1 rounded-full text-sm ${
                                selectedMetrics.includes(metric)
                                    ? `bg-${colors[metric].slice(1)} text-white`
                                    : 'bg-gray-200 text-gray-600'
                            }`}
                            style={{
                                backgroundColor: selectedMetrics.includes(metric)
                                    ? colors[metric]
                                    : undefined
                            }}
                        >
                            {metric.charAt(0).toUpperCase() + metric.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ height: `${height}px` }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={formatXAxis}
                        />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                            formatter={(value, name) => [
                                `${value} ${units[name]}`,
                                name.charAt(0).toUpperCase() + name.slice(1)
                            ]}
                        />
                        <Legend />
                        {selectedMetrics.includes('temperature') && (
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="temperature"
                                stroke={colors.temperature}
                                strokeWidth={2}
                                dot={false}
                                name="Temperature"
                            />
                        )}
                        {selectedMetrics.includes('humidity') && (
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="humidity"
                                stroke={colors.humidity}
                                strokeWidth={2}
                                dot={false}
                                name="Humidity"
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}