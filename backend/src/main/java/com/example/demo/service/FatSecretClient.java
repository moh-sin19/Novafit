package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;

import java.time.Instant;
import java.util.Map;

@Component
public class FatSecretClient{

  private final RestTemplate restTemplate = new RestTemplate();
  private final String baseUrl;
  private final String tokenUrl;
  private final String clientId;
  private final String clientSecret;

  private String accessToken;
  private Instant tokenExpiry = Instant.EPOCH;

  public FatSecretClient(
          @Value("${fatsecret.base-url}") String baseUrl,
          @Value("${fatsecret.token-url}") String tokenUrl,
          @Value("${fatsecret.client-id}") String clientId,
          @Value("${fatsecret.client-secret}") String clientSecret) {
      this.baseUrl = baseUrl;
      this.tokenUrl = tokenUrl;
      this.clientId = clientId;
      this.clientSecret = clientSecret;
  }

  private String getToken() {
      // 1. reuse cached token if still valid
      if (accessToken != null && Instant.now().isBefore(tokenExpiry.minusSeconds(60))) {
          return accessToken;
      }

      // 2. prepare request
      LinkedMultiValueMap<String, String> form = new LinkedMultiValueMap<>();
      form.add("grant_type", "client_credentials");
      form.add("scope", "basic");

      HttpHeaders headers = new HttpHeaders();
      headers.setBasicAuth(clientId, clientSecret);
      headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

      HttpEntity<LinkedMultiValueMap<String, String>> entity = new HttpEntity<>(form, headers);

      // 3. perform request
      ResponseEntity<Map<String, Object>> response =
              restTemplate.exchange(
                      tokenUrl,
                      HttpMethod.POST,
                      entity,
                      new ParameterizedTypeReference<Map<String, Object>>() {}
              );

      Map<String, Object> body = response.getBody();

      // 4. handle null / bad responses safely
      if (body == null || body.get("access_token") == null) {
          throw new IllegalStateException("Failed to obtain access token from FatSecret API: response body is null");
      }

      Object expiresObj = body.get("expires_in");
      if (!(expiresObj instanceof Number)) {
          throw new IllegalStateException("FatSecret API did not return a valid expires_in value");
      }

      // 5. cache token
      accessToken = body.get("access_token").toString();
      int expiresIn = ((Number) expiresObj).intValue();
      tokenExpiry = Instant.now().plusSeconds(expiresIn);

      return accessToken;
  }

  public Map<String, Object> foodsSearch(String q, int page, int size) {
      String url = baseUrl
          + "?method=foods.search&format=json"
          + "&search_expression={q}&page_number={p}&max_results={s}";

      HttpHeaders headers = new HttpHeaders();
      headers.setBearerAuth(getToken());
      HttpEntity<Void> entity = new HttpEntity<>(headers);

      try {
          ResponseEntity<Map<String, Object>> resp =
              restTemplate.exchange(url, HttpMethod.GET, entity,
                  new ParameterizedTypeReference<Map<String, Object>>() {}, q, page, size);

          Map<String, Object> body = resp.getBody();
          if (body == null) {
              throw new IllegalStateException("FatSecret foods.search returned empty body");
          }
          // If FatSecret sent { "error": { ... } }, bubble it up nicely
          Object err = body.get("error");
          if (err != null) {
              throw new IllegalStateException("FatSecret error: " + err);
          }
          return body;
      } catch (HttpStatusCodeException e) {
          // log the exact response to debug quickly
          String payload = e.getResponseBodyAsString();
          throw new IllegalStateException("FatSecret HTTP " + e.getStatusCode() + ": " + payload, e);
      }
  }

  public Map<String, Object> foodGet(String foodId) {
      String url = baseUrl + "?method=food.get&format=json&food_id={id}";

      HttpHeaders headers = new HttpHeaders();
      headers.setBearerAuth(getToken());

      try {
          ResponseEntity<Map<String,Object>> resp = restTemplate.exchange(
              url, HttpMethod.GET, new HttpEntity<>(headers),
              new ParameterizedTypeReference<Map<String,Object>>() {}, foodId
          );
          Map<String,Object> body = resp.getBody();
          if (body == null) throw new IllegalStateException("FatSecret food.get returned empty body");
          if (body.get("error") != null) throw new IllegalStateException("FatSecret error: " + body.get("error"));
          return body;
      } catch (HttpStatusCodeException e) {
          throw new IllegalStateException("FatSecret HTTP " + e.getStatusCode() + ": " + e.getResponseBodyAsString(), e);
      }
  }

}