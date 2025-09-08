package com.airesearchagent.ai_research_agent.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airesearchagent.ai_research_agent.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
        Optional<User> findOneByEmailIgnoreCase(String email);

}
