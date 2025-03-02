package com.assettracker.dto;

import com.assettracker.model.StockHolding;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockHoldingDto {
    private Long id;
    private String symbol;
    private String name;
    @NotNull
    @Positive
    private BigDecimal quantity;
    @NotNull
    @Positive
    private BigDecimal purchasePrice;
    private BigDecimal currentPrice;
    private BigDecimal currentValue;
    private BigDecimal profitLoss;
    private BigDecimal profitLossPercentage;
    private String currency;
    
    public StockHoldingDto(StockHolding holding) {
        this.id = holding.getId();
        this.symbol = holding.getStock().getSymbol();
        this.name = holding.getStock().getName();
        this.quantity = holding.getQuantity();
        this.purchasePrice = holding.getAveragePurchasePrice();
        this.currentPrice = holding.getStock().getCurrentPrice();
        this.currentValue = holding.getCurrentValue();
        this.profitLoss = holding.getProfitLoss();
        this.profitLossPercentage = holding.getProfitLossPercentage();
        this.currency = "USD"; // Default, will be converted if needed
    }
}