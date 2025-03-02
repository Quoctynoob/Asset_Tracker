package com.assettracker.repository;

import com.assettracker.model.StockNews;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockNewsRepository extends JpaRepository<StockNews, Long> {
    Page<StockNews> findAllByOrderByPublishedAtDesc(Pageable pageable);
    
    @Query("SELECT n FROM StockNews n WHERE n.relatedSymbols LIKE %?1% ORDER BY n.publishedAt DESC")
    List<StockNews> findByStockSymbol(String symbol, Pageable pageable);
    
    List<StockNews> findByPublishedAtAfter(LocalDateTime date, Pageable pageable);
}