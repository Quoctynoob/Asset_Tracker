package com.assettracker.service;

import com.assettracker.dto.AuthResponseDto;
import com.assettracker.dto.LoginDto;
import com.assettracker.dto.UserDto;
import com.assettracker.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    public AuthResponseDto login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtService.generateToken(loginDto.getUsername());
        
        User user = userService.getUserByUsername(loginDto.getUsername());
        
        return new AuthResponseDto(jwt, user.getId(), user.getUsername(), user.getEmail(), user.getPreferredCurrency());
    }

    public AuthResponseDto register(UserDto userDto) {
        User user = userService.createUser(userDto);
        String jwt = jwtService.generateToken(user.getUsername());
        
        return new AuthResponseDto(jwt, user.getId(), user.getUsername(), user.getEmail(), user.getPreferredCurrency());
    }
}