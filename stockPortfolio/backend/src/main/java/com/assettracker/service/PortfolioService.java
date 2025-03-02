package com.assettracker.service;

import com.assettracker.dto.PortfolioDto;
import com.assettracker.dto.PortfolioSummaryDto;
import com.assettracker.exception.ResourceNotFoundException;
import com.assettracker.model.Portfolio;
import com.assettracker.model.Stock;
import com.assettracker.model.StockHolding;
import com.assettracker.model.User;
import com.assettracker.repository.PortfolioRepository;
import com.assettracker.repository.StockHoldingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private StockHoldingRepository stockHoldingRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private StockService stockService;

    public List<PortfolioSummaryDto> getUserPortfolios(Long userId) {
        User user = userService.getUserById(userId);
        List<Portfolio> portfolios = portfolioRepository.findByUser(user);
        
        return portfolios.stream().map(portfolio -> {
            List<StockHolding> holdings = stockHoldingRepository.findByPortfolio(portfolio);
            
            BigDecimal totalValue = BigDecimal.ZERO;
            BigDecimal totalCost = BigDecimal.ZERO;
            
            for (StockHolding holding : holdings) {
                BigDecimal currentValue = holding.getCurrentValue();
                BigDecimal cost = holding.getAveragePurchasePrice().multiply(holding.getQuantity());
                
                totalValue = totalValue.add(currentValue);
                totalCost = totalCost.add(cost);
            }
            
            BigDecimal totalProfitLoss = totalValue.subtract(totalCost);
            BigDecimal totalProfitLossPercentage = totalCost.compareTo(BigDecimal.ZERO) > 0 ?
                    totalProfitLoss.divide(totalCost, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100")) :
                    BigDecimal.ZERO;
            
            return new PortfolioSummaryDto(
                    portfolio.getId(),
                    portfolio.getName(),
                    portfolio.getDescription(),
                    holdings.size(),
                    totalValue,
                    totalProfitLoss,
                    totalProfitLossPercentage,
                    user.getPreferredCurrency()
            );
        }).collect(Collectors.toList());
    }

    public PortfolioDto getPortfolio(Long userId, Long portfolioId) {
        User user = userService.getUserById(userId);
        Portfolio portfolio = portfolioRepository.findByIdAndUser(portfolioId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + portfolioId));
        
        List<StockHolding> holdings = stockHoldingRepository.findByPortfolio(portfolio);
        
        return new PortfolioDto(portfolio, holdings, user.getPreferredCurrency());
    }

    public Portfolio createPortfolio(Long userId, PortfolioDto portfolioDto) {
        User user = userService.getUserById(userId);
        
        Portfolio portfolio = new Portfolio();
        portfolio.setName(portfolioDto.getName());
        portfolio.setDescription(portfolioDto.getDescription());
        portfolio.setUser(user);
        
        return portfolioRepository.save(portfolio);
    }

    public Portfolio updatePortfolio(Long userId, Long portfolioId, PortfolioDto portfolioDto) {
        User user = userService.getUserById(userId);
        Portfolio portfolio = portfolioRepository.findByIdAndUser(portfolioId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + portfolioId));
        
        portfolio.setName(portfolioDto.getName());
        portfolio.setDescription(portfolioDto.getDescription());
        
        return portfolioRepository.save(portfolio);
    }

    public void deletePortfolio(Long userId, Long portfolioId) {
        User user = userService.getUserById(userId);
        Portfolio portfolio = portfolioRepository.findByIdAndUser(portfolioId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + portfolioId));
        
        portfolioRepository.delete(portfolio);
    }

    public StockHolding addStockToPortfolio(Long userId, Long portfolioId, String stockSymbol, BigDecimal quantity, BigDecimal purchasePrice) {
        User user = userService.getUserById(userId);
        Portfolio portfolio = portfolioRepository.findByIdAndUser(portfolioId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + portfolioId));
        
        Stock stock = stockService.getStockBySymbol(stockSymbol);
        
        // Check if user already owns this stock in this portfolio
        StockHolding existingHolding = stockHoldingRepository.findByUserAndStockAndPortfolio(user, stock, portfolio)
                .orElse(null);
        
        if (existingHolding != null) {
            // Update existing holding with new average purchase price
            BigDecimal totalQuantity = existingHolding.getQuantity().add(quantity);
            BigDecimal totalCost = existingHolding.getAveragePurchasePrice().multiply(existingHolding.getQuantity())
                    .add(purchasePrice.multiply(quantity));
            
            BigDecimal newAveragePrice = totalCost.divide(totalQuantity, 2, RoundingMode.HALF_UP);
            
            existingHolding.setQuantity(totalQuantity);
            existingHolding.setAveragePurchasePrice(newAveragePrice);
            
            return stockHoldingRepository.save(existingHolding);
        } else {
            // Create new holding
            StockHolding newHolding = new StockHolding();
            newHolding.setUser(user);
            newHolding.setPortfolio(portfolio);
            newHolding.setStock(stock);
            newHolding.setQuantity(quantity);
            newHolding.setAveragePurchasePrice(purchasePrice);
            newHolding.setPurchaseDate(java.time.LocalDateTime.now());
            
            return stockHoldingRepository.save(newHolding);
        }
    }

    public void removeStockFromPortfolio(Long userId, Long portfolioId, Long holdingId) {
        User user = userService.getUserById(userId);
        Portfolio portfolio = portfolioRepository.findByIdAndUser(portfolioId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + portfolioId));
        
        StockHolding holding = stockHoldingRepository.findById(holdingId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock holding not found with id: " + holdingId));
        
        if (!holding.getUser().getId().equals(userId) || !holding.getPortfolio().getId().equals(portfolioId)) {
            throw new IllegalArgumentException("Stock holding does not belong to this user or portfolio");
        }
        
        stockHoldingRepository.delete(holding);
    }

    public StockHolding updateStockHolding(Long userId, Long portfolioId, Long holdingId, BigDecimal quantity, BigDecimal purchasePrice) {
        User user = userService.getUserById(userId);
        Portfolio portfolio = portfolioRepository.findByIdAndUser(portfolioId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + portfolioId));
        
        StockHolding holding = stockHoldingRepository.findById(holdingId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock holding not found with id: " + holdingId));
        
        if (!holding.getUser().getId().equals(userId) || !holding.getPortfolio().getId().equals(portfolioId)) {
            throw new IllegalArgumentException("Stock holding does not belong to this user or portfolio");
        }
        
        holding.setQuantity(quantity);
        holding.setAveragePurchasePrice(purchasePrice);
        
        return stockHoldingRepository.save(holding);
    }
}