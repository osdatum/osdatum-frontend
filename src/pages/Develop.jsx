import React, { useState, useEffect } from "react";
import { Line, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
} from "chart.js";
import annotationPlugin from 'chartjs-plugin-annotation';
import HeatMap from "react-heatmap-grid";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  annotationPlugin
);

const Develop = () => {
  // Data pasut
  const [tideData, setTideData] = useState([
    { time: "00:00", height: 120 },
    { time: "06:00", height: 200 },
    { time: "12:00", height: 140 },
    { time: "18:00", height: 180 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTideData(prev => {
        // Buat data baru dengan waktu dan tinggi acak
        const last = prev[prev.length - 1];
        // Tambah 15 detik ke waktu terakhir
        const [h, m] = last.time.split(":").map(Number);
        let s = 0;
        if (last.time.length > 5) s = Number(last.time.split(":")[2]);
        let totalSec = h * 3600 + m * 60 + s + 15;
        let nh = Math.floor(totalSec / 3600) % 24;
        let nm = Math.floor((totalSec % 3600) / 60);
        let ns = totalSec % 60;
        const newTime = `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}:${String(ns).padStart(2, "0")}`;
        // Dummy tinggi pasut: random antara 120-200
        const newHeight = 120 + Math.round(Math.random() * 80);
        return [...prev, { time: newTime, height: newHeight }];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Data untuk grafik pasut
  const tideChartData = {
    labels: tideData.map((item) => item.time),
    datasets: [
      {
        label: "Tinggi Pasut (cm)",
        data: tideData.map((item) => item.height),
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.3,
      },
    ],
  };
  const tideChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: "Waktu" } },
      y: { title: { display: true, text: "Tinggi Pasut (cm)" } },
    },
  };

  // Wind Rose sesuai contoh: satu dataset, legend kotak, label arah+persen
  const windRoseLabels = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const windRoseValues = [8, 12, 18, 30, 10, 7, 9, 6]; // persen per arah
  const windRoseColors = [
    "#00c3ff", "#3ae374", "#b2f902", "#ffe600",
    "#ff944d", "#ff5e57", "#7158e2", "#3d3d3d"
  ];
  const windRoseData = {
    labels: windRoseLabels,
    datasets: [
      {
        label: "Wind Direction",
        data: windRoseValues,
        backgroundColor: windRoseColors,
        borderWidth: 1,
      }
    ]
  };
  const windRoseOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          usePointStyle: false, // icon kotak
          boxWidth: 20,
          font: { size: 14 },
          generateLabels: (chart) => {
            const ds = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => ({
              text: `${label} : ${ds.data[i]}%`,
              fillStyle: ds.backgroundColor[i],
              strokeStyle: ds.backgroundColor[i],
              lineWidth: 1,
              hidden: false,
              index: i
            }));
          }
        }
      },
      title: {
        display: true,
        text: "Wind Rose",
        font: { size: 18 },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 40,
        ticks: { stepSize: 10 },
        angleLines: { display: true },
        grid: { color: "#e0e0e0" },
      },
    },
  };

  // Data dummy untuk tidal prediction
  const labels = [
    "26 Apr 00:00", "26 Apr 12:00", "27 Apr 00:00", "27 Apr 12:00", "28 Apr 00:00",
    "28 Apr 12:00", "29 Apr 00:00", "29 Apr 12:00", "30 Apr 00:00", "30 Apr 12:00",
    "01 May 00:00", "01 May 12:00", "02 May 00:00", "02 May 12:00", "03 May 00:00"
  ];
  const data = [0.0, 1.2, 0.1, 1.4, -0.3, 1.3, -0.2, 1.5, 0.0, 1.1, -0.4, 1.3, -0.5, 1.2, 0.0];

  const tidalPredictionData = {
    labels,
    datasets: [
      {
        label: "Sea Level",
        data: data,
        fill: false,
        borderColor: "#4682b4",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.5,
        order: 1,
      }
    ]
  };

  // Fungsi deteksi puncak dan palung
  function findPeaksAndTroughs(data) {
    const peaks = [];
    const troughs = [];
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
        peaks.push(i);
      }
      if (data[i] < data[i - 1] && data[i] < data[i + 1]) {
        troughs.push(i);
      }
    }
    return { peaks, troughs };
  }

  const { peaks, troughs } = findPeaksAndTroughs(data);

  const tidalPredictionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      annotation: {
        annotations: [
          // Puncak (high tide)
          ...peaks.map(i => ({
            type: 'label',
            xValue: labels[i],
            yValue: data[i],
            backgroundColor: undefined,
            color: 'black',
            font: { weight: 'bold' },
            content: [`${labels[i]}`, `${data[i].toFixed(2)} m`],
            position: { x: 'center', y: 'bottom' },
            yAdjust: -30,
          })),
          // Palung (low tide)
          ...troughs.map(i => ({
            type: 'label',
            xValue: labels[i],
            yValue: data[i],
            backgroundColor: undefined,
            color: 'black',
            font: { weight: 'bold' },
            content: [`${labels[i]}`, `${data[i].toFixed(2)} m`],
            position: { x: 'center', y: 'bottom' },
            yAdjust: -30,
          })),
        ],
      },
    },
    scales: {
      x: {
        title: { display: false },
        ticks: { maxRotation: 0, minRotation: 0, font: { size: 12 } },
        grid: {
          color: "#e0e0e0",
          lineWidth: 1,
          drawOnChartArea: true,
        }
      },
      y: {
        title: { display: true, text: "Sea Level (m)", font: { size: 14 } },
        min: -0.7,
        max: 1.7,
        ticks: {
          stepSize: 0.5,
          callback: (v) => `${v.toFixed(1)} m`,
          font: { size: 12 }
        },
        grid: {
          color: (ctx) => (ctx.tick.value === 0 ? "#888" : "#e0e0e0"),
          lineWidth: (ctx) => (ctx.tick.value === 0 ? 2 : 1),
          drawOnChartArea: true,
        }
      }
    }
  };

  // Weather Window Table (tanpa library eksternal)
  const weatherTableXLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const weatherTableYLabels = Array.from({ length: 31 }, (_, i) => (i + 1));
  const weatherTableData = Array.from({ length: 31 }, () =>
    Array.from({ length: 12 }, () => Math.floor(Math.random() * 101))
  );
  function getWeatherTableColor(value) {
    if (value >= 100) return "#00b050";
    if (value >= 90) return "#92d050";
    if (value >= 80) return "#ffff00";
    if (value >= 70) return "#ffc000";
    if (value >= 60) return "#ff9900";
    if (value >= 50) return "#ff0000";
    if (value >= 40) return "#c00000";
    if (value >= 30) return "#ff6666";
    if (value >= 20) return "#ffcccc";
    return "#ffffff";
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-18 pt-24 pb-10">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-blue-900 mb-6 text-center">FUTURE DEVELOPMENT</h1>
        <p className="text-gray-700 text-center mb-10">This page provides an overview of OSDATUM development features, including real-time tidal observation, meteorological variables, and weather window.</p>
        <div className="mb-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Realtime Tidal Observation</h2>
          <div style={{ width: "100%", height: "350px" }}>
            <Line data={tideChartData} options={tideChartOptions} />
          </div>
        </div>
        {/* Grafik prediksi pasut */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Tidal Prediction</h2>
          <div style={{ width: "100%", height: 400 }}>
            <Line data={tidalPredictionData} options={tidalPredictionOptions} />
          </div>
        </div>
        {/* Wind Rose (Mawar Angin) */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-blue-800">Wind Rose</h2>
          <div style={{
            width: "100%",
            maxWidth: 400,
            margin: "0 auto",
            height: 350,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <PolarArea data={windRoseData} options={{
              ...windRoseOptions,
              plugins: {
                ...windRoseOptions.plugins,
                legend: {
                  ...windRoseOptions.plugins.legend,
                  labels: {
                    ...windRoseOptions.plugins.legend.labels,
                    boxWidth: 14,
                    font: { size: 12 },
                    padding: 10,
                  }
                }
              }
            }} />
          </div>
        </div>
        {/* Weather Window Table */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Weather Window (Uptime Probability %)</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="border-collapse" style={{ minWidth: 600, fontSize: 11 }}>
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-xs bg-gray-100">Date</th>
                  {weatherTableXLabels.map(month => (
                    <th key={month} className="border px-2 py-1 text-xs bg-gray-100">{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weatherTableYLabels.map((day, i) => (
                  <tr key={day}>
                    <td className="border px-2 py-1 text-xs bg-gray-100 text-center">{day}</td>
                    {weatherTableData[i].map((val, j) => (
                      <td
                        key={j}
                        className="border px-2 py-1 text-xs text-center"
                        style={{ background: getWeatherTableColor(val), color: '#222', fontWeight: 'bold' }}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div className="flex flex-row gap-2 mt-4 items-center">
            {[100, 90, 80, 70, 60, 50, 40, 30, 20, 0].map((v, i, arr) => (
              <div key={v} className="flex flex-col items-center">
                <div style={{
                  width: 32, height: 16, background: getWeatherTableColor(v), border: "1px solid #ccc"
                }} />
                <span style={{ fontSize: 10 }}>{v}{i !== arr.length - 1 ? "-" + arr[i + 1] : ""}</span>
              </div>
            ))}
            <span className="ml-2 text-xs">Percentage (%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Develop;