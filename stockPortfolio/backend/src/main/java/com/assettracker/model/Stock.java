package com.assettracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stock {

    @Id
    @Column(nullable = false, unique = true)
    private String symbol;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal currentPrice;

    @Column(nullable = true)
    private BigDecimal previousClose;

    @Column(nullable = true)
    private BigDecimal dayHigh;

    @Column(nullable = true)
    private BigDecimal dayLow;

    @Column(nullable = true)
    private Long volume;

    @Column(nullable = true)
    private String exchange;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;
}