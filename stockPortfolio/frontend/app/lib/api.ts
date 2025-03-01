import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header with JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication
export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

// User
export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updatePreferredCurrency = async (currency: string) => {
  const response = await api.put('/users/currency', { currency });
  return response.data;
};

// Stocks
export const searchStocks = async (query: string) => {
  const response = await api.get(`/stocks/public/search?query=${query}`);
  return response.data;
};

export const getStock = async (symbol: string) => {
  const response = await api.get(`/stocks/${symbol}`);
  return response.data;
};

export const getMultipleStocks = async (symbols: string[]) => {
  const response = await api.get(`/stocks/batch?symbols=${symbols.join(',')}`);
  return response.data;
};

// Portfolios
export const getUserPortfolios = async () => {
  const response = await api.get('/portfolios');
  return response.data;
};

export const getPortfolio = async (portfolioId: number) => {
  const response = await api.get(`/portfolios/${portfolioId}`);
  return response.data;
};

export const createPortfolio = async (name: string, description?: string) => {
  const response = await api.post('/portfolios', { name, description });
  return response.data;
};

export const updatePortfolio = async (portfolioId: number, name: string, description?: string) => {
  const response = await api.put(`/portfolios/${portfolioId}`, { name, description });
  return response.data;
};

export const deletePortfolio = async (portfolioId: number) => {
  const response = await api.delete(`/portfolios/${portfolioId}`);
  return response.data;
};

export const addStockToPortfolio = async (
  portfolioId: number,
  symbol: string,
  quantity: number,
  purchasePrice: number
) => {
  const response = await api.post(`/portfolios/${portfolioId}/stocks`, {
    symbol,
    quantity,
    purchasePrice,
  });
  return response.data;
};

export const updateStockHolding = async (
  portfolioId: number,
  holdingId: number,
  quantity: number,
  purchasePrice: number
) => {
  const response = await api.put(`/portfolios/${portfolioId}/stocks/${holdingId}`, {
    quantity,
    purchasePrice,
  });
  return response.data;
};

export const removeStockFromPortfolio = async (portfolioId: number, holdingId: number) => {
  const response = await api.delete(`/portfolios/${portfolioId}/stocks/${holdingId}`);
  return response.data;
};

// News
export const getLatestNews = async (count: number = 10) => {
  const response = await api.get(`/news?count=${count}`);
  return response.data;
};

export const getNewsForStock = async (symbol: string, count: number = 5) => {
  const response = await api.get(`/news/stock/${symbol}?count=${count}`);
  return response.data;
};

export const getNewsForPortfolio = async (count: number = 10) => {
  const response = await api.get(`/news/portfolio?count=${count}`);
  return response.data;
};

export default api;