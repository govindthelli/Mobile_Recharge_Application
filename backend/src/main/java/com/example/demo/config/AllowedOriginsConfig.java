package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AllowedOriginsConfig {

    @Value("${app.allowed.origins}")
    private String origins;

    public String[] getOrigins() {
        return origins.split(",");
    }
}
