'use client';

import React, { useState } from 'react';
import * as api from '../../lib/api';

interface AddStockModalProps {
  portfolioId: number;
  onClose: () => void;
  onSuccess: () => void;
  currency: string;
}

const AddStockModal: React.FC<AddStockModalProps> = ({ 
  portfolioId, 
  onClose, 
  onSuccess,
  currency
}) => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);

  const handleSearchStock = async () => {
    if (!symbol.trim()) return;
    
    setError(null);
    setIsSearching(true);
    try {
      const results = await api.searchStocks(symbol);
      setSearchResults(results);
      if (results.length === 0) {
        setError('No stocks found with this symbol or name.');
      }
    } catch (err) {
      console.error('Stock search failed:', err);
      setError('Failed to search for stocks. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectStock = (stock: any) => {
    setSelectedStock(stock);
    setSymbol(stock.symbol);
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symbol || !quantity || !purchasePrice) {
      setError('Please fill in all fields');
      return;
    }
    
    if (parseFloat(quantity) <= 0 || parseFloat(purchasePrice) <= 0) {
      setError('Quantity and purchase price must be positive values');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await api.addStockToPortfolio(
        portfolioId,
        symbol,
        parseFloat(quantity),
        parseFloat(purchasePrice)
      );
      onSuccess();
    } catch (err: any) {
      console.error('Failed to add stock:', err);
      setError(err.response?.data?.message || 'Failed to add stock to portfolio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: string, currency: string) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(value));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Stock to Portfolio</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Symbol or Name
            </label>
            <div className="flex">
              <input
                type="text"
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-darkGreen focus:ring-darkGreen sm:text-sm"
                placeholder="e.g., AAPL or Apple"
              />
              <button
                type="button"
                onClick={handleSearchStock}
                disabled={isSearching || !symbol.trim()}
                className="bg-darkGreen text-white rounded-r-md px-4 py-2 hover:bg-lightGreen transition disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mb-4 border rounded-md max-h-40 overflow-y-auto">
              {searchResults.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => handleSelectStock(stock)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-gray-600">{stock.name}</div>
                </div>
              ))}
            </div>
          )}
          
          {selectedStock && (
            <div className="mb-4 p-2 border rounded-md bg-gray-50">
              <div className="font-medium">{selectedStock.symbol}</div>
              <div className="text-sm text-gray-600">{selectedStock.name}</div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                min="0.01"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-darkGreen focus:ring-darkGreen sm:text-sm"
                placeholder="Number of shares"
              />
            </div>
            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price
              </label>
              <input
                type="number"
                id="purchasePrice"
                min="0.01"
                step="0.01"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-darkGreen focus:ring-darkGreen sm:text-sm"
                placeholder={`Price per share (${currency})`}
              />
            </div>
          </div>
          
          {quantity && purchasePrice && (
            <div className="mb-6 p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Cost:</span>
                <span className="font-semibold">
                  {formatCurrency((parseFloat(quantity) * parseFloat(purchasePrice)).toString(), currency)}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkGreen"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !symbol || !quantity || !purchasePrice}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-darkGreen hover:bg-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkGreen disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal;