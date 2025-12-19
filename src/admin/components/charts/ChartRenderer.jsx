import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import './ChartRenderer.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartRenderer = ({ chartConfig, data, columns }) => {
  if (!chartConfig || !data) {
    return <div className="chart-error">No data to display</div>;
  }

  const { chartType, title, xAxis, yAxis, labelColumn, valueColumn } = chartConfig;

  // Prepare chart data based on type
  const prepareChartData = () => {
    switch (chartType) {
      case 'bar':
      case 'line':
        const labels = data.map(row => row[labelColumn || xAxis || columns[0]]);
        const values = data.map(row => row[valueColumn || yAxis || columns[1]]);
        
        return {
          labels,
          datasets: [{
            label: valueColumn || yAxis || 'Value',
            data: values,
            backgroundColor: chartType === 'bar' 
              ? 'rgba(13, 148, 136, 0.8)'
              : 'rgba(13, 148, 136, 0.2)',
            borderColor: 'rgba(13, 148, 136, 1)',
            borderWidth: 2,
            fill: chartType === 'line',
          }]
        };

      case 'pie':
        const pieLabels = data.slice(0, 10).map(row => row[labelColumn || columns[0]]);
        const pieValues = data.slice(0, 10).map(row => row[valueColumn || columns[1]]);
        
        return {
          labels: pieLabels,
          datasets: [{
            data: pieValues,
            backgroundColor: [
              'rgba(13, 148, 136, 0.8)',
              'rgba(20, 184, 166, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(34, 211, 238, 0.8)',
              'rgba(6, 182, 212, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(236, 72, 153, 0.8)',
              'rgba(251, 146, 60, 0.8)',
              'rgba(234, 179, 8, 0.8)',
            ],
            borderColor: '#fff',
            borderWidth: 2,
          }]
        };

      case 'scatter':
        const scatterData = data.map(row => ({
          x: row[xAxis || columns[0]],
          y: row[yAxis || columns[1]]
        }));
        
        return {
          datasets: [{
            label: 'Data Points',
            data: scatterData,
            backgroundColor: 'rgba(13, 148, 136, 0.6)',
            borderColor: 'rgba(13, 148, 136, 1)',
            pointRadius: 5,
          }]
        };

      default:
        return null;
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: chartType !== 'pie' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    } : undefined
  };

  const renderChart = () => {
    const chartData = prepareChartData();

    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      case 'scatter':
        return <Scatter data={chartData} options={chartOptions} />;
      case 'metric':
        return <MetricDisplay data={data} columns={columns} config={chartConfig} />;
      case 'table':
        return <TableDisplay data={data} columns={columns} />;
      default:
        return <TableDisplay data={data} columns={columns} />;
    }
  };

  return (
    <div className="chart-container">
      {renderChart()}
    </div>
  );
};

// Metric Display Component
const MetricDisplay = ({ data, columns, config }) => {
  const value = data[0]?.[columns[0]] || 0;
  
  return (
    <div className="metric-display">
      <div className="metric-value">{value.toLocaleString()}</div>
      <div className="metric-label">{config.title}</div>
    </div>
  );
};

// Table Display Component
const TableDisplay = ({ data, columns }) => {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col, colIdx) => (
                <td key={colIdx}>
                  {row[col] !== null && row[col] !== undefined 
                    ? String(row[col]) 
                    : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChartRenderer;