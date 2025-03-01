'use client';

import React from 'react';
import Link from 'next/link';

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

interface PortfolioSummaryProps {
  portfolios: Portfolio[];
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ portfolios }) => {
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Portfolios</h2>
        <Link href="/dashboard/portfolio/new" className="text-darkGreen hover:underline font-medium">
          + New Portfolio
        </Link>
      </div>
      
      {portfolios.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">You don't have any portfolios yet.</p>
          <Link href="/dashboard/portfolio/new" className="bg-darkGreen text-white px-4 py-2 rounded-md hover:bg-lightGreen transition">
            Create Your First Portfolio
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {portfolios.map((portfolio) => (
            <Link href={`/dashboard/portfolio/${portfolio.id}`} key={portfolio.id}>
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{portfolio.name}</h3>
                  <span className="text-gray-500 text-sm">{portfolio.stockCount} stocks</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-lg font-medium">
                    {formatCurrency(portfolio.totalValue, portfolio.currency)}
                  </span>
                  <span className={`${portfolio.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {portfolio.totalProfitLossPercentage >= 0 ? '+' : ''}
                    {portfolio.totalProfitLossPercentage.toFixed(2)}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {portfolios.length > 0 && (
        <div className="mt-4 text-center">
          <Link href="/dashboard/portfolio" className="text-darkGreen hover:underline font-medium">
            View All Portfolios
          </Link>
        </div>
      )}
    </div>
  );
};