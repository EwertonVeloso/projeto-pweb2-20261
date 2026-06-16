package br.edu.ifpb.financas.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FinancasApiApplication {

    public static void main(String[] args) {
        System.setProperty("server.port", "8080");
        SpringApplication.run(FinancasApiApplication.class, args);
    }

}
