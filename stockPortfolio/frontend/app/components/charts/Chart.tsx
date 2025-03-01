'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Portfolio {
  id: number;
  name: string;
  description: string;
  stockCount: number;
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  currency: string;
}

interface ChartProps {
  portfolios: Portfolio[];
  currency: string;
}

export const Chart: React.FC<ChartProps> = ({ portfolios, currency }) => {
  const [chartType, setChartType] = useState<'allocation' | 'performance'>('allocation');
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C'];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const allocationData = portfolios.map((portfolio, index) => ({
    name: portfolio.name,
    value: portfolio.totalValue,
    color: COLORS[index % COLORS.length],
  }));
  
  const performanceData = portfolios.map((portfolio, index) => ({
    name: portfolio.name,
    value: portfolio.totalProfitLoss,
    color: portfolio.totalProfitLoss >= 0 ? '#00C49F' : '#FF8042',
  }));
  
  const renderAllocationTooltip = ({ payload }: any) => {
    if (payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-semibold">{data.name}</p>
          <p>{formatCurrency(data.value)}</p>
          <p className="text-gray-600 text-sm">
            {(data.value / portfolios.reduce((sum, p) => sum + p.totalValue, 0) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };
  
  const renderPerformanceTooltip = ({ payload }: any) => {
    if (payload && payload.length) {
      const data = payload[0].payload;
      const portfolio = portfolios.find(p => p.name === data.name);
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-semibold">{data.name}</p>
          <p className={data.value >= 0 ? 'text-green-600' : 'text-red-600'}>
            {formatCurrency(data.value)}
          </p>
          {portfolio && (
            <p className="text-gray-600 text-sm">
              {portfolio.totalProfitLossPercentage.toFixed(2)}% return
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  if (portfolios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <h2 className="text-xl font-bold mb-4">Portfolio Analysis</h2>
        <div className="py-16 text-center">
          <p className="text-gray-500">You don't have any portfolios yet.</p>
          <p className="text-sm text-gray-400 mt-1">Create a portfolio to see analysis.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Portfolio Analysis</h2>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              chartType === 'allocation'
                ? 'bg-darkGreen text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setChartType('allocation')}
          >
            Allocation
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              chartType === 'performance'
                ? 'bg-darkGreen text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setChartType('performance')}
          >
            Performance
          </button>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartType === 'allocation' ? allocationData : performanceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {(chartType === 'allocation' ? allocationData : performanceData).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
            <Tooltip content={chartType === 'allocation' ? renderAllocationTooltip : renderPerformanceTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">
          {chartType === 'allocation' ? 'Portfolio Allocation' : 'Portfolio Performance'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(chartType === 'allocation' ? allocationData : performanceData).map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
              <div className="flex-1">
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="font-medium">
                {chartType === 'allocation' 
                  ? formatCurrency(item.value)
                  : (
                    <span className={item.value >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {item.value >= 0 ? '+' : ''}{formatCurrency(item.value)}
                    </span>
                  )
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};