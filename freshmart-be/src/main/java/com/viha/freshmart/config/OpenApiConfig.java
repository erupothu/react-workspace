package com.viha.freshmart.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FreshMart API")
                        .description("REST API for FreshMart e-commerce platform with image upload capabilities")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("FreshMart Team")
                                .email("support@freshmart.com")))
                .addServersItem(new Server()
                        .url("http://localhost:9090")
                        .description("Local development server"));
    }
}
