package com.programalilian.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger configuration for API documentation.
 * Provides interactive API documentation at /swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Programa Lilian API")
                        .description("Backend API for Programa Lilian - Member donations and management platform")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Programa Lilian Development Team")
                                .email("contact@programalilian.org"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));

    }
}
