'use client';

import React, { useState } from 'react';
import * as api from '../../lib/api';

interface Portfolio {
  id: number;
  name: string;
  description: string;
  holdings: any[];
  totalValue: number;
  totalCost: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  currency: string;
}

interface EditPortfolioModalProps {
  portfolio: Portfolio;
  onClose: () => void;
  onSuccess: () => void;
}

const EditPortfolioModal: React.FC<EditPortfolioModalProps> = ({ 
  portfolio, 
  onClose, 
  onSuccess 
}) => {
  const [name, setName] = useState(portfolio.name);
  const [description, setDescription] = useState(portfolio.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Portfolio name is required');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await api.updatePortfolio(portfolio.id, name, description);
      onSuccess();
    } catch (err: any) {
      console.error('Failed to update portfolio:', err);
      setError(err.response?.data?.message || 'Failed to update portfolio');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Portfolio</h2>
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-darkGreen focus:ring-darkGreen sm:text-sm"
              placeholder="My Investment Portfolio"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-darkGreen focus:ring-darkGreen sm:text-sm"
              placeholder="A brief description of this portfolio"
            />
          </div>
          
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
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-darkGreen hover:bg-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkGreen disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPortfolioModal;