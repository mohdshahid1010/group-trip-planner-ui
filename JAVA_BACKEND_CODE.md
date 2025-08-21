# Java Backend Code for /v1/search Endpoint

## Required Java Classes

### 1. SearchCriteria.java (Request POJO)
```java
package your.package.name.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class SearchCriteria {
    private String prompt;
    private String source;
    private String destination;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private String startDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private String endDate;
    
    private BudgetRange budget;
    private String vibe;
    
    // Constructors
    public SearchCriteria() {}
    
    public SearchCriteria(String prompt, String source, String destination, 
                         String startDate, String endDate, BudgetRange budget, String vibe) {
        this.prompt = prompt;
        this.source = source;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;
        this.vibe = vibe;
    }
    
    // Getters and Setters
    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    
    public BudgetRange getBudget() { return budget; }
    public void setBudget(BudgetRange budget) { this.budget = budget; }
    
    public String getVibe() { return vibe; }
    public void setVibe(String vibe) { this.vibe = vibe; }
}
```

### 2. BudgetRange.java
```java
package your.package.name.dto;

public class BudgetRange {
    private int min;
    private int max;
    
    // Constructors
    public BudgetRange() {}
    
    public BudgetRange(int min, int max) {
        this.min = min;
        this.max = max;
    }
    
    // Getters and Setters
    public int getMin() { return min; }
    public void setMin(int min) { this.min = min; }
    
    public int getMax() { return max; }
    public void setMax(int max) { this.max = max; }
}
```

### 3. SearchResponseDTO.java (Response POJO)
```java
package your.package.name.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class SearchResponseDTO {
    private int id;
    private String itinerary;
    private String description;
    private Double matchingScore;
    private Double price;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime start;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime end;
    
    private String source;
    private String destination;
    
    // Constructors
    public SearchResponseDTO() {}
    
    public SearchResponseDTO(int id, String itinerary, String description, 
                           Double matchingScore, Double price, LocalDateTime start, 
                           LocalDateTime end, String source, String destination) {
        this.id = id;
        this.itinerary = itinerary;
        this.description = description;
        this.matchingScore = matchingScore;
        this.price = price;
        this.start = start;
        this.end = end;
        this.source = source;
        this.destination = destination;
    }
    
    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getItinerary() { return itinerary; }
    public void setItinerary(String itinerary) { this.itinerary = itinerary; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Double getMatchingScore() { return matchingScore; }
    public void setMatchingScore(Double matchingScore) { this.matchingScore = matchingScore; }
    
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    
    public LocalDateTime getStart() { return start; }
    public void setStart(LocalDateTime start) { this.start = start; }
    
    public LocalDateTime getEnd() { return end; }
    public void setEnd(LocalDateTime end) { this.end = end; }
    
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
}
```

### 4. SearchController.java
```java
package your.package.name.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import your.package.name.dto.SearchCriteria;
import your.package.name.dto.SearchResponseDTO;
import your.package.name.dto.BudgetRange;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/v1")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SearchController {
    
    @PostMapping("/search")
    public ResponseEntity<List<SearchResponseDTO>> search(@RequestBody SearchCriteria criteria) {
        
        // Log the received request for debugging
        System.out.println("Received search request: " + criteria.toString());
        
        // Mock response data - replace with your actual search logic
        List<SearchResponseDTO> mockResults = Arrays.asList(
            new SearchResponseDTO(
                1,
                "Amazing Goa Beach Adventure",
                "Experience the beautiful beaches and vibrant nightlife of Goa",
                95.5,
                25000.0,
                LocalDateTime.now().plusDays(30),
                LocalDateTime.now().plusDays(35),
                criteria.getSource(),
                "Goa"
            ),
            new SearchResponseDTO(
                2, 
                "Himachal Hill Station Tour",
                "Explore the scenic hill stations of Himachal Pradesh",
                87.2,
                18000.0,
                LocalDateTime.now().plusDays(45),
                LocalDateTime.now().plusDays(50),
                criteria.getSource(),
                "Himachal Pradesh"
            ),
            new SearchResponseDTO(
                3,
                "Kerala Backwater Experience",
                "Relax in the serene backwaters of Kerala",
                92.8,
                22000.0,
                LocalDateTime.now().plusDays(60),
                LocalDateTime.now().plusDays(65),
                criteria.getSource(),
                "Kerala"
            )
        );
        
        // Filter results based on criteria (add your actual filtering logic)
        List<SearchResponseDTO> filteredResults = filterResults(mockResults, criteria);
        
        return ResponseEntity.ok(filteredResults);
    }
    
    private List<SearchResponseDTO> filterResults(List<SearchResponseDTO> results, SearchCriteria criteria) {
        // Add your actual filtering logic here
        // For now, return all results
        return results;
    }
}
```

## CORS Configuration (Important!)

### Create this configuration class:

```java
package your.package.name.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/v1/**")
                .allowedOriginPatterns("http://localhost:*", "https://*.netlify.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## Dependencies (Add to pom.xml or build.gradle)

### Maven (pom.xml):
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

### Gradle (build.gradle):
```gradle
implementation 'org.springframework.boot:spring-boot-starter-web'
implementation 'com.fasterxml.jackson.core:jackson-databind'
```

## Testing Your Endpoint

### Test with curl:
```bash
curl -X POST http://localhost:8080/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Beach vacation with friends",
    "source": "Mumbai", 
    "destination": "Goa",
    "startDate": "2024-12-01",
    "endDate": "2024-12-05",
    "budget": {
      "min": 10000,
      "max": 30000
    },
    "vibe": "adventure"
  }'
```

Expected response:
```json
[
  {
    "id": 1,
    "itinerary": "Amazing Goa Beach Adventure",
    "description": "Experience the beautiful beaches and vibrant nightlife of Goa",
    "matchingScore": 95.5,
    "price": 25000.0,
    "start": "2024-01-30T10:15:30",
    "end": "2024-02-04T10:15:30", 
    "source": "Mumbai",
    "destination": "Goa"
  }
]
```
