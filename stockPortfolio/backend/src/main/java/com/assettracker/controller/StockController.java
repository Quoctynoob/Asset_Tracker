package com.assettracker.controller;

import com.assettracker.dto.StockDto;
import com.assettracker.model.Stock;
import com.assettracker.model.User;
import com.assettracker.service.StockService;
import com.assettracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/stocks")
public class StockController {

    @Autowired
    private StockService stockService;

    @Autowired
    private UserService userService;

    @GetMapping("/public/search")
    public ResponseEntity<List<Stock>> searchStocks(@RequestParam String query) {
        return ResponseEntity.ok(stockService.searchStocks(query));
    }

    @GetMapping("/public/{symbol}")
    public ResponseEntity<Stock> getStockPublic(@PathVariable String symbol) {
        return ResponseEntity.ok(stockService.getStockBySymbol(symbol));
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<StockDto> getStock(
            @PathVariable String symbol,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        
        Stock stock = stockService.getStockBySymbol(symbol);
        StockDto stockDto = stockService.convertCurrency(stock, user.getPreferredCurrency());
        
        return ResponseEntity.ok(stockDto);
    }

    @GetMapping("/batch")
    public ResponseEntity<List<StockDto>> getStocks(
            @RequestParam List<String> symbols,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        
        List<Stock> stocks = stockService.getStocksBySymbols(symbols);
        List<StockDto> stockDtos = stocks.stream()
                .map(stock -> stockService.convertCurrency(stock, user.getPreferredCurrency()))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(stockDtos);
    }
}