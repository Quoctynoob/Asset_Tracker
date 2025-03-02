package com.assettracker.repository;

import com.assettracker.model.Portfolio;
import com.assettracker.model.Stock;
import com.assettracker.model.StockHolding;
import com.assettracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockHoldingRepository extends JpaRepository<StockHolding, Long> {
    List<StockHolding> findByUser(User user);
    List<StockHolding> findByPortfolio(Portfolio portfolio);
    Optional<StockHolding> findByUserAndStockAndPortfolio(User user, Stock stock, Portfolio portfolio);
    
    @Query("SELECT DISTINCT sh.stock.symbol FROM StockHolding sh WHERE sh.user = ?1")
    List<String> findDistinctStockSymbolsByUser(User user);
}