'use client';

import React, { useState, useEffect } from 'react';
import * as api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  percentChange: number;
  currency: string;
}

export const WatchlistCard: React.FC = () => {
  const { user } = useAuth();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Default stocks to watch if user hasn't added any
  const defaultWatchlist = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];

  useEffect(() => {
    const fetchWatchlist = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch user's watchlist from backend
        // For now, use the default watchlist
        const symbols = defaultWatchlist;
        
        if (symbols.length > 0) {
          const stocksData = await api.getMultipleStocks(symbols);
          setStocks(stocksData);
        }
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, [user]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await api.searchStocks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching stocks:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <h2 className="text-xl font-bold mb-4">Watchlist</h2>
      
      <div className="mb-4 flex">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search stocks..."
          className="border rounded-l-md px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-darkGreen"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-darkGreen text-white px-4 py-2 rounded-r-md hover:bg-lightGreen transition"
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="mb-4 border rounded-md p-2 max-h-40 overflow-y-auto">
          {searchResults.map((result) => (
            <div 
              key={result.symbol} 
              className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex justify-between"
              // In a real app, add onClick to add to watchlist
            >
              <div>
                <div className="font-medium">{result.symbol}</div>
                <div className="text-sm text-gray-600">{result.name}</div>
              </div>
              <button 
                className="text-darkGreen hover:underline self-center"
                // In a real app, implement add to watchlist functionality
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}
      
      {isLoading ? (
        <div className="py-8 text-center">
          <div className="animate-spin h-6 w-6 border-t-2 border-darkGreen border-solid rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading watchlist...</p>
        </div>
      ) : stocks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">Your watchlist is empty.</p>
          <p className="text-sm text-gray-400 mt-1">Search for stocks to add to your watchlist.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="border-b pb-3 last:border-b-0">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{stock.symbol}</h3>
                  <p className="text-sm text-gray-600">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(stock.currentPrice, stock.currency)}</p>
                  <p className={`text-sm ${stock.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};