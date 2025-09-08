package com.airesearchagent.ai_research_agent.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.airesearchagent.ai_research_agent.model.User;
import com.airesearchagent.ai_research_agent.repository.UserRepository;

@Service
public class UserService implements UserDetailsService{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User save(User user){
         user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findOneByEmail(String email) {
        return userRepository.findOneByEmailIgnoreCase(email);
    }

      public Optional<User> findById(Long id) {
        return userRepository.findById(id);
        
    }
    
    public boolean emailExists(String email) {
        return userRepository.findOneByEmailIgnoreCase(email).isPresent();
    }


   @Override
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Optional<User> optionalAccount = userRepository.findOneByEmailIgnoreCase(email);
    if (!optionalAccount.isPresent()) {
        throw new UsernameNotFoundException("Account not found");
    }

    User user = optionalAccount.get();

    // ✅ Assign only a default role
    List<GrantedAuthority> grantedAuthorities = 
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));

    // ✅ Return Spring Security User
      return new org.springframework.security.core.userdetails.User( user.getEmail(),
            user.getPassword(),
            grantedAuthorities);
}
}
