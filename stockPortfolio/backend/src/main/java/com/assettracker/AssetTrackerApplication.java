package com.assettracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // For scheduled tasks like stock updates
public class AssetTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(AssetTrackerApplication.class, args);
    }
}