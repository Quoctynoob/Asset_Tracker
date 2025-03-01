'use client';

import React from 'react';

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

interface StockInfoProps {
  stock: Stock;
}

const StockInfo: React.FC<StockInfoProps> = ({ stock }) => {
  // For a real app, you'd fetch company details from an API
  // This is mock data for the example
  const mockCompanyDetails = {
    description: `${stock.name} is a fictional company used for demonstration purposes. In a real application, this section would contain a detailed description of the company, its business model, products, market position, and other relevant information that would be fetched from a financial data API.`,
    sector: getSectorForSymbol(stock.symbol),
    industry: getIndustryForSymbol(stock.symbol),
    employees: Math.floor(Math.random() * 100000) + 1000,
    ceo: getRandomCEO(),
    founded: Math.floor(Math.random() * 70) + 1950,
    headquarters: getRandomHeadquarters(),
    website: `https://www.${stock.symbol.toLowerCase()}.com`
  };

  return (
    <div>
      <p className="text-gray-700 mb-6">{mockCompanyDetails.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">Company Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Sector</span>
              <span>{mockCompanyDetails.sector}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Industry</span>
              <span>{mockCompanyDetails.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Employees</span>
              <span>{mockCompanyDetails.employees.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CEO</span>
              <span>{mockCompanyDetails.ceo}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-2">Additional Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Founded</span>
              <span>{mockCompanyDetails.founded}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Headquarters</span>
              <span>{mockCompanyDetails.headquarters}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Exchange</span>
              <span>{stock.exchange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Website</span>
              <a 
                href={mockCompanyDetails.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-darkGreen hover:underline"
              >
                {mockCompanyDetails.website.replace('https://', '')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions to generate mock data based on the stock symbol
function getSectorForSymbol(symbol: string): string {
  const sectors = [
    'Technology',
    'Healthcare',
    'Financial Services',
    'Consumer Cyclical',
    'Energy',
    'Industrials',
    'Communication Services',
    'Consumer Defensive',
    'Real Estate',
    'Utilities',
    'Basic Materials'
  ];
  
  // Generate a consistent sector based on the first character of the symbol
  const index = symbol.charCodeAt(0) % sectors.length;
  return sectors[index];
}

function getIndustryForSymbol(symbol: string): string {
  const industries = {
    'Technology': ['Software', 'Semiconductors', 'Hardware', 'IT Services', 'Consumer Electronics'],
    'Healthcare': ['Biotechnology', 'Pharmaceuticals', 'Medical Devices', 'Healthcare Services', 'Health Insurance'],
    'Financial Services': ['Banks', 'Insurance', 'Asset Management', 'Credit Services', 'Capital Markets'],
    'Consumer Cyclical': ['Retail', 'Automotive', 'Entertainment', 'Restaurants', 'Travel & Leisure'],
    'Energy': ['Oil & Gas', 'Renewable Energy', 'Coal', 'Natural Gas', 'Energy Equipment & Services'],
    'Industrials': ['Aerospace & Defense', 'Construction', 'Machinery', 'Transportation', 'Business Services'],
    'Communication Services': ['Telecom', 'Media', 'Social Media', 'Entertainment', 'Advertising'],
    'Consumer Defensive': ['Food & Beverages', 'Household Products', 'Personal Products', 'Tobacco', 'Discount Stores'],
    'Real Estate': ['REITs', 'Real Estate Services', 'Development', 'Property Management', 'Real Estate Holding'],
    'Utilities': ['Electric Utilities', 'Gas Utilities', 'Water Utilities', 'Renewable Utilities', 'Multi-Utilities'],
    'Basic Materials': ['Chemicals', 'Metals & Mining', 'Paper & Forest Products', 'Construction Materials', 'Agriculture']
  };
  
  const sector = getSectorForSymbol(symbol);
  const industryList = industries[sector as keyof typeof industries] || industries['Technology'];
  
  // Generate a consistent industry based on the last character of the symbol
  const index = symbol.charCodeAt(symbol.length - 1) % industryList.length;
  return industryList[index];
}

function getRandomCEO(): string {
  const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jennifer', 'Robert', 'Linda', 'William', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Martinez'];
  
  const firstNameIndex = Math.floor(Math.random() * firstNames.length);
  const lastNameIndex = Math.floor(Math.random() * lastNames.length);
  
  return `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`;
}

function getRandomHeadquarters(): string {
  const cities = ['New York, NY', 'San Francisco, CA', 'Seattle, WA', 'Austin, TX', 'Boston, MA', 'Chicago, IL', 
                 'Los Angeles, CA', 'Denver, CO', 'Atlanta, GA', 'Miami, FL', 'Dallas, TX', 'Phoenix, AZ'];
  
  const index = Math.floor(Math.random() * cities.length);
  return cities[index];
}

export default StockInfo;