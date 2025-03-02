package com.assettracker.controller;

import com.assettracker.dto.CurrencyUpdateDto;
import com.assettracker.model.User;
import com.assettracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/currency")
    public ResponseEntity<User> updatePreferredCurrency(
            Authentication authentication,
            @RequestBody CurrencyUpdateDto currencyUpdateDto) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        User updatedUser = userService.updateUserPreferredCurrency(user.getId(), currencyUpdateDto.getCurrency());
        
        return ResponseEntity.ok(updatedUser);
    }
}