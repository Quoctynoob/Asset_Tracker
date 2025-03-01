'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

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

const PortfolioListPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const data = await api.getUserPortfolios();
        setPortfolios(data);
      } catch (err) {
        console.error('Failed to fetch portfolios:', err);
        setError('Failed to load your portfolios. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      fetchPortfolios();
    }
  }, [user, loading]);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-darkGreen"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Link 
          href="/dashboard" 
          className="text-darkGreen hover:underline font-medium"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Portfolios</h1>
        <Link
          href="/dashboard/portfolio/new"
          className="bg-darkGreen text-white px-4 py-2 rounded-md hover:bg-lightGreen transition"
        >
          + Create New Portfolio
        </Link>
      </div>

      {portfolios.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Portfolios Yet</h2>
          <p className="text-gray-500 mb-6">
            Create your first portfolio to start tracking your investments.
          </p>
          <Link
            href="/dashboard/portfolio/new"
            className="bg-darkGreen text-white px-6 py-3 rounded-md hover:bg-lightGreen transition inline-block"
          >
            Create Your First Portfolio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Link href={`/dashboard/portfolio/${portfolio.id}`} key={portfolio.id}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                <h2 className="text-xl font-bold mb-2">{portfolio.name}</h2>
                {portfolio.description && (
                  <p className="text-gray-600 mb-4 flex-grow">{portfolio.description}</p>
                )}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500">Total Value:</span>
                    <span className="font-semibold">
                      {formatCurrency(portfolio.totalValue, portfolio.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500">Profit/Loss:</span>
                    <span className={`font-semibold ${portfolio.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(portfolio.totalProfitLoss, portfolio.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Return:</span>
                    <span className={`font-semibold ${portfolio.totalProfitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {portfolio.totalProfitLossPercentage >= 0 ? '+' : ''}
                      {portfolio.totalProfitLossPercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Stocks:</span>
                    <span className="font-semibold">{portfolio.stockCount}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioListPage;