'use client';

import React from 'react';
import Link from 'next/link';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  relatedSymbols: string;
}

interface StockNewsProps {
  news: NewsItem[];
}

export const StockNews: React.FC<StockNewsProps> = ({ news }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Latest Market News</h2>
      
      {news.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">No news available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {news.map((item) => (
            <div key={item.id} className="border-b pb-6 last:border-b-0">
              <div className="flex flex-col md:flex-row gap-4">
                {item.imageUrl && (
                  <div className="md:w-1/4">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="rounded-md object-cover w-full h-32"
                    />
                  </div>
                )}
                <div className={item.imageUrl ? 'md:w-3/4' : 'w-full'}>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="mr-2">{item.source}</span>
                    <span className="mr-2">•</span>
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                  <p className="text-gray-700 mb-2 line-clamp-2">{item.summary}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.relatedSymbols.split(',').map((symbol) => (
                      <Link 
                        href={`/dashboard/stock/${symbol.trim()}`} 
                        key={symbol.trim()}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                      >
                        ${symbol.trim()}
                      </Link>
                    ))}
                  </div>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-darkGreen hover:underline font-medium text-sm"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-center">
        <Link href="/dashboard/news" className="text-darkGreen hover:underline font-medium">
          View All News
        </Link>
      </div>
    </div>
  );
};