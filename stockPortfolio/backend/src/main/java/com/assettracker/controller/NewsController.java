package com.assettracker.controller;

import com.assettracker.model.StockNews;
import com.assettracker.model.User;
import com.assettracker.service.NewsService;
import com.assettracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<StockNews>> getLatestNews(
            @RequestParam(defaultValue = "10") int count) {
        return ResponseEntity.ok(newsService.getLatestNews(count));
    }

    @GetMapping("/stock/{symbol}")
    public ResponseEntity<List<StockNews>> getNewsForStock(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "5") int count) {
        return ResponseEntity.ok(newsService.getNewsForStock(symbol, count));
    }

    @GetMapping("/portfolio")
    public ResponseEntity<List<StockNews>> getNewsForPortfolio(
            Authentication authentication,
            @RequestParam(defaultValue = "10") int count) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        
        return ResponseEntity.ok(newsService.getNewsForUserPortfolio(user.getId(), count));
    }
}