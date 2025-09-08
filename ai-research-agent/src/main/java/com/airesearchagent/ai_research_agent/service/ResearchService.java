package com.airesearchagent.ai_research_agent.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.airesearchagent.ai_research_agent.model.Article;

@Service
public class ResearchService {

    @Value("${google.api.key}")
    private String googleKey;

    @Value("${google.customsearch.cx}")
    private String searchEngineId;

    @Value("${groq.api.key}")
    private String groqKey;  

    private final RestTemplate restTemplate = new RestTemplate();

    // Fetch top 5 Google search results
    private List<Article> fetchGoogleResults(String topic) {
        String searchUrl = String.format(
                "https://www.googleapis.com/customsearch/v1?key=%s&cx=%s&q=%s",
                googleKey, searchEngineId, topic.replace(" ", "+")
        );

        Map<String, Object> searchResults = restTemplate.getForObject(searchUrl, Map.class);
        List<Map<String, Object>> items = (List<Map<String, Object>>) searchResults.get("items");

        List<Article> articles = new ArrayList<>();
        if (items != null) {
            for (int i = 0; i < Math.min(5, items.size()); i++) {
                Map<String, Object> item = items.get(i);
                Article a = new Article();
                a.setTitle((String) item.get("title"));
                a.setLink((String) item.get("link"));
                a.setSnippet((String) item.get("snippet"));
                articles.add(a);
            }
        }
        return articles;
    }

    // Call Groq API 
    private String callGroq(String prompt) {
        WebClient client = WebClient.builder()
                .baseUrl("https://api.groq.com/openai/v1/chat/completions") // ✅ Groq endpoint
                .defaultHeader("Authorization", "Bearer " + groqKey)
                .defaultHeader("Content-Type", "application/json")
                .build();

        Map<String, Object> requestBody = Map.of(
            //Most powerful, versatile LLaMA 3.3 model (70B params).
                "model", "llama-3.3-70b-versatile",  //  Groq model
                "messages", List.of(
                        Map.of("role", "system", "content", "You are a research assistant. Provide a concise summary as multiple bullet points, one per line."),
                        Map.of("role", "user", "content", prompt)
                ),
                "max_tokens", 500,
                "temperature", 0.7
        );

        try {
            Map<String, Object> response = client.post()
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null || response.get("choices") == null) {
                return "No response from Groq.";
            }

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

            return message.get("content").toString();

        } catch (WebClientResponseException e) {
            e.printStackTrace();
            return "HTTP error " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error calling Groq API: " + e.getMessage();
        }
    }

    // Main method: Fetch + Summarize
    public Map<String, Object> fetchResearch(String topic) {
        List<Article> articles = fetchGoogleResults(topic);

        StringBuilder prompt = new StringBuilder("Summarize these articles:\n\n");
        for (Article a : articles) {
            prompt.append("- ").append(a.getTitle())
                    .append(": ").append(a.getSnippet()).append("\n");
        }
        prompt.append("\nYou are a research assistant. Provide a concise summary as multiple bullet points, one per line.");

        return Map.of(
                "topic", topic,
                "articles", articles,
                "summary", callGroq(prompt.toString())
        );
    }
}
