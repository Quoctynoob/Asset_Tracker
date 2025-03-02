package com.assettracker.repository;

import com.assettracker.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, String> {
    List<Stock> findBySymbolIn(List<String> symbols);
    Optional<Stock> findBySymbol(String symbol);
    List<Stock> findByNameContainingIgnoreCase(String name);
}