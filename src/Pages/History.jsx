import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import HistoricalChart from "../Components/HistoricalChart";
import AverageTemperatureHumidityChart from "../Components/AvarageChart"; // Import the new chart component
import axios from 'axios';

export default function HistoryPage() {
    const [historicalTimeRange, setHistoricalTimeRange] = useState('24h'); // Time range for historical chart
    const [averageTimeRange, setAverageTimeRange] = useState('30d'); // Time range for average chart
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // State for filtered data
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [averageStartDate, setAverageStartDate] = useState(''); // Start date for average chart
    const [averageEndDate, setAverageEndDate] = useState(''); // End date for average chart
    const [view, setView] = useState('chart'); // 'chart' or 'table'

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/sensor-data");
            const data = response.data;
            setData(data);
            filterData(data); // Filter data after fetching
        } catch (e) {
            console.error(e);
        }
    };

    const filterData = (data) => {
        let filtered = data;

        // Filter based on historicalTimeRange
        const now = new Date();
        if (historicalTimeRange === '24h') {
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            filtered = data.filter(record => new Date(record.timestamp) >= yesterday);
        } else if (historicalTimeRange === '7d') {
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = data.filter(record => new Date(record.timestamp) >= sevenDaysAgo);
        } else if (historicalTimeRange === '30d') {
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filtered = data.filter(record => new Date(record.timestamp) >= thirtyDaysAgo);
        } else if (historicalTimeRange === 'custom' && startDate && endDate) {
            filtered = data.filter(record => {
                const recordDate = new Date(record.timestamp);
                return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
            });
        }

        setFilteredData(filtered); // Update the filtered data state
    };

    const filterAverageData = (data) => {
        let averageFiltered = data;

        // Filter based on averageTimeRange
        const now = new Date();
        if (averageTimeRange === '7d') {
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            averageFiltered = data.filter(record => new Date(record.timestamp) >= sevenDaysAgo);
        } else if (averageTimeRange === '30d') {
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            averageFiltered = data.filter(record => new Date(record.timestamp) >= thirtyDaysAgo);
        } else if (averageTimeRange === 'custom' && averageStartDate && averageEndDate) {
            averageFiltered = data.filter(record => {
                const recordDate = new Date(record.timestamp);
                return recordDate >= new Date(averageStartDate) && recordDate <= new Date(averageEndDate);
            });
        }

        return averageFiltered; // Return the filtered average data
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
        setLoading(false);
    }, []);

    useEffect(() => {
        filterData(data); // Re-filter data when historicalTimeRange or dates change
    }, [historicalTimeRange, startDate, endDate, data]);

    const timeRangeOptions = [
        { value: '24h', label: 'Last 24 Hours' },
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: 'custom', label: 'Custom Range' }
    ];

    const averageTimeRangeOptions = [
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: 'custom', label: 'Custom Range' }
    ];

    return (
        <div className="container mx-auto p-4 flex flex-col gap-5">
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
                            Historical Time Range
                        </label>
                        <select
                            value={historicalTimeRange}
                            onChange={(e) => setHistoricalTimeRange(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                            {timeRangeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {historicalTimeRange === 'custom' && (
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
                            <>
                                <HistoricalChart
                                    data={filteredData} // Use filtered data
                                    title="Temperature & Humidity History"
                                    metrics={['temperature', 'humidity']}
                                    timeRange={historicalTimeRange} // Use historical time range
                                    height={400}
                                />

                                <div className="text-2xl font-bold text-gray-800">Average chart:</div>
                                {/* Average Time Range Control */}
                                <div className="flex flex-wrap gap-4 mb-6">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Average Time Range
                                        </label>
                                        <select
                                            value={averageTimeRange}
                                            onChange={(e) => setAverageTimeRange(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            {averageTimeRangeOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Custom Date Range for Average Chart */}
                                {averageTimeRange === 'custom' && (
                                    <div className="flex flex-wrap gap-4 mb-6">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Average Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={averageStartDate}
                                                onChange={(e) => setAverageStartDate(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Average End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={averageEndDate}
                                                onChange={(e) => setAverageEndDate(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                )}

                                <AverageTemperatureHumidityChart
                                    data={filterAverageData(data)} // Use original data for average
                                    timeRange={averageTimeRange === '30d' ? 'month' : 'day'} // Adjust time range for averages
                                    averageStartDate={averageStartDate} // Pass custom start date
                                    averageEndDate={averageEndDate} // Pass custom end date
                                />
                            </>
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
                                    {filteredData.map((record, index) => (
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