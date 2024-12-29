import Header from '../Components/Header';
import SensorCard from "../Components/SensorCard";
import { useState, useEffect } from "react";
import React from "react";
import HistoricalChart from "../Components/HistoricalChart";
import { io } from 'socket.io-client'; // Import Socket.IO client

export default function Home() {
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [allData, setAllData] = useState([]);

    const fetchSensorData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/sensor-data'); // API để lấy dữ liệu cảm biến
            const data = await response.json();
            setAllData(data);
            if (data.length > 0) {
                const latestData = data[0]; // Lấy dữ liệu mới nhất
                setTemperature(latestData.temperature);
                setHumidity(latestData.humidity);
            }
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    };

    useEffect(() => {
        // Lấy dữ liệu ban đầu từ API
        fetchSensorData();

        // Kết nối đến Socket.IO
        const socket = io('http://localhost:3000'); // Kết nối đến server Socket.IO

        // Lắng nghe sự kiện newSensorData
        socket.on('newSensorData', (data) => {
            setAllData((prevData) => [data, ...prevData]); // Cập nhật dữ liệu mới vào danh sách
            setTemperature(data.temperature); // Cập nhật nhiệt độ mới
            setHumidity(data.humidity); // Cập nhật độ ẩm mới
        });

        // Dọn dẹp khi component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    console.log("Current Temperature:", temperature);
    console.log("Current Humidity:", humidity);
    console.log("All Data:", allData);

    return (
        <div className="p-4 flex flex-col gap-5">
            <Header />
            <SensorCard
                title="Temperature"
                value={temperature}
                unit="°C"
                icon="temperature-high"
                color="hot"
                threshold={{ min: 20, max: 25 }}
                historicalData={allData.map(data => ({ time: new Date(data.timestamp).toLocaleString(), value: data.temperature }))}
                onCardClick={() => console.log('Temperature Card clicked')}
                alertMode={true}
                loading={true}
                showChart={true}
            />
            <SensorCard
                title="Humidity"
                value={humidity}
                unit="%"
                icon="water"
                color="blue"
                threshold={{ min: 20, max: 80 }}
                historicalData={allData.map(data => ({ time: new Date(data.timestamp).toLocaleString(), value: data.humidity }))}
                onCardClick={() => console.log('Humidity Card clicked')}
                alertMode={true}
                loading={true}
                showChart={true}
            />
            <HistoricalChart
                data={allData.map(data => ({ timestamp: new Date(data.timestamp).toLocaleString(), temperature: data.temperature, humidity: data.humidity }))}
                title="Temperature & Humidity History"
                metrics={['temperature', 'humidity']}
                timeRange="24h"
                height={400}
            />
        </div>
    );
}