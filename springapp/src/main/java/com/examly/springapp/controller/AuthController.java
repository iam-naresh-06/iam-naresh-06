package com.examly.springapp.controller;

import com.examly.springapp.config.JwtService;
import com.examly.springapp.entity.User;
import com.examly.springapp.service.AuthService;
import com.examly.springapp.service.BorrowerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final BorrowerService borrowerService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody RegistrationRequest request) {
        User user = new User();
        user.setUsername(request.username);
        user.setEmail(request.email);
        user.setPasswordHash(request.password);
        user.setFirstName(request.firstName);
        user.setLastName(request.lastName);
        user.setRole(User.Role.BORROWER);

        User savedUser = authService.registerUser(user);
        
        // Automatically create borrower account for new users
        if (request.autoCreateBorrower) {
            borrowerService.createBorrower(savedUser.getId(), request.membershipType);
        }

        String jwtToken = jwtService.generateToken(savedUser);

        Map<String, String> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("role", savedUser.getRole().name());
        response.put("username", savedUser.getUsername());
        response.put("userId", savedUser.getId().toString());
        return response;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody AuthRequest request) {
        User user = authService.authenticateUser(request.email, request.password);
        String jwtToken = jwtService.generateToken(user);

        Map<String, String> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("role", user.getRole().name());
        response.put("username", user.getUsername());
        response.put("userId", user.getId().toString());
        
        // Add borrower info if available
        borrowerService.getBorrowerByUserId(user.getId()).ifPresent(borrower -> {
            response.put("borrowerId", borrower.getId().toString());
            response.put("libraryCardNumber", borrower.getLibraryCardNumber());
        });

        return response;
    }

    public static class RegistrationRequest {
        public String username;
        public String email;
        public String password;
        public String firstName;
        public String lastName;
        public boolean autoCreateBorrower = true;
        public String membershipType = "STANDARD";
    }

    public static class AuthRequest {
        public String email;
        public String password;
    }
}