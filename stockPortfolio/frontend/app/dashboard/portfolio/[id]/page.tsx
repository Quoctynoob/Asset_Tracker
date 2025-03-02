'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import * as api from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import AddStockModal from '@/app/components/portfolio/AddStockModal';
import StockHoldingItem from '@/app/components/portfolio/StockHoldingItem';';
import EditPortfolioModal from '@/app/components/portfolio/EditPortfolioModal';';

interface StockHolding {
  id: number;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  currency: string;
}

interface Portfolio {
  id: number;
  name: string;
  description: string;
  holdings: StockHolding[];
  totalValue: number;
  totalCost: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  currency: string;
}

const PortfolioDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const portfolioId = params.id;

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user || !portfolioId) return;
      
      setIsLoading(true);
      try {
        const data = await api.getPortfolio(Number(portfolioId));
        setPortfolio(data);
      } catch (err) {
        console.error('Failed to fetch portfolio:', err);
        setError('Failed to load portfolio details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      fetchPortfolio();
    }
  }, [portfolioId, user, loading]);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleDeletePortfolio = async () => {
    if (!window.confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await api.deletePortfolio(Number(portfolioId));
      router.push('/dashboard/portfolio');
    } catch (err) {
      console.error('Failed to delete portfolio:', err);
      setError('Failed to delete portfolio. Please try again later.');
      setIsDeleting(false);
    }
  };

  const handleAddStock = async () => {
    setShowAddStockModal(false);
    if (!portfolioId) return;
    
    // Reload portfolio data to reflect the new stock
    setIsLoading(true);
    try {
      const data = await api.getPortfolio(Number(portfolioId));
      setPortfolio(data);
    } catch (err) {
      console.error('Failed to refresh portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPortfolio = async () => {
    setShowEditModal(false);
    if (!portfolioId) return;
    
    // Reload portfolio data to reflect changes
    setIsLoading(true);
    try {
      const data = await api.getPortfolio(Number(portfolioId));
      setPortfolio(data);
    } catch (err) {
      console.error('Failed to refresh portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStock = async (holdingId: number) => {
    if (!window.confirm('Are you sure you want to remove this stock from your portfolio?')) {
      return;
    }
    
    try {
      await api.removeStockFromPortfolio(Number(portfolioId), holdingId);
      
      // Update the local state
      if (portfolio) {
        setPortfolio({
          ...portfolio,
          holdings: portfolio.holdings.filter(h => h.id !== holdingId)
        });
      }
    } catch (err) {
      console.error('Failed to remove stock:', err);
      setError('Failed to remove stock. Please try again later.');
    }
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
          href="/dashboard/portfolio" 
          className="text-darkGreen hover:underline font-medium"
        >
          Back to Portfolios
        </Link>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Portfolio Not Found</h2>
          <p className="text-gray-500 mb-6">
            The portfolio you're looking for might have been deleted or doesn't exist.
          </p>
          <Link
            href="/dashboard/portfolio"
            className="bg-darkGreen text-white px-6 py-3 rounded-md hover:bg-lightGreen transition inline-block"
          >
            Back to Portfolios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/dashboard/portfolio" 
          className="text-darkGreen hover:underline font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Portfolios
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{portfolio.name}</h1>
          {portfolio.description && (
            <p className="text-gray-600 mt-1">{portfolio.description}</p>
          )}
        </div>
        <div className="flex mt-4 md:mt-0 space-x-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Edit Portfolio
          </button>
          <button
            onClick={handleDeletePortfolio}
            disabled={isDeleting}
            className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition ${
              isDeleting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isDeleting ? 'Deleting...' : 'Delete Portfolio'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Value</h3>
          <p className="text-3xl font-bold">{formatCurrency(portfolio.totalValue, portfolio.currency)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Cost</h3>
          <p className="text-3xl font-bold">{formatCurrency(portfolio.totalCost, portfolio.currency)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Profit/Loss</h3>
          <p className={`text-3xl font-bold ${portfolio.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(portfolio.totalProfitLoss, portfolio.currency)}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Return Percentage</h3>
          <p className={`text-3xl font-bold ${portfolio.totalProfitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {portfolio.totalProfitLossPercentage >= 0 ? '+' : ''}
            {portfolio.totalProfitLossPercentage.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Holdings</h2>
          <button
            onClick={() => setShowAddStockModal(true)}
            className="bg-darkGreen text-white px-4 py-2 rounded-md hover:bg-lightGreen transition"
          >
            + Add Stock
          </button>
        </div>
        
        {portfolio.holdings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have any stocks in this portfolio yet.</p>
            <button
              onClick={() => setShowAddStockModal(true)}
              className="bg-darkGreen text-white px-6 py-3 rounded-md hover:bg-lightGreen transition"
            >
              Add Your First Stock
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit/Loss
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolio.holdings.map((holding) => (
                  <StockHoldingItem 
                    key={holding.id} 
                    holding={holding}
                    portfolioId={portfolio.id}
                    currency={portfolio.currency}
                    onRemove={handleRemoveStock}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {showAddStockModal && (
        <AddStockModal 
          portfolioId={portfolio.id} 
          onClose={() => setShowAddStockModal(false)}
          onSuccess={handleAddStock}
          currency={portfolio.currency}
        />
      )}
      
      {showEditModal && (
        <EditPortfolioModal
          portfolio={portfolio}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditPortfolio}
        />
      )}
    </div>
  );
};

export default PortfolioDetailPage;