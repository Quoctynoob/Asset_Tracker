'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as api from '../../lib/api';

interface StockChartProps {
  symbol: string;
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

interface DataPoint {
  date: string;
  price: number;
}

const StockChart: React.FC<StockChartProps> = ({ symbol }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, you would fetch historical data based on the timeRange
        // For this example, we'll generate mock data
        const mockData = generateMockData(timeRange, symbol);
        setData(mockData);
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
        setError('Failed to load chart data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [symbol, timeRange]);

  const generateMockData = (range: TimeRange, stockSymbol: string): DataPoint[] => {
    const data: DataPoint[] = [];
    const now = new Date();
    let days = 0;
    
    switch (range) {
      case '1D':
        days = 1;
        break;
      case '1W':
        days = 7;
        break;
      case '1M':
        days = 30;
        break;
      case '3M':
        days = 90;
        break;
      case '1Y':
        days = 365;
        break;
      case '5Y':
        days = 365 * 5;
        break;
    }
    
    // Generate a base price based on the stock symbol (for demo consistency)
    const basePrice = stockSymbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 200 + 50;
    
    // Generate data points
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Create some randomness in the price
      const volatility = range === '1D' ? 0.005 : 0.02;
      const randomFactor = (Math.random() - 0.5) * 2 * volatility;
      
      // Add some trend based on the day
      const trendFactor = i / days;
      const trend = range === '1Y' || range === '5Y' ? 0.2 : 0.05;
      
      const price = basePrice * (1 + randomFactor + trendFactor * trend);
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(2))
      });
    }
    
    return data;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    
    switch (timeRange) {
      case '1D':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '1W':
      case '1M':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case '3M':
      case '1Y':
      case '5Y':
        return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const calculatePriceChange = () => {
    if (data.length < 2) return { change: 0, percentage: 0 };
    
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;
    
    return { change, percentage };
  };

  const { change, percentage } = calculatePriceChange();
  const isPositive = change >= 0;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          {(['1D', '1W', '1M', '3M', '1Y', '5Y'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === range
                  ? 'bg-darkGreen text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{formatPrice(change)} ({isPositive ? '+' : ''}{percentage.toFixed(2)}%)
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-darkGreen"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                minTickGap={30}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => formatPrice(value).split('.')[0]}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip 
                formatter={(value: number) => [formatPrice(value), 'Price']}
                labelFormatter={(value) => formatDate(value)}
                contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? '#16a34a' : '#dc2626'} 
                dot={false}
                activeDot={{ r: 5 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StockChart;