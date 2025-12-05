package com.oraclejava.real.domain.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;

@Converter(autoApply = true)
public class TradeTypeConverter implements AttributeConverter<TradeType, String> {

    //TradeType dmf String으로 저장(DB저장용)
    @Override
    public String convertToDatabaseColumn(TradeType tradeType) {
        return tradeType == null ? null : tradeType.getName();
    }

    // String -> TradeType (화면표시용)
    @Override
    public TradeType convertToEntityAttribute(String s) {
        return Arrays.stream(TradeType.values())
                .filter(t -> t.getName().equals(s))
                .findFirst()
                .orElse(null);
    }
}
