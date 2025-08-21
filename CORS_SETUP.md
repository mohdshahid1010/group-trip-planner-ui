# CORS Configuration for Java Backend

## Spring Boot CORS Configuration

### Option 1: Global CORS Configuration (Recommended)
Create a configuration class:

```java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:*", "https://*.netlify.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Option 2: Controller-Level CORS
Add to your search controller:

```java
@RestController
@RequestMapping("/v1")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SearchController {
    
    @PostMapping("/search")
    public ResponseEntity<List<SearchResponseDTO>> search(@RequestBody SearchCriteria criteria) {
        // Your search logic here
        return ResponseEntity.ok(searchResults);
    }
}
```

### Option 3: Method-Level CORS
Add to specific endpoints:

```java
@PostMapping("/search")
@CrossOrigin(origins = "http://localhost:5173")
public ResponseEntity<List<SearchResponseDTO>> search(@RequestBody SearchCriteria criteria) {
    // Your search logic here
    return ResponseEntity.ok(searchResults);
}
```

## For Production Deployment

### Security Considerations:
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/v1/**")
                .allowedOrigins(
                    "http://localhost:5173",           // Development
                    "https://your-app.netlify.app"     // Production
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("Content-Type", "Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## Testing CORS Configuration

### 1. Check if CORS headers are present:
```bash
curl -I -X OPTIONS http://localhost:8080/v1/search \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST"
```

### 2. Expected response headers:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 3600
```

## Troubleshooting

### Common Issues:
1. **Wildcard with credentials**: Can't use `*` for origins when `allowCredentials(true)`
2. **Port changes**: Update allowed origins when frontend port changes
3. **HTTPS/HTTP mismatch**: Ensure protocol matches between frontend and backend
4. **Missing OPTIONS**: Backend must handle preflight OPTIONS requests

### Debug Steps:
1. Check browser network tab for OPTIONS request
2. Verify backend logs show CORS configuration loading  
3. Test with curl commands above
4. Check if backend is running on correct port
