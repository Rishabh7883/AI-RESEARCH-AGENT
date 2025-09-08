package com.airesearchagent.ai_research_agent.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.airesearchagent.ai_research_agent.service.ResearchService;

@Controller
public class ResearchController {

    @Autowired
    private ResearchService researchService;

    
    // Handle search request and return result on same page
@PostMapping("/research")
@ResponseBody
public ResponseEntity<?> search(@RequestParam String topic) {
    if (topic == null || topic.isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("error", "Topic is required"));
    }

    Map<String, Object> researchData = researchService.fetchResearch(topic);
    

    // Convert "articles" to "links" for frontend compatibility
    List<Map<String, String>> articles = (List<Map<String, String>>) researchData.get("articles");
    Map<String, Object> result = Map.of(
            "summary", researchData.get("summary"),
            "links", articles != null ? articles : List.of()
    );

    return ResponseEntity.ok(Map.of("topic", topic, "result", result));
}

}

