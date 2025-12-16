package com.example.demo.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@Converter(autoApply = true)
public class InstantUtcStringConverter implements AttributeConverter<Instant, String> {
  private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
  @Override public String convertToDatabaseColumn(Instant v) {
    return v == null ? null : LocalDateTime.ofInstant(v, ZoneOffset.UTC).format(FMT);
  }
  @Override public Instant convertToEntityAttribute(String v) {
    return v == null ? null : LocalDateTime.parse(v, FMT).toInstant(ZoneOffset.UTC);
  }
}
