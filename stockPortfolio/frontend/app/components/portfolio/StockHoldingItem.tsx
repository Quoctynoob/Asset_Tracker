'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import * as api from '../../lib/api';

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

interface StockHoldingItemProps {
  holding: StockHolding;
  portfolioId: number;
  currency: string;
  onRemove: (holdingId: number) => void;
}

const StockHoldingItem: React.FC<StockHoldingItemProps> = ({ 
  holding, 
  portfolioId,
  currency,
  onRemove 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(holding.quantity.toString());
  const [purchasePrice, setPurchasePrice] = useState(holding.purchasePrice.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseFloat(quantity) <= 0 || parseFloat(purchasePrice) <= 0) {
      setError('Quantity and purchase price must be positive values');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await api.updateStockHolding(
        portfolioId,
        holding.id,
        parseFloat(quantity),
        parseFloat(purchasePrice)
      );
      
      // Update local state
      holding.quantity = parseFloat(quantity);
      holding.purchasePrice = parseFloat(purchasePrice);
      
      setIsEditing(false);
    } catch (err: any) {
      console.error('Failed to update stock holding:', err);
      setError(err.response?.data?.message || 'Failed to update stock holding');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setQuantity(holding.quantity.toString());
    setPurchasePrice(holding.purchasePrice.toString());
    setError(null);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium text-gray-900">{holding.symbol}</div>
              <div className="text-sm text-gray-500">{holding.name}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-24 rounded-md border-gray-300 shadow-sm focus:border-darkGreen focus:ring-darkGreen sm:text-sm"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="w-24 rounded-md border-gray-300 shadow-sm focus:border-darkGreen focus:ring-darkGreen sm:text-sm"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          {formatCurrency(holding.currentPrice)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          {formatCurrency(parseFloat(quantity) * holding.currentPrice)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          {error && <span className="text-red-600 block mb-1">{error}</span>}
          {formatCurrency(parseFloat(quantity) * (holding.currentPrice - parseFloat(purchasePrice)))}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
          <button
            onClick={handleEditSubmit}
            disabled={isSubmitting}
            className="text-indigo-600 hover:text-indigo-900"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            <Link href={`/dashboard/stock/${holding.symbol}`} className="text-sm font-medium text-darkGreen hover:underline">
              {holding.symbol}
            </Link>
            <div className="text-sm text-gray-500">{holding.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {holding.quantity.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {formatCurrency(holding.purchasePrice)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {formatCurrency(holding.currentPrice)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {formatCurrency(holding.currentValue)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className={holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(holding.profitLoss)}
          <span className="block text-xs">
            {holding.profitLossPercentage >= 0 ? '+' : ''}
            {holding.profitLossPercentage.toFixed(2)}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
        <button
          onClick={() => onRemove(holding.id)}
          className="text-red-600 hover:text-red-900"
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default StockHoldingItem;