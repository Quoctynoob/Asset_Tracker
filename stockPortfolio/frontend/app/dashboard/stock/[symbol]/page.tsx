'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import * as api from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import StockChart from '../../../components/stock/StockChart';
import StockInfo from '../../../components/stock/StockInfo';
import { StockNews } from '../../../components/dashboard/StockNews';
import AddToPortfolioModal from '../../../components/stock/AddToPortfolioModal';

interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  percentChange: number;
  exchange: string;
  currency: string;
  lastUpdated: string;
}

interface PortfolioSummary {
  id: number;
  name: string;
}

const StockDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stock, setStock] = useState<Stock | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddToPortfolioModal, setShowAddToPortfolioModal] = useState(false);
  
  const symbol = params.symbol as string;

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !symbol) return;
      
      setIsLoading(true);
      try {
        // Fetch stock data
        const stockData = await api.getStock(symbol);
        setStock(stockData);
        
        // Fetch news related to this stock
        const newsData = await api.getNewsForStock(symbol, 5);
        setNews(newsData);
        
        // Fetch user's portfolios for the "Add to Portfolio" feature
        const portfoliosData = await api.getUserPortfolios();
        setPortfolios(portfoliosData.map(p => ({ id: p.id, name: p.name })));
      } catch (err) {
        console.error('Failed to fetch stock data:', err);
        setError('Failed to load stock details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      fetchData();
    }
  }, [symbol, user, loading]);

  const handleAddToPortfolio = () => {
    setShowAddToPortfolioModal(true);
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
        <Link href="/dashboard/stock" className="text-darkGreen hover:underline font-medium">
          Back to Stocks
        </Link>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Stock Not Found</h2>
          <p className="text-gray-500 mb-6">
            The stock you're looking for might not exist or could not be loaded.
          </p>
          <Link
            href="/dashboard/stock"
            className="bg-darkGreen text-white px-6 py-3 rounded-md hover:bg-lightGreen transition inline-block"
          >
            Browse Stocks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/dashboard/stock" 
          className="text-darkGreen hover:underline font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Stocks
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{stock.name} ({stock.symbol})</h1>
          <p className="text-gray-600 mt-1">{stock.exchange}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleAddToPortfolio}
            className="bg-darkGreen text-white px-4 py-2 rounded-md hover:bg-lightGreen transition"
          >
            Add to Portfolio
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: stock.currency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(stock.currentPrice)}
                </h2>
                <div className={`flex items-center ${stock.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="text-lg font-semibold">
                    {stock.percentChange >= 0 ? '+' : ''}
                    {stock.percentChange.toFixed(2)}%
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    {stock.percentChange >= 0 ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    )}
                  </svg>
                </div>
              </div>
              <div className="text-gray-500 text-sm">
                Last updated: {new Date(stock.lastUpdated).toLocaleString()}
              </div>
            </div>
            
            <StockChart symbol={stock.symbol} />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">About {stock.name}</h2>
            <StockInfo stock={stock} />
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Price Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Previous Close</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: stock.currency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(stock.previousClose)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Day High</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: stock.currency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(stock.dayHigh)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Day Low</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: stock.currency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(stock.dayLow)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Volume</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-US').format(stock.volume)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Exchange</span>
                <span className="font-medium">{stock.exchange}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Related News</h2>
            {news.length > 0 ? (
              <div className="space-y-4">
                {news.map((item) => (
                  <a 
                    key={item.id} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 border rounded-md hover:bg-gray-50 transition"
                  >
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="text-sm text-gray-500 mt-1">{item.source} • {new Date(item.publishedAt).toLocaleDateString()}</div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                No recent news available for this stock.
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showAddToPortfolioModal && (
        <AddToPortfolioModal
          stock={stock}
          portfolios={portfolios}
          onClose={() => setShowAddToPortfolioModal(false)}
        />
      )}
    </div>
  );
};

export default StockDetailPage;