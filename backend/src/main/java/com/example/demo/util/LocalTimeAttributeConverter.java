package com.example.demo.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Converter(autoApply = true)
public class LocalTimeAttributeConverter implements AttributeConverter<LocalTime, String> {
  private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("HH:mm:ss");
  @Override public String convertToDatabaseColumn(LocalTime v) { return v == null ? null : v.format(FMT); }
  @Override public LocalTime convertToEntityAttribute(String v) { return v == null ? null : LocalTime.parse(v, FMT); }
}
