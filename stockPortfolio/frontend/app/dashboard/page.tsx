'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../lib/api';
import { Chart } from '../components/charts/Chart';
import { StockNews } from '../components/dashboard/StockNews';
import { PortfolioSummary } from '../components/dashboard/PortfolioSummary';
import { PortfolioStats } from '../components/dashboard/PortfolioStats';
import { WatchlistCard } from '../components/dashboard/WatchlistCard';

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

interface StockNews {
  id: number;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  relatedSymbols: string;
}

const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [news, setNews] = useState<StockNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch portfolios
        const portfoliosData = await api.getUserPortfolios();
        setPortfolios(portfoliosData);
        
        // Fetch news related to user's portfolio
        const newsData = await api.getNewsForPortfolio();
        setNews(newsData);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      fetchData();
    }
  }, [user, loading]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-darkGreen"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          <h3 className="text-xl font-bold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  const totalValue = portfolios.reduce((sum, portfolio) => sum + portfolio.totalValue, 0);
  const totalProfitLoss = portfolios.reduce((sum, portfolio) => sum + portfolio.totalProfitLoss, 0);
  const averageProfitLossPercentage = portfolios.length > 0
    ? totalProfitLoss / totalValue * 100
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.username}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PortfolioStats 
          totalValue={totalValue} 
          totalProfitLoss={totalProfitLoss}
          percentChange={averageProfitLossPercentage}
          currency={user.preferredCurrency}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Chart 
            portfolios={portfolios} 
            currency={user.preferredCurrency} 
          />
        </div>
        <div>
          <WatchlistCard />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockNews news={news} />
        </div>
        <div>
          <PortfolioSummary portfolios={portfolios} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;