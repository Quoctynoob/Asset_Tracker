package com.assettracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_holdings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockHolding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stock_symbol", nullable = false)
    private Stock stock;

    @Column(nullable = false)
    private BigDecimal quantity;

    @Column(nullable = false)
    private BigDecimal averagePurchasePrice;

    @Column(nullable = false)
    private LocalDateTime purchaseDate;

    @Transient
    public BigDecimal getCurrentValue() {
        return this.stock.getCurrentPrice().multiply(this.quantity);
    }

    @Transient
    public BigDecimal getProfitLoss() {
        BigDecimal costBasis = this.averagePurchasePrice.multiply(this.quantity);
        return this.getCurrentValue().subtract(costBasis);
    }

    @Transient
    public BigDecimal getProfitLossPercentage() {
        BigDecimal costBasis = this.averagePurchasePrice.multiply(this.quantity);
        return this.getProfitLoss().divide(costBasis, 4, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal("100"));
    }
}