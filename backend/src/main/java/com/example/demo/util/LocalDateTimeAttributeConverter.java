//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
package com.example.demo.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Converter(autoApply = true)
public class LocalDateTimeAttributeConverter implements AttributeConverter<LocalDateTime, String> {
    
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    
    @Override
    public String convertToDatabaseColumn(LocalDateTime localDateTime) {
        return localDateTime == null ? null : localDateTime.format(FORMATTER);
    }
    
    @Override
    public LocalDateTime convertToEntityAttribute(String dbData) {
        return dbData == null || dbData.isEmpty() ? null : LocalDateTime.parse(dbData, FORMATTER);
    }
}
