// SensorCard.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import '@fortawesome/fontawesome-free/css/all.css';

export default function SensorCard({
                                       title = "Temperature",
                                       value,
                                       unit = "°C",
                                       icon = "temperature-high",
                                       color = "blue",
                                       lastUpdate = "2 mins ago",
                                       trend = "up",
                                       loading = false,
                                       threshold = { min: 20, max: 30 },
                                       historicalData = [],
                                       onCardClick,
                                       showChart = true,
                                       alertMode = false
                                   }) {
    const [isHovered, setIsHovered] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const numValue = parseFloat(value);
        // Luôn hiển thị cảnh báo nếu giá trị nằm ngoài ngưỡng
        if (numValue > threshold.max || numValue < threshold.min) {
            setShowAlert(true);
        } else {
            setShowAlert(false); // Ẩn cảnh báo nếu giá trị trong ngưỡng
        }
    }, [value, threshold.max, threshold.min]);

    const getStatusColor = () => {
        if (trend === "up") return "text-red-500";
        if (trend === "down") return "text-green-500";
        return "text-gray-500";
    };

    const getValueColor = () => {
        const numValue = parseFloat(value);
        if (numValue > threshold.max) return "text-red-600"; // Cảnh báo nếu vượt ngưỡng tối đa
        if (numValue < threshold.min) return "text-blue-600"; // Cảnh báo nếu dưới ngưỡng tối thiểu
        return `text-${color}-600`;
    };

    const LoadingSpinner = () => (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
    );

    return (
        <div
            className={`
        bg-white rounded-xl shadow-lg p-6 
        ${isHovered ? 'shadow-xl' : 'shadow-md'} 
        transition-all duration-300
        ${alertMode ? 'border-2 border-red-500' : ''}
        cursor-pointer
      `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onCardClick}
        >
            {showAlert && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-4 rounded">
                    <p className="text-sm">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        Value outside normal range!
                    </p>
                </div>
            )}

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium flex items-center">
                        {title}
                        {loading && <LoadingSpinner />}
                    </h3>
                    <div className="flex items-center mt-1">
                        <span className={`text-3xl font-bold ${getValueColor()}`}>
                            {value}
                        </span>
                        <span className="text-gray-500 ml-1">{unit}</span>
                    </div>
                </div>
                <div className={`text-${color}-500 text-2xl`}>
                    <i className={`fas fa-${icon} ${alertMode ? 'animate-pulse' : ''}`}></i>
                </div>
            </div>

            {showChart && (
                <div className="mt-4 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={`#${color === 'blue' ? '3B82F6' : '10B981'}`}
                                strokeWidth={2}
                                dot={false}
                            />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {isHovered && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                        <div>Range: {threshold.min}{unit} - {threshold.max}{unit}</div>
                        <div>Sensor ID: sensor_01</div>
                    </div>
                </div>
            )}
        </div>
    );
}