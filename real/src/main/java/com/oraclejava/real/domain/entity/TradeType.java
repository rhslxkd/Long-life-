package com.oraclejava.real.domain.entity;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TradeType {

    sale("매매"),
    jeonse("전세"),
    wolse("월세");

    private String name;

    TradeType(String name) {
        this.name= name;
    }

    //Getter
    @JsonValue
    public String getName() {
        return name;
    }
}
