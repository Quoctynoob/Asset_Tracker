'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user, updateCurrency } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState(user?.preferredCurrency || 'USD');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$' },
  ];

  const handleUpdateCurrency = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    setError(null);
    setSuccess(false);
    
    try {
      await updateCurrency(selectedCurrency);
      setSuccess(true);
    } catch (err) {
      console.error('Failed to update currency:', err);
      setError('Failed to update currency preference. Please try again later.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Profile Information</h2>
        
        {user && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="h-16 w-16 rounded-full bg-darkGreen flex items-center justify-center text-white text-xl font-semibold mr-4">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.username}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Currency Preferences</h2>
        <p className="text-gray-600 mb-6">
          Choose your preferred currency for displaying stock prices and portfolio values. This setting will apply across the entire application.
        </p>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Your currency preference has been updated successfully.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Currency
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currencies.map((currency) => (
              <div key={currency.code} className="flex items-center">
                <input
                  id={`currency-${currency.code}`}
                  name="currency"
                  type="radio"
                  checked={selectedCurrency === currency.code}
                  onChange={() => setSelectedCurrency(currency.code)}
                  className="h-4 w-4 text-darkGreen focus:ring-darkGreen border-gray-300"
                />
                <label htmlFor={`currency-${currency.code}`} className="ml-3 block text-sm font-medium text-gray-700">
                  {currency.code} - {currency.name} ({currency.symbol})
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={handleUpdateCurrency}
          disabled={isUpdating || selectedCurrency === user?.preferredCurrency}
          className="bg-darkGreen text-white px-4 py-2 rounded-md hover:bg-lightGreen transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? 'Updating...' : 'Update Currency'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;