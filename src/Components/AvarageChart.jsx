import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const AverageTemperatureHumidityChart = ({ data, averageStartDate, averageEndDate }) => {
    // Hàm tính toán nhiệt độ và độ ẩm trung bình
    const calculateAverages = () => {
        const averages = {};
        let totalTemperature = 0;
        let totalHumidity = 0;
        let totalCount = 0;

        data.forEach(record => {
            const recordDate = new Date(record.timestamp);
            // Kiểm tra xem dữ liệu có nằm trong khoảng thời gian trung bình không
            if (averageStartDate && averageEndDate) {
                const startDate = new Date(averageStartDate);
                const endDate = new Date(averageEndDate);
                if (recordDate < startDate || recordDate > endDate) {
                    return; // Bỏ qua nếu không nằm trong khoảng thời gian
                }
            }

            totalTemperature += record.temperature;
            totalHumidity += record.humidity;
            totalCount += 1; // Tăng số lượng bản ghi
        });

        // Tính toán giá trị trung bình
        const averageTemperature = totalCount > 0 ? (totalTemperature / totalCount).toFixed(1) : 0;
        const averageHumidity = totalCount > 0 ? (totalHumidity / totalCount).toFixed(1) : 0;

        return [{
            date: 'Average',
            temperature: averageTemperature,
            humidity: averageHumidity,
        }];
    };

    const averageData = calculateAverages();

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={averageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="temperature" fill="#ff7300" />
                <Bar dataKey="humidity" fill="#3e95cd" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default AverageTemperatureHumidityChart;