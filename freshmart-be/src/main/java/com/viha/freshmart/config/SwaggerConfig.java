package com.viha.freshmart.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "My Spring Boot API",
        version = "1.0",
        description = "API documentation for my Spring Boot application"
    )
)
public class SwaggerConfig {
    
}
