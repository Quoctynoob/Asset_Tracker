package com.assettracker.service;

import com.assettracker.dto.StockDto;
import com.assettracker.exception.ResourceNotFoundException;
import com.assettracker.model.Stock;
import com.assettracker.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;
    
    @Autowired
    private WebClient.Builder webClientBuilder;
    
    @Value("${stock.api.url}")
    private String stockApiUrl;
    
    @Value("${stock.api.key}")
    private String stockApiKey;
    
    @Value("${currency.api.url}")
    private String currencyApiUrl;
    
    @Value("${currency.api.key}")
    private String currencyApiKey;

    public Stock getStockBySymbol(String symbol) {
        return stockRepository.findBySymbol(symbol)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with symbol: " + symbol));
    }

    public List<Stock> searchStocks(String query) {
        return stockRepository.findByNameContainingIgnoreCase(query);
    }

    public List<Stock> getStocksBySymbols(List<String> symbols) {
        return stockRepository.findBySymbolIn(symbols);
    }

    public StockDto convertCurrency(Stock stock, String targetCurrency) {
        if ("USD".equals(targetCurrency)) {
            return convertToDto(stock);
        }
        
        // Call currency conversion API to get exchange rate
        // This is a mock implementation - you would need to integrate with a real currency API
        BigDecimal exchangeRate = getExchangeRate("USD", targetCurrency);
        
        StockDto stockDto = convertToDto(stock);
        stockDto.setCurrentPrice(stockDto.getCurrentPrice().multiply(exchangeRate));
        stockDto.setPreviousClose(stockDto.getPreviousClose() != null ? 
                stockDto.getPreviousClose().multiply(exchangeRate) : null);
        stockDto.setDayHigh(stockDto.getDayHigh() != null ? 
                stockDto.getDayHigh().multiply(exchangeRate) : null);
        stockDto.setDayLow(stockDto.getDayLow() != null ? 
                stockDto.getDayLow().multiply(exchangeRate) : null);
        stockDto.setCurrency(targetCurrency);
        
        return stockDto;
    }

    private BigDecimal getExchangeRate(String baseCurrency, String targetCurrency) {
        // Mock implementation - replace with actual API call
        Map<String, BigDecimal> mockRates = Map.of(
                "EUR", new BigDecimal("0.91"),
                "GBP", new BigDecimal("0.79"),
                "JPY", new BigDecimal("111.22"),
                "CAD", new BigDecimal("1.34"),
                "AUD", new BigDecimal("1.47")
        );
        
        return mockRates.getOrDefault(targetCurrency, BigDecimal.ONE);
    }

    private StockDto convertToDto(Stock stock) {
        StockDto dto = new StockDto();
        dto.setSymbol(stock.getSymbol());
        dto.setName(stock.getName());
        dto.setCurrentPrice(stock.getCurrentPrice());
        dto.setPreviousClose(stock.getPreviousClose());
        dto.setDayHigh(stock.getDayHigh());
        dto.setDayLow(stock.getDayLow());
        dto.setVolume(stock.getVolume());
        dto.setExchange(stock.getExchange());
        dto.setLastUpdated(stock.getLastUpdated());
        dto.setCurrency("USD");  // Default currency
        
        // Calculate percentage change
        if (stock.getPreviousClose() != null && stock.getPreviousClose().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal change = stock.getCurrentPrice().subtract(stock.getPreviousClose());
            BigDecimal percentChange = change.divide(stock.getPreviousClose(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
            dto.setPercentChange(percentChange);
        }
        
        return dto;
    }

    @Scheduled(fixedRate = 300000)  // Update every 5 minutes
    public void updateStockPrices() {
        List<Stock> stocks = stockRepository.findAll();
        
        // In a real application, you would call an external API to get the latest stock prices
        // For this example, we'll just update the prices with random changes
        LocalDateTime now = LocalDateTime.now();
        
        for (Stock stock : stocks) {
            // Mock price update logic (replace with actual API call)
            BigDecimal randomFactor = new BigDecimal(Math.random() * 0.06 - 0.03);  // Random change between -3% and +3%
            BigDecimal newPrice = stock.getCurrentPrice().multiply(BigDecimal.ONE.add(randomFactor))
                    .setScale(2, RoundingMode.HALF_UP);
            
            stock.setPreviousClose(stock.getCurrentPrice());
            stock.setCurrentPrice(newPrice);
            stock.setDayHigh(stock.getDayHigh() != null && stock.getDayHigh().compareTo(newPrice) > 0 ? 
                    stock.getDayHigh() : newPrice);
            stock.setDayLow(stock.getDayLow() != null && stock.getDayLow().compareTo(newPrice) < 0 ? 
                    stock.getDayLow() : newPrice);
            stock.setLastUpdated(now);
        }
        
        stockRepository.saveAll(stocks);
    }
}