// HistoryPage.js
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import HistoricalChart from "../Components/HistoricalChart";
import axios from 'axios';
export default function HistoryPage() {
    const [timeRange, setTimeRange] = useState('24h');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [view, setView] = useState('chart'); // 'chart' or 'table'
    const fetchData = async () => {
        try{
            const response= await axios.get("http://localhost:3000/api/sensor-data");
            const data=response.data;
            setData(data);
        } catch (e){
            console.error(e);
        }

    }

    // Giả lập dữ liệu - thay thế bằng API call thực tế
    useEffect(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            fetchData()
            setLoading(false);
        }, 1000);
    }, [timeRange, startDate, endDate]);



    const timeRangeOptions = [
        { value: '24h', label: 'Last 24 Hours' },
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: 'custom', label: 'Custom Range' }
    ];

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Sensor History</h1>
                    <p className="text-gray-600">View historical temperature and humidity data</p>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time Range
                        </label>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                            {timeRangeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {timeRange === 'custom' && (
                        <>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            View
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setView('chart')}
                                className={`px-4 py-2 rounded ${
                                    view === 'chart'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                                Chart
                            </button>
                            <button
                                onClick={() => setView('table')}
                                className={`px-4 py-2 rounded ${
                                    view === 'table'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                                Table
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Data Display */}
                {!loading && (
                    <>
                        {view === 'chart' ? (
                            <HistoricalChart
                                data={data}
                                title="Temperature & Humidity History"
                                metrics={['temperature', 'humidity']}
                                timeRange={timeRange}
                                height={400}
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Temperature (°C)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Humidity (%)
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((record, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {format(new Date(record.timestamp), 'yyyy-MM-dd HH:mm')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {record.temperature.toFixed(1)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {record.humidity.toFixed(1)}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}