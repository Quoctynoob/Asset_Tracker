package com.assettracker.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import com.assettracker.model.Portfolio;
import com.assettracker.model.StockHolding;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Portfolio DTOs
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioDto {
    private Long id;
    private String name;
    private String description;
    private List<StockHoldingDto> holdings;
    private BigDecimal totalValue;
    private BigDecimal totalCost;
    private BigDecimal totalProfitLoss;
    private BigDecimal totalProfitLossPercentage;
    private String currency;
    
    public PortfolioDto(Portfolio portfolio, List<StockHolding> holdings, String currency) {
        this.id = portfolio.getId();
        this.name = portfolio.getName();
        this.description = portfolio.getDescription();
        this.currency = currency;
        
        this.holdings = holdings.stream()
                .map(StockHoldingDto::new)
                .collect(Collectors.toList());
        
        this.totalValue = BigDecimal.ZERO;
        this.totalCost = BigDecimal.ZERO;
        
        for (StockHolding holding : holdings) {
            this.totalValue = this.totalValue.add(holding.getCurrentValue());
            this.totalCost = this.totalCost.add(holding.getAveragePurchasePrice().multiply(holding.getQuantity()));
        }
        
        this.totalProfitLoss = this.totalValue.subtract(this.totalCost);
        this.totalProfitLossPercentage = this.totalCost.compareTo(BigDecimal.ZERO) > 0 ?
                this.totalProfitLoss.divide(this.totalCost, 4, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal("100")) :
                BigDecimal.ZERO;
    }
}
