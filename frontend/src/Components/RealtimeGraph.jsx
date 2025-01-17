import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LoanPercentageChart = () => {
  const [percentageData, setPercentageData] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);
  const [loanId, setLoanId] = useState("672e2b16ba7a494c5c793b64");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dummy data function
  const fetchLoanPercentage = async () => {
    if (!loanId) {
      setError("Please enter a valid Loan ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Dummy data simulating backend response
      const percentage = Math.random() * 100; // Random loan percentage between 0 and 100
      const currentTime = new Date().toLocaleTimeString(); // Current time as label

      console.log("New Data:", percentage, currentTime);

      setTimeLabels((prevLabels) => [...prevLabels, currentTime]);
      setPercentageData((prevData) => [...prevData, percentage]);
    } catch (err) {
      setError("Error fetching loan percentage.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getYAxisLimits = () => {
    const min = Math.min(...percentageData);
    const max = Math.max(...percentageData);

    if (max < 10) {
      return {
        min: 0,
        max: 10,
      };
    }

    return {
      min: 0,
      max: 100,
    };
  };

  useEffect(() => {
    fetchLoanPercentage();

    const intervalId = setInterval(fetchLoanPercentage, 10000);

    return () => clearInterval(intervalId);
  }, [loanId]);

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Loan Percentage",
        data: percentageData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Percentage",
        },
        ...getYAxisLimits(),
      },
    },
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h2>Loan Percentage</h2>

      <input
        type="text"
        value={loanId}
        onChange={(e) => setLoanId(e.target.value)}
        placeholder="Enter Loan ID"
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {percentageData.length > 0 && (
        <div style={{ height: "400px" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default LoanPercentageChart;
