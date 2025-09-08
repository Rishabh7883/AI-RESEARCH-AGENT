package com.airesearchagent.ai_research_agent.controller;



import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.airesearchagent.ai_research_agent.model.User;
import com.airesearchagent.ai_research_agent.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private PasswordEncoder passwordEncoder;
   
    @Autowired
    private UserService userService;

     @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User _user) {

        // Validate fields
        if (_user.getFullname() == null || _user.getFullname().isEmpty() ||
            _user.getEmail() == null || _user.getEmail().isEmpty() ||
            _user.getPassword() == null || _user.getPassword().isEmpty()) {

            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "All fields are required"
            ));
        }

        // Check if email already exists
        if (userService.emailExists(_user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "success", false,
                    "message", "Email already registered"
            ));
        }

        // Encode password before saving
       // _user.setPassword(passwordEncoder.encode(_user.getPassword()));

        // Save user
        userService.save(_user);

        // Return success response with fullname and email
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User registered successfully",
                "fullname", _user.getFullname(),
                "email", _user.getEmail()
        ));
    }

     @GetMapping("/login")
    public String login(Model model){
           return "login";
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User _user, HttpServletRequest request) {
        Optional<User> optionalUser = userService.findOneByEmail(_user.getEmail());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Simple password check (replace with BCrypt in prod)
            if (passwordEncoder.matches(_user.getPassword(), user.getPassword())) {

                   // 🔹 Create session and store user details
            HttpSession session = request.getSession(true); // true = create if not exists
            session.setAttribute("userEmail", user.getEmail());
            session.setAttribute("userId", user.getId()); // optional

                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Login successful",
                        "email", user.getEmail(),
                        "fullname",user.getFullname()

                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "success", false,
                                "message", "Invalid password"
                        ));
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "success", false,
                            "message", "User not found"
                    ));
        }
    }

     @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Logout successful"
        ));
    }

}
