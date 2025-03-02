package com.assettracker.controller;

import com.assettracker.dto.PortfolioDto;
import com.assettracker.dto.PortfolioSummaryDto;
import com.assettracker.dto.StockHoldingDto;
import com.assettracker.model.Portfolio;
import com.assettracker.model.StockHolding;
import com.assettracker.model.User;
import com.assettracker.service.PortfolioService;
import com.assettracker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/portfolios")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<PortfolioSummaryDto>> getUserPortfolios(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        
        return ResponseEntity.ok(portfolioService.getUserPortfolios(user.getId()));
    }

    @GetMapping("/{portfolioId}")
    public ResponseEntity<PortfolioDto> getPortfolio(
            @PathVariable Long portfolioId,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        
        return ResponseEntity.ok(portfolioService.getPortfolio(user.getId(), portfolioId));
    }

    @PostMapping
    public ResponseEntity<Portfolio> createPortfolio(
            @Valid @RequestBody PortfolioDto portfolioDto,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        
        return ResponseEntity.ok(portfolioService.createPortfolio(user.getId(), portfolioDto));
    }

    @PutMapping("/{portfolioId}")
    public ResponseEntity<Portfolio> updatePortfolio(
            @PathVariable Long portfolioId,
            @Valid @RequestBody PortfolioDto portfolioDto,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        
        return ResponseEntity.ok(portfolioService.updatePortfolio(user.getId(), portfolioId, portfolioDto));
    }

    @DeleteMapping("/{portfolioId}")
    public ResponseEntity<Void> deletePortfolio(
            @PathVariable Long portfolioId,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        
        portfolioService.deletePortfolio(user.getId(), portfolioId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{portfolioId}/stocks")
    public ResponseEntity<StockHolding> addStockToPortfolio(
            @PathVariable Long portfolioId,
            @Valid @RequestBody StockHoldingDto holdingDto,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        
        return ResponseEntity.ok(portfolioService.addStockToPortfolio(
                user.getId(),
                portfolioId,
                holdingDto.getSymbol(),
                holdingDto.getQuantity(),
                holdingDto.getPurchasePrice()));
    }

    @DeleteMapping("/{portfolioId}/stocks/{holdingId}")
    public ResponseEntity<Void> removeStockFromPortfolio(
            @PathVariable Long portfolioId,
            @PathVariable Long holdingId,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        
        portfolioService.removeStockFromPortfolio(user.getId(), portfolioId, holdingId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{portfolioId}/stocks/{holdingId}")
    public ResponseEntity<StockHolding> updateStockHolding(
            @PathVariable Long portfolioId,
            @PathVariable Long holdingId,
            @Valid @RequestBody StockHoldingDto holdingDto,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        
        return ResponseEntity.ok(portfolioService.updateStockHolding(
                user.getId(),
                portfolioId,
                holdingId,
                holdingDto.getQuantity(),
                holdingDto.getPurchasePrice()));
    }
}