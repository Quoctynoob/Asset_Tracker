'use client';

import React from 'react';

interface PortfolioStatsProps {
  totalValue: number;
  totalProfitLoss: number;
  percentChange: number;
  currency: string;
}

export const PortfolioStats: React.FC<PortfolioStatsProps> = ({
  totalValue,
  totalProfitLoss,
  percentChange,
  currency
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const isPositive = totalProfitLoss >= 0;
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Portfolio Value</h3>
        <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Profit/Loss</h3>
        <p className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(totalProfitLoss)}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Return Percentage</h3>
        <p className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
        </p>
      </div>
    </>
  );
};