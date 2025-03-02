'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as api from '../../lib/api';

interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  currency: string;
}

interface Portfolio {
  id: number;
  name: string;
}

interface AddToPortfolioModalProps {
  stock: Stock;
  portfolios: Portfolio[];
  onClose: () => void;
}

const AddToPortfolioModal: React.FC<AddToPortfolioModalProps> = ({ 
  stock, 
  portfolios, 
  onClose 
}) => {
  const router = useRouter();
  const [selectedPortfolio, setSelectedPortfolio] = useState<number | ''>('');
  const [quantity, setQuantity] = useState('1');
  const [purchasePrice, setPurchasePrice] = useState(stock.currentPrice.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPortfolio) {
      setError('Please select a portfolio');
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
        Number(selectedPortfolio),
        stock.symbol,
        parseFloat(quantity),
        parseFloat(purchasePrice)
      );
      setSuccess(true);
    } catch (err: any) {
      console.error('Failed to add stock to portfolio:', err);
      setError(err.response?.data?.message || 'Failed to add stock to portfolio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePortfolio = () => {
    router.push('/dashboard/portfolio/new');
    onClose();
  };

  const formatCurrency = (value: string) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: stock.currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(value));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add {stock.symbol} to Portfolio</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {success ? (
          <div className="text-center py-6">
            <div className="text-green-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Stock Added Successfully</h3>
            <p className="text-gray-600 mb-4">
              {quantity} shares of {stock.symbol} have been added to your portfolio.
            </p>
            <div className="flex justify-center space-x-2">
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Close
              </button>
              <button
                onClick={() => router.push(`/dashboard/portfolio/${selectedPortfolio}`)}
                className="bg-darkGreen text-white px-4 py-2 rounded-md hover:bg-lightGreen transition"
              >
                View Portfolio
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <div className="p-3 border rounded-md bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-gray-600">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(stock.currentPrice.toString())}</div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">
                Select Portfolio
              </label>
              {portfolios.length > 0 ? (
                <select
                  id="portfolio"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-darkGreen focus:ring-darkGreen"
                  value={selectedPortfolio}
                  onChange={(e) => setSelectedPortfolio(e.target.value)}
                >
                  <option value="">Select a portfolio</option>
                  {portfolios.map((portfolio) => (
                    <option key={portfolio.id} value={portfolio.id}>
                      {portfolio.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">You don't have any portfolios yet.</p>
                  <button
                    type="button"
                    onClick={handleCreatePortfolio}
                    className="text-darkGreen hover:underline font-medium"
                  >
                    Create your first portfolio
                  </button>
                </div>
              )}
            </div>
            
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
                  placeholder={`Price per share (${stock.currency})`}
                />
              </div>
            </div>
            
            {quantity && purchasePrice && (
              <div className="mb-6 p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-semibold">
                    {formatCurrency((parseFloat(quantity) * parseFloat(purchasePrice)).toString())}
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
                disabled={isSubmitting || !selectedPortfolio || !quantity || !purchasePrice || portfolios.length === 0}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-darkGreen hover:bg-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkGreen disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add to Portfolio'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddToPortfolioModal;