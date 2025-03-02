package com.assettracker.service;

import com.assettracker.model.StockNews;
import com.assettracker.model.User;
import com.assettracker.repository.StockHoldingRepository;
import com.assettracker.repository.StockNewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NewsService {

    @Autowired
    private StockNewsRepository newsRepository;

    @Autowired
    private StockHoldingRepository stockHoldingRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private WebClient.Builder webClientBuilder;

    @Value("${news.api.url}")
    private String newsApiUrl;

    @Value("${news.api.key}")
    private String newsApiKey;

    public List<StockNews> getLatestNews(int count) {
        Pageable pageable = PageRequest.of(0, count);
        return newsRepository.findAllByOrderByPublishedAtDesc(pageable).getContent();
    }

    public List<StockNews> getNewsForStock(String symbol, int count) {
        Pageable pageable = PageRequest.of(0, count);
        return newsRepository.findByStockSymbol(symbol, pageable);
    }

    public List<StockNews> getNewsForUserPortfolio(Long userId, int count) {
        User user = userService.getUserById(userId);
        List<String> userStockSymbols = stockHoldingRepository.findDistinctStockSymbolsByUser(user);
        
        if (userStockSymbols.isEmpty()) {
            return getLatestNews(count);
        }
        
        List<StockNews> allNews = new ArrayList<>();
        
        for (String symbol : userStockSymbols) {
            allNews.addAll(newsRepository.findByStockSymbol(symbol, PageRequest.of(0, count)));
        }
        
        // Sort and limit results
        return allNews.stream()
                .sorted((a, b) -> b.getPublishedAt().compareTo(a.getPublishedAt()))
                .limit(count)
                .toList();
    }

    @Scheduled(fixedRate = 3600000)  // Fetch news every hour
    public void fetchLatestNews() {
        // In a real implementation, call news API to fetch the latest news
        // For this example, we'll just simulate fetching news
        
        LocalDateTime now = LocalDateTime.now();
        
        // This is a mock implementation - replace with actual API call in a real application
        List<StockNews> mockNews = List.of(
            new StockNews(null, "Tech Stocks Rally on Strong Earnings", 
                "Major tech companies reported better-than-expected earnings, driving market gains.", 
                "Financial Times", "https://example.com/news1", 
                "https://example.com/images/news1.jpg", now, "AAPL,MSFT,GOOGL"),
                
            new StockNews(null, "Fed Signals Interest Rate Cut", 
                "The Federal Reserve indicated it may cut interest rates in the coming months.", 
                "Wall Street Journal", "https://example.com/news2", 
                "https://example.com/images/news2.jpg", now.minusHours(1), "SPY,QQQ"),
                
            new StockNews(null, "Oil Prices Surge Amid Middle East Tensions", 
                "Crude oil prices jumped 3% as geopolitical tensions escalated.", 
                "Bloomberg", "https://example.com/news3", 
                "https://example.com/images/news3.jpg", now.minusHours(2), "XOM,CVX")
        );
        
        newsRepository.saveAll(mockNews);
    }
}