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

    // @Value("${google.api.key}")
    // private String googleKey;

    // @Value("${google.customsearch.cx}")
    // private String searchEngineId;

    @Value("${tavily.api.key}")
    private String tavilyKey;

    @Value("${groq.api.key}")
    private String groqKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.tavily.com")
            .build();

    // private List<Article> fetchGoogleResults(String topic) {
    //     String searchUrl = String.format(
    //             "https://www.googleapis.com/customsearch/v1?key=%s&cx=%s&q=%s",
    //             googleKey, searchEngineId, topic.replace(" ", "+")
    //     );
    //
    //     Map<String, Object> searchResults = restTemplate.getForObject(searchUrl, Map.class);
    //     List<Map<String, Object>> items =
    //             (List<Map<String, Object>>) searchResults.get("items");
    //
    //     List<Article> articles = new ArrayList<>();
    //     if (items != null) {
    //         for (int i = 0; i < Math.min(5, items.size()); i++) {
    //             Map<String, Object> item = items.get(i);
    //             Article a = new Article();
    //             a.setTitle((String) item.get("title"));
    //             a.setLink((String) item.get("link"));
    //             a.setSnippet((String) item.get("snippet"));
    //             articles.add(a);
    //         }
    //     }
    //     return articles;
    // }


    //use tavily search engine instead of google search engine 
    private List<Article> fetchTavilyResults(String topic) {

        Map<String, Object> requestBody = Map.of(
                "api_key", tavilyKey,
                "query", topic,
                "search_depth", "advanced",
                "max_results", 5,
                "include_answers", false,
                "include_raw_content", false
        );

        Map<String, Object> response = webClient.post()
                .uri("/search")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List<Map<String, Object>> results =
                (List<Map<String, Object>>) response.get("results");

        List<Article> articles = new ArrayList<>();

        if (results != null) {
            for (Map<String, Object> r : results) {
                Article a = new Article();
                a.setTitle((String) r.get("title"));
                a.setLink((String) r.get("url"));
                a.setSnippet((String) r.get("content"));
                articles.add(a);
            }
        }
        return articles;
    }

    private String callGroq(String prompt) {
        WebClient client = WebClient.builder()
                .baseUrl("https://api.groq.com/openai/v1/chat/completions")
                .defaultHeader("Authorization", "Bearer " + groqKey)
                .defaultHeader("Content-Type", "application/json")
                .build();

        Map<String, Object> requestBody = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", List.of(
                        Map.of("role", "system",
                                "content", "You are a research assistant. Provide a concise summary as multiple bullet points, one per line."),
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

            List<Map<String, Object>> choices =
                    (List<Map<String, Object>>) response.get("choices");

            Map<String, Object> message =
                    (Map<String, Object>) choices.get(0).get("message");

            return message.get("content").toString();

        } catch (WebClientResponseException e) {
            return "HTTP error " + e.getStatusCode();
        } catch (Exception e) {
            return "Error calling Groq API: " + e.getMessage();
        }
    }

    public Map<String, Object> fetchResearch(String topic) {

        // List<Article> articles = fetchGoogleResults(topic);
        List<Article> articles = fetchTavilyResults(topic);

        StringBuilder prompt = new StringBuilder("Summarize these articles:\n\n");
        for (Article a : articles) {
            prompt.append("- ")
                  .append(a.getTitle())
                  .append(": ")
                  .append(a.getSnippet())
                  .append("\n");
        }

        return Map.of(
                "topic", topic,
                "articles", articles,
                "summary", callGroq(prompt.toString())
        );
    }
}
