package com.airesearchagent.ai_research_agent.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    static PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // disable CSRF for POST requests from frontend
            .cors(cors -> {})  // ✅ Enable CORS and use WebConfig
            .authorizeHttpRequests(auth -> auth
                // Allow all requests to these endpoints
                .requestMatchers("/api/auth/**").permitAll() // Allow index and research endpoint
                .requestMatchers("/research").permitAll()
                .requestMatchers("/api/auth/register").permitAll()
                // Protect everything else
                .anyRequest().authenticated()
            );
           /* .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .usernameParameter("email")
                .passwordParameter("password")
                .defaultSuccessUrl("/research", true)
                .failureUrl("/login?error")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
            );*/
        return http.build();
    }
}